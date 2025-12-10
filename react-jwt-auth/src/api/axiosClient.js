import axios from 'axios';
import { 
  MOCK_API, 
  verifyRefreshToken,
  getTokenRemainingTime,
  generateMockResponse 
} from './mockEndpoints';

const axiosClient = axios.create({
  baseURL: '',
  timeout: 10000,
});

let accessToken = null;
let refreshToken = localStorage.getItem('refreshToken');
let checkInterval = null;
let isModalShown = false;

// Store navigate function
let globalNavigate = null;

export const getTokens = () => ({
  accessToken,
  refreshToken
});

// Function to set navigate from React component
export const setNavigate = (navigateFunc) => {
  globalNavigate = navigateFunc;
};

const showExpiredModal = () => {
  if (isModalShown) return;
  isModalShown = true;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    max-width: 400px;
    width: 90%;
  `;

  content.innerHTML = `
    <h2 style="margin-bottom: 15px;">Phiên làm việc đã hết hạn</h2>
    <p style="margin-bottom: 25px;">Vui lòng đăng nhập lại để tiếp tục.</p>
    <button id="modal-ok-btn" 
            style="background: #007bff; 
                   color: white; 
                   border: none; 
                   padding: 10px 30px; 
                   border-radius: 4px; 
                   cursor: pointer;">
      Đăng nhập lại
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById('modal-ok-btn').onclick = () => {
    document.body.removeChild(modal);
    isModalShown = false;
    logout();
  };
};

const checkTokenExpiry = async () => {
  if (!refreshToken) return;

  const remainingTime = getTokenRemainingTime(refreshToken);
  const isValid = await verifyRefreshToken(refreshToken);

  if (remainingTime <= 0 || !isValid) {
    clearInterval(checkInterval);
    
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath === '/login' || currentPath === '/';
    
    if (!isLoginPage) {
      showExpiredModal();
    } else {
      logout();
    }
  }
};

const startTokenCheck = () => {
  clearInterval(checkInterval);
  checkInterval = setInterval(checkTokenExpiry, 1000);
};

const stopTokenCheck = () => {
  clearInterval(checkInterval);
  checkInterval = null;
};

const logout = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('saved_username');
  stopTokenCheck();
  isModalShown = false;
  
  // Use navigate if available
  if (globalNavigate) {
    try {
      globalNavigate('/login', { replace: true });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback
      window.location.href = '/login';
    }
  } else {
    console.warn('Navigate function not set. Using fallback.');
    window.location.href = '/login';
  }
};

export const setTokens = (newAccessToken, newRefreshToken) => {
  accessToken = newAccessToken;
  if (newRefreshToken) {
    refreshToken = newRefreshToken;
    localStorage.setItem('refreshToken', newRefreshToken);
    startTokenCheck();
  }
};

export const clearTokens = () => {
  logout();
};

axiosClient.interceptors.request.use(
  (config) => {
    if (config.url === MOCK_API.LOGIN) {
      config.adapter = async () => {
        const { username, email, password } = JSON.parse(config.data);
        const isValid = email === 'test@example.com' && password === 'password123';
        
        const response = await generateMockResponse('login', { 
          shouldFail: !isValid,
          email: email,
          name: username
        });
        
        if (isValid) {
          setTokens(response.data.accessToken, response.data.refreshToken);
        }
        
        return Promise.resolve(response);
      };
    } else if (config.url === MOCK_API.REFRESH) {
      config.adapter = async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const isValid = storedRefreshToken && await verifyRefreshToken(storedRefreshToken);
        
        const response = await generateMockResponse('refresh', {
          shouldFail: !isValid
        });
        
        if (isValid) {
          setTokens(response.data.accessToken, response.data.refreshToken);
        } else {
          setTimeout(() => logout(), 100);
        }
        
        return Promise.resolve(response);
      };
    } else if (config.url === MOCK_API.USER_DATA) {
      config.adapter = async () => {
        if (!accessToken) {
          logout();
          return Promise.reject({ response: { status: 401 } });
        }
        
        const remainingTime = getTokenRemainingTime(accessToken);
        if (remainingTime <= 0) {
          logout();
          return Promise.reject({ response: { status: 401 } });
        }
        
        const response = generateMockResponse('userData');
        return Promise.resolve(response);
      };
    } else if (config.url === MOCK_API.LOGOUT) {
      config.adapter = async () => {
        logout();
        return Promise.resolve({ 
          status: 200, 
          data: { message: 'Logged out successfully' } 
        });
      };
    }
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axiosClient.post(MOCK_API.REFRESH);
        
        const { accessToken: newAccessToken } = refreshResponse.data;
        setTokens(newAccessToken, null);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }
    
    if (error.response?.status === 403 || error.response?.status === 400) {
      const message = error.response?.data?.message || '';
      if (message.toLowerCase().includes('token') || 
          message.toLowerCase().includes('expired') ||
          message.toLowerCase().includes('invalid')) {
        logout();
      }
    }
    
    return Promise.reject(error);
  }
);

// Khởi tạo kiểm tra token nếu có
if (localStorage.getItem('refreshToken')) {
  startTokenCheck();
}

export default axiosClient;
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

export const getTokens = () => ({
  accessToken,
  refreshToken
});

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
      OK
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
    showExpiredModal()
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
  stopTokenCheck();
  isModalShown = false;
  window.location.href = '/login';
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
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('refreshToken');
  stopTokenCheck();
  isModalShown = false;
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
        }
        
        return Promise.resolve(response);
      };
    } else if (config.url === MOCK_API.USER_DATA) {
      config.adapter = async () => {
        if (!accessToken) {
          return Promise.reject({ response: { status: 401 } });
        }
        
        const response = generateMockResponse('userData');
        return Promise.resolve(response);
      };
    } else if (config.url === MOCK_API.LOGOUT) {
      config.adapter = async () => {
        logout();
        return Promise.resolve({ status: 200, data: { message: 'Logged out' } });
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
        const refreshResponse = await axiosClient.post(MOCK_API.REFRESH, {
          refreshToken: localStorage.getItem('refreshToken')
        });
        
        const { accessToken: newAccessToken } = refreshResponse.data;
        setTokens(newAccessToken, null);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch {
        return Promise.reject(error);
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
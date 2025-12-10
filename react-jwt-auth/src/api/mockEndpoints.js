import * as jose from 'jose';
import { MY_KEY_ACCESS, MY_KEY_REFRESH } from '../.env';

const MOCK_API = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  USER_DATA: '/user/me',
  LOGOUT: '/auth/logout'
};

const TOKEN_LIFETIMES = {
  ACCESS_TOKEN: 5,
  REFRESH_TOKEN: 15
};

let username = "";

const SECRET_KEY = new TextEncoder().encode(MY_KEY_ACCESS);
const REFRESH_SECRET_KEY = new TextEncoder().encode(MY_KEY_REFRESH);

// Tạo access token với jose
const createAccessToken = async (payload) => {
  try {
    const jwt = await new jose.SignJWT({
      ...payload,
      type: 'access'
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_LIFETIMES.ACCESS_TOKEN}s`)
    .sign(SECRET_KEY);

    return jwt;

  } catch (error) {
    console.error('Error creating access token:', error);
    throw new Error('Failed to create access token');
  }
};


// Tạo refresh token với jose
const createRefreshToken = async (payload) => {
  const jwt = await new jose.SignJWT({
    ...payload,
    type: 'refresh'
  })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime(`${TOKEN_LIFETIMES.REFRESH_TOKEN}s`)
  .sign(REFRESH_SECRET_KEY);
  
  return jwt;
};

// Xác thực refresh token
const verifyRefreshToken = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
};

// Lấy thời gian còn lại của token (giây)
const getTokenRemainingTime = (token) => {
  try {
    const decoded = jose.decodeJwt(token);
    if (!decoded || !decoded.exp) return 0;
    
    const now = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - now;
    
    return Math.max(0, remaining);
  } catch {
    return 0;
  }
};

// Mock data generator
const generateMockResponse = async (type, data) => {


  if (data?.name) {
    username = data.name;
    localStorage.setItem('saved_username', data.name); 
  }

  const baseUser = {
    id: 1,
    email: data?.email || 'test@gmail.com',
    name: username || 'Nguyễn Nhật Duy'
  };

  const mockResponses = {
    login: {
      success: {
        status: 200,
        data: {
          accessToken: await createAccessToken({
            userId: baseUser.id,
            email: baseUser.email,
            name: baseUser.name,
            role: 'user'
          }),
          refreshToken: await createRefreshToken({
            userId: baseUser.id,
            email: baseUser.email
          }),
          expiresIn: TOKEN_LIFETIMES.ACCESS_TOKEN,
          refreshExpiresIn: TOKEN_LIFETIMES.REFRESH_TOKEN,
          user: baseUser
        }
      },
      error: {
        status: 401,
        data: { 
          message: 'Invalid credentials',
          errorCode: 'AUTH_001'
        }
      }
    },
    refresh: {
      success: {
        status: 200,
        data: {
          accessToken: await createAccessToken({
            userId: baseUser.id,
            email: baseUser.email,
            name: baseUser.name,
            role: 'user'
          }),
          refreshToken: await createRefreshToken({
            userId: baseUser.id,
            email: baseUser.email
          }),
          expiresIn: TOKEN_LIFETIMES.ACCESS_TOKEN,
          refreshExpiresIn: TOKEN_LIFETIMES.REFRESH_TOKEN
        }
      },
      error: {
        status: 401,
        data: { 
          message: 'Refresh token expired',
          errorCode: 'AUTH_002'
        }
      }
    },
    userData: {
      success: {
        status: 200,
        data: {
          id: 1,
          email: baseUser.email,
          name: baseUser.name,
          role: 'user'
        }
      },
      error: {
        status: 401,
        data: { 
          message: 'Unauthorized',
          errorCode: 'AUTH_003'
        }
      }
    },
    logout: {
      success: {
        status: 200,
        data: { 
          message: 'Logged out successfully'
        }
      }
    }
  };

  const response = mockResponses[type]?.[data?.shouldFail ? 'error' : 'success'] || mockResponses[type]?.success;
  
  // Đảm bảo tokens được tạo async
  if (type === 'login' || type === 'refresh') {
    if (!data?.shouldFail) {
      // Tokens đã được tạo async ở trên
      return response;
    }
  }
  
  return response;
};

export { 
  MOCK_API, 
  verifyRefreshToken,
  getTokenRemainingTime,
  generateMockResponse 
};
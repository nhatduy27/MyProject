import { apiClient } from './client';
import { RegisterRequest, RegisterResponse } from '../types/user';

export const userApi = {
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/user/register', userData);
    return response.data;
  },
};
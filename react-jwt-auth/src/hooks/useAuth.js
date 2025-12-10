import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient, { setTokens, clearTokens } from '../api/axiosClient';
import { MOCK_API } from '../api/mockEndpoints';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosClient.post(MOCK_API.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        await axiosClient.post(MOCK_API.LOGOUT);
      } catch (error) {
        console.log('Logout API error (proceeding anyway):', error);
      }
    },
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
    },
    onError: () => {
     
      clearTokens();
      queryClient.clear();
    }
  });
};

export const useUserData = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get(MOCK_API.USER_DATA);
      return response.data;
    }
  });
};
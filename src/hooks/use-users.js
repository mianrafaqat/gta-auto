import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from 'src/services';

// Query Keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

// Get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => UserService.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data) => UserService.forgotPassword(data),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data) => UserService.updatePassword(data),
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => UserService.editProfile(data),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}; 
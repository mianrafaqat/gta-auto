import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "src/services";
import ProductService from "src/services/products/products.service";

// Query Keys
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
  favorites: () => [...productKeys.all, "favorites"],
  myProducts: (userId) => [...productKeys.all, "myProducts", userId],
};

// Get all products
export const useGetAllProducts = (filters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => ProductService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get product by ID
export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => ProductService.getById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user favorite products
export const useGetUserFavoriteProducts = (userId) => {
  return useQuery({
    queryKey: [...productKeys.favorites(), userId],
    queryFn: () => UserService.getUserFavoriteProducts({ userId: userId }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useAddOrRemoveFavoriteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => UserService.addOrRemoveFavoriteProduct(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: productKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });

      // Return the response data for the component to use
      return response;
    },
    onError: (error) => {
      console.error("Error adding/removing favorite product:", error);
      throw error;
    },
  });
};

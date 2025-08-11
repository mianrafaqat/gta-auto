import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersService } from "src/services";
import { ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from "src/utils/constants";

// Helper function to check admin role
const checkAdminRole = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    throw new Error("Authentication required");
  }

  const userStr = localStorage.getItem(STORAGE_USER_KEY);
  if (!userStr) {
    throw new Error("Authentication required");
  }

  const userData = JSON.parse(userStr);
  if (
    !userData.role ||
    (userData.role !== "admin" && userData.role !== "superadmin")
  ) {
    throw new Error("You do not have permission to access this resource");
  }
};

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error("Authentication required");
      }
      return OrdersService.createOrder(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

// Get all orders (Admin)
export function useGetAllOrders() {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      // Check admin role before making the request
      checkAdminRole();
      return OrdersService.getAllOrders();
    },
    retry: false,
  });
}

// Get order by ID
export function useGetOrderById(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error("Authentication required");
      }
      return OrdersService.getOrderById(id);
    },
    enabled: !!id,
  });
}

// Update order status (Admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Check admin role before making the request
      checkAdminRole();
      return OrdersService.updateOrderStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

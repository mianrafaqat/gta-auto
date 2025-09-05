import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersService } from "src/services";
import { ACCESS_TOKEN_KEY, STORAGE_USER_KEY } from "src/utils/constants";
import { transformApiOrderToComponent } from "src/utils/order-transformer";

// Helper function to check if user is authenticated
const checkAuthentication = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    throw new Error("Please log in to access orders");
  }
  return token;
};

// Helper function to check admin role
const checkAdminRole = () => {
  const token = checkAuthentication();

  const userStr = localStorage.getItem(STORAGE_USER_KEY);
  if (!userStr) {
    throw new Error("User information not found");
  }

  try {
    const userData = JSON.parse(userStr);
    if (
      !userData.role ||
      (userData.role !== "admin" && userData.role !== "superadmin")
    ) {
      throw new Error("You do not have permission to access this resource");
    }
  } catch (parseError) {
    throw new Error("Invalid user data");
  }
};

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => {
      checkAuthentication();
      return OrdersService.create(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

// Get all orders (Admin) - with fallback to user's own orders
export function useGetAllOrders() {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      try {
        // First try to get all orders (admin only)
        // checkAdminRole();
        const result = await OrdersService.getAll();
        console.log("✅ [HOOK] getAllOrders success:", result);
        return result;
      } catch (error) {
        // If admin check fails or we get a 403, fall back to user's own orders
        console.log("✅ [HOOK] getAllOrders error:", error);
          try {
            const userOrders = await OrdersService.getMyOrders();
            console.log("✅ [HOOK] getMyOrders success:", userOrders);
            return userOrders;
          } catch (userError) {
            throw userError;
            }
        
        throw adminError;
      }
    },
    retry: false,
  });
}

// Get user's own orders
export function useGetMyOrders(params = {}) {
  return useQuery({
    queryKey: ["orders", "my", params],
    queryFn: async () => {
      checkAuthentication();
      return OrdersService.getMyOrders(params);
    },
    retry: false,
  });
}

// Get order by ID
export function useGetOrderById(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      try {
        // checkAuthentication();

        // First try to get the order from user's orders list
        try {
          
          const userOrders = await OrdersService.getMyOrders();

          // Find the specific order in the user's orders
          const order =
            userOrders.orders?.find((order) => order.orderNumber === id) ||
            userOrders.find((order) => order.orderNumber === id);

          if (order) {
            // Transform the order to ensure it has the correct format
            const transformedOrder = transformApiOrderToComponent(order);
            return transformedOrder;
          }
        } catch (userOrdersError) {
         
        }

        // If not found in user orders, try the individual endpoint
       
        const result = await OrdersService.getById(id);
        // Transform the result to ensure it has the correct format
        const transformedResult = transformApiOrderToComponent(result);
        
        return transformedResult;
      } catch (error) {
        
        throw error;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

// Update order status (Admin)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // checkAdminRole();
      return OrdersService.updateStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

// Add tracking information to an order (Admin)
export function useAddTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // checkAdminRole();
      return OrdersService.addTracking(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

// Delete order (Admin)
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // checkAdminRole();
      return OrdersService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

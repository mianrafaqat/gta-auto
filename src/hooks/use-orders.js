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
<<<<<<< Updated upstream
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error("Authentication required");
      }
=======
      checkAuthentication();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      // Check admin role before making the request
      checkAdminRole();
      return OrdersService.getAll();
=======
      try {
        // First try to get all orders (admin only)
        checkAdminRole();
        const result = await OrdersService.getAll();
        return result;
      } catch (adminError) {
        // If admin check fails or we get a 403, fall back to user's own orders
        if (adminError.message.includes("permission") || 
            adminError.message.includes("admin") || 
            adminError.status === 403 ||
            adminError.isForbidden) {
          try {
            const userOrders = await OrdersService.getMyOrders();
            return userOrders;
          } catch (userError) {
            throw userError;
          }
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
>>>>>>> Stashed changes
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
        checkAuthentication();
        
        // First try to get the order from user's orders list
        try {
          console.log("🔄 [HOOK] Trying to get order from user's orders list first...");
          const userOrders = await OrdersService.getMyOrders();
          
          // Find the specific order in the user's orders
          const order = userOrders.orders?.find(order => order._id === id) || 
                       userOrders.find(order => order._id === id);
          
          if (order) {
            console.log("✅ [HOOK] Found order in user's orders list");
            // Transform the order to ensure it has the correct format
            const transformedOrder = transformApiOrderToComponent(order);
            console.log("✅ [HOOK] Transformed order:", transformedOrder);
            return transformedOrder;
          }
        } catch (userOrdersError) {
          console.log("⚠️ [HOOK] Couldn't get user orders, trying individual endpoint");
        }
        
        // If not found in user orders, try the individual endpoint
        console.log("🔄 [HOOK] Trying individual order endpoint...");
        const result = await OrdersService.getById(id);
        // Transform the result to ensure it has the correct format
        const transformedResult = transformApiOrderToComponent(result);
        console.log("✅ [HOOK] Transformed result:", transformedResult);
        return transformedResult;
      } catch (error) {
        console.log("❌ [HOOK] getById error:", error);
        throw error;
      }
<<<<<<< Updated upstream
      return OrdersService.getById(id);
=======
>>>>>>> Stashed changes
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
      checkAdminRole();
      return OrdersService.updateStatus(id, data);
<<<<<<< Updated upstream
=======
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
      checkAdminRole();
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
      checkAdminRole();
      return OrdersService.delete(id);
>>>>>>> Stashed changes
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}

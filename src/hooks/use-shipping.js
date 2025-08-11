import { useMutation, useQuery } from "@tanstack/react-query";
import { ShippingService } from "src/services";

// Get all shipping methods
export function useGetShippingMethods() {
  return useQuery({
    queryKey: ["shipping-methods"],
    queryFn: () => ShippingService.getAllMethods(),
    refetchOnWindowFocus: false,
  });
}

// Get shipping method by ID
export function useGetShippingMethod(id) {
  return useQuery({
    queryKey: ["shipping-method", id],
    queryFn: () => ShippingService.getMethodById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

// Create shipping method
export function useCreateShippingMethod() {
  return useMutation({
    mutationFn: (data) => ShippingService.createMethod(data),
  });
}

// Update shipping method
export function useUpdateShippingMethod() {
  return useMutation({
    mutationFn: ({ id, data }) => ShippingService.updateMethod(id, data),
  });
}

// Delete shipping method
export function useDeleteShippingMethod() {
  return useMutation({
    mutationFn: (id) => ShippingService.deleteMethod(id),
  });
}

// Calculate shipping
export function useCalculateShipping() {
  return useMutation({
    mutationFn: (data) => ShippingService.calculateShipping(data),
  });
}

// Get available shipping methods
export function useGetAvailableShippingMethods() {
  return useMutation({
    mutationFn: (data) => ShippingService.getAvailableMethods(data),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CarsService } from "src/services";

// Query Keys
export const carKeys = {
  all: ["cars"],
  lists: () => [...carKeys.all, "list"],
  list: (filters) => [...carKeys.lists(), filters],
  details: () => [...carKeys.all, "detail"],
  detail: (id) => [...carKeys.details(), id],
  makes: () => [...carKeys.all, "makes"],
  models: () => [...carKeys.all, "models"],
  bodyTypes: () => [...carKeys.all, "bodyTypes"],
  deals: () => [...carKeys.all, "deals"],
  favorites: () => [...carKeys.all, "favorites"],
  myCars: (userId) => [...carKeys.all, "myCars", userId],
};

// Get all cars
export const useGetAllCars = (filters = {}) => {
  return useQuery({
    queryKey: carKeys.list(filters),
    queryFn: () => CarsService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get car by ID
export const useGetCarById = (carId) => {
  return useQuery({
    queryKey: carKeys.detail(carId),
    queryFn: () => CarsService.getCarById(carId),
    enabled: !!carId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get car details by registration number
export const useGetCarByRegNo = (regNo) => {
  return useQuery({
    queryKey: [...carKeys.details(), "regNo", regNo],
    queryFn: () => CarsService.getDetailsByRegNo(regNo),
    enabled: !!regNo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get my cars
export const useGetMyCars = (userId) => {
  return useQuery({
    queryKey: carKeys.myCars(userId),
    queryFn: () => CarsService.getMyCars(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get car makes
export const useGetCarMakes = () => {
  return useQuery({
    queryKey: carKeys.makes(),
    queryFn: () => CarsService.getCarMakes(),
    staleTime: 30 * 60 * 1000, // 30 minutes (rarely changes)
  });
};

// Get car models
export const useGetCarModels = (selectedCar) => {
  return useQuery({
    queryKey: [...carKeys.models(), selectedCar],
    queryFn: () => CarsService.getCarModels({ selectedCar }),
    enabled: !!selectedCar,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get car models by year
export const useGetCarModelsByYear = (selectedCar, year) => {
  return useQuery({
    queryKey: [...carKeys.models(), selectedCar, year],
    queryFn: () => CarsService.getCarModelsByYear({ selectedCar, year }),
    enabled: !!(selectedCar && year),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Filter by make and model
export const useFilterByMakeAndModel = (make, model) => {
  return useQuery({
    queryKey: [...carKeys.lists(), "filter", make, model],
    queryFn: () => CarsService.filterByMakeAndModel({ make, model }),
    enabled: !!(make && model),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get car body list
export const useGetCarBodyList = () => {
  return useQuery({
    queryKey: carKeys.bodyTypes(),
    queryFn: () => CarsService.getCarBodyList(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get car deal options
export const useGetCarDealOptions = () => {
  return useQuery({
    queryKey: carKeys.deals(),
    queryFn: () => CarsService.getCarDealOptions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get user favorite cars
export const useGetUserFavoriteCars = (userId) => {
  return useQuery({
    queryKey: [...carKeys.favorites(), userId],
    queryFn: () => CarsService.getUserFavouriteCar({ userID: userId }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useAddOrRemoveFavoriteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => CarsService.addOrRemoveFavouriteCar(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: carKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: carKeys.all });

      // Return the response data for the component to use
      return response;
    },
    onError: (error) => {
      console.error("Error adding/removing favorite:", error);
      throw error;
    },
  });
};

export const useAddNewCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => CarsService.add(data),
    onSuccess: () => {
      // Invalidate and refetch cars list
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => CarsService.updateCar(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch specific car and cars list
      queryClient.invalidateQueries({
        queryKey: carKeys.detail(variables._id),
      });
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => CarsService.deleteCarById(data),
    onSuccess: () => {
      // Invalidate and refetch cars list
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });
    },
  });
};

export const useUploadCarImages = () => {
  return useMutation({
    mutationFn: (files) => CarsService.uploadCarImages(files),
  });
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: (data) => CarsService.sendEmail(data),
  });
};

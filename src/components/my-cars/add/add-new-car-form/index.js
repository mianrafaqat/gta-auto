import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Box,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FormProvider from "src/components/hook-form/form-provider";
import { useState } from "react";
import { CarsService } from "src/services";
import AddCarDetails from "./stepper/add-car-details";
import UploadCarsImages from "./stepper/upload-cars-images";
import Iconify from "src/components/iconify/iconify";
import AdditionalInformation from "./stepper/additional-information";
import { useSnackbar } from "src/components/snackbar";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "src/routes/paths";
import { useAuthContext } from "src/auth/hooks";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const numberToStringTransform = (value, originalValue) => {
  // Convert number to string
  if (!isNaN(originalValue) || typeof value === "boolean") {
    return originalValue.toString();
  }
  return value;
};

const schema = yup.object().shape({
  price: yup.string().required("Price is required."),
  description: yup.string().required("Description is required."),
  image: yup
    .array()
    .min(3, "Minimum of 3 images required")
    .max(9, "Maximum of 9 images allowed")
    .required("At least one image is required."),
  carDetails: yup.object().shape({
    make: yup.string().required("Make is required."),
    yearOfManufacture: yup
      .string()
      .transform(numberToStringTransform)
      .required("Year of manufacture is required."),
    engineCapacity: yup
      .string()
      .transform(numberToStringTransform)
      .required("Engine capacity is required."),
    fuelType: yup.string().required("Fuel type is required."),
    colour: yup.string().required("Colour is required."),

    mileage: yup.string().required("Mileage is required."),
    model: yup.string().required("Model is required."),
    features: yup.array(),
    makeType: yup.string(),
    driveTrain: yup.string(),
    doorPlan: yup.string(),
    tel: yup.string().required("Phone is required."),
  }),
  title: yup.string().required("Title is required."),
  category: yup.string().required("Category is required."),
  link: yup.string(),
  location: yup.string().required("Location is required."),
  postalCode: yup.string().required("Postal Code is required."),
  saleAs: yup.string().required('Sale As is required').nullable(),
  companyOrSellerName: yup.string().required('Required').nullable()
});

export default function AddNewCarForm({ isEditMode = false }) {
  const params = useSearchParams();
  const carID = params.get("carId");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user = {} } = useAuthContext()?.user || {};
  const queryClient = useQueryClient();

  // Query for fetching car details in edit mode
  const { data: carData, isLoading: isLoadingCarData } = useQuery({
    queryKey: ['car', carID],
    queryFn: async () => {
      const res = await CarsService.getCarById(carID);
      if (res?.status === 200 && res?.data) {
        return res.data;
      }
      throw new Error('Failed to fetch car data');
    },
    enabled: Boolean(isEditMode && carID),
  });

  const defaultValues = {
    carDetails: {
      make: '',
      yearOfManufacture: '',
      engineCapacity: '',
      fuelType: '',
      colour: '',
      model: '',
      features: [],
      makeType: '',
      driveTrain: '',
      doorPlan: '',
      variant: '',
      tel: '',
    },
    category: 'sale',
    title: '',
    description: '',
    image: [],
    location: '',
    postalCode: '',
    price: '',
    saleAs: '',
    companyOrSellerName: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: isEditMode ? {} : defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
    watch,
  } = methods;

  const [activeStep, setActiveStep] = useState(0);

  // Mutation for updating car
  const updateCarMutation = useMutation({
    mutationFn: (data) => CarsService.updateCar(data),
    onSuccess: (res) => {
      if (res?.status === 200) {
        enqueueSnackbar(res?.data, { variant: "success" });
        queryClient.invalidateQueries(['cars', 'all']);
        router.push(paths.dashboard.cars.my.list);
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to update car', { variant: "error" });
    },
  });

  // Mutation for adding new car
  const addCarMutation = useMutation({
    mutationFn: async (values) => {
      const imageRes = await CarsService.uploadCarImages(values.image);
      if (imageRes?.data?.imagesUrl) {
        const data = {
          ...values,
          image: imageRes.data.imagesUrl,
          owner: { ...user },
        };
        return CarsService.add(data);
      }
      throw new Error('Failed to upload images');
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        enqueueSnackbar(res?.data, { variant: "success" });
        queryClient.invalidateQueries(['cars', 'all']);
        router.push(paths.dashboard.cars.my.list);
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to add car', { variant: "error" });
    },
  });

  // Set form data when car data is fetched
  useEffect(() => {
    if (isEditMode && carData) {
      console.log('Setting form data:', carData);
      reset(carData);
    }
  }, [isEditMode, carData, reset]);

  const onSubmit = handleSubmit((values) => {
    if (isEditMode) {
      updateCarMutation.mutate({
        ...values,
        carID,
        ownerID: user?._id,
      });
    } else {
      addCarMutation.mutate(values);
    }
  });

  const STEPPER = [
    {
      label: "Add Car Details",
      step: (
        <AddCarDetails isEditMode={isEditMode} setActiveStep={setActiveStep} />
      ),
    },
    {
      label: (
        <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <Box>Upload Images</Box>
          <Tooltip
            title="Only PNG, JPEG, and JPG formats are permissible for uploads. You can upload a minimum of 3 images and a maximum of 9 images"
            sx={{ ml: 1 }}
          >
            <Iconify
              sx={{ cursor: "pointer" }}
              icon="material-symbols:info-outline"
            />
          </Tooltip>
        </Box>
      ),
      step: (
        <UploadCarsImages
          isEditMode={isEditMode}
          setActiveStep={setActiveStep}
        />
      ),
    },
    {
      label: "Additional Information - Final Step",
      step: (
        <AdditionalInformation
          isEditMode={isEditMode}
          loading={updateCarMutation.isLoading || addCarMutation.isLoading}
          setActiveStep={setActiveStep}
        />
      ),
    },
  ];

  if (isEditMode && isLoadingCarData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEPPER.map((s, index) => (
            <Step key={index}>
              <StepLabel>{s.label}</StepLabel>
              <StepContent>{s.step}</StepContent>
            </Step>
          ))}
        </Stepper>
      </FormProvider>
    </Box>
  );
}

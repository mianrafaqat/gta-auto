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

// Custom validation for images that can handle both URLs and files
const validateImages = (value) => {
  if (!value || !Array.isArray(value)) {
    return false;
  }
  
  // Check if each item is either a string (URL) or File object
  const isValid = value.every(item => 
    typeof item === 'string' || item instanceof String || item instanceof File
  );
  
  return isValid;
};

const schema = yup.object().shape({
  price: yup.string().when('category', {
    is: 'rent',
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Price is required."),
  }),
  description: yup.string().required("Description is required."),
  image: yup
    .array()
    .min(3, "Minimum of 3 images required")
    .max(9, "Maximum of 9 images allowed")
    .required("At least one image is required.")
    .test('valid-image-format', 'Images must be URLs or files', validateImages),
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
    
    // Rental-specific fields
    dailyRate: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.required("Daily rate is required for rental."),
      otherwise: (schema) => schema.optional(),
    }),
    weeklyRate: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
    monthlyRate: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
    securityDeposit: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.required("Security deposit is required for rental."),
      otherwise: (schema) => schema.optional(),
    }),
    minimumRentalPeriod: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.required("Minimum rental period is required."),
      otherwise: (schema) => schema.optional(),
    }),
    availableFromDate: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.required("Available from date is required."),
      otherwise: (schema) => schema.optional(),
    }),
    availableToDate: yup.string().when('$category', {
      is: 'rent',
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  title: yup.string().required("Title is required."),
  category: yup.string().required("Category is required."),
  link: yup.string(),
  location: yup.string().required("Location is required."),
  postalCode: yup.string().required("Postal Code is required."),
  saleAs: yup.string().when('category', {
    is: 'sale',
    then: (schema) => schema.required('Sale As is required').nullable(),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  companyOrSellerName: yup.string().when('category', {
    is: 'sale',
    then: (schema) => schema.required('Required').nullable(),
    otherwise: (schema) => schema.optional().nullable(),
  })
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
      // Rental fields
      dailyRate: '',
      weeklyRate: '',
      monthlyRate: '',
      securityDeposit: '',
      minimumRentalPeriod: '',
      availableFromDate: '',
      availableToDate: '',
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
    mutationFn: async (data) => {
      console.log('Starting car update with data:', data);
      
      // Separate existing image URLs from new file uploads
      const existingImageUrls = [];
      const newImageFiles = [];
      
      if (data.image && Array.isArray(data.image)) {
        data.image.forEach(item => {
          if (typeof item === 'string' || item instanceof String) {
            // This is an existing image URL
            existingImageUrls.push(item);
          } else if (item instanceof File) {
            // This is a new file that needs to be uploaded
            newImageFiles.push(item);
          }
        });
      }
      
      console.log('Existing image URLs:', existingImageUrls);
      console.log('New image files to upload:', newImageFiles);
      
      let finalImageUrls = [...existingImageUrls];
      
      // Upload new images if any
      if (newImageFiles.length > 0) {
        console.log('Uploading new images...');
        const imageRes = await CarsService.uploadCarImages(newImageFiles);
        console.log('New images upload response:', imageRes);
        
        if (imageRes?.data?.success === true && Array.isArray(imageRes.data.urls)) {
          finalImageUrls = [...existingImageUrls, ...imageRes.data.urls];
          console.log('Final image URLs after upload:', finalImageUrls);
        } else {
          console.error('Failed to upload new images:', imageRes?.data);
          throw new Error(imageRes?.data?.message || 'Failed to upload new images');
        }
      }
      
      // Prepare final update data with image URLs
      const updateData = {
        ...data,
        image: finalImageUrls,
      };
      
      console.log('Sending update request with data:', updateData);
      return CarsService.update(updateData);
    },
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
      console.log('Starting image upload with values:', values.image);
      const imageRes = await CarsService.uploadCarImages(values.image);
      console.log('Image upload response:', imageRes);
      
      // Check if we have a response and data
      if (!imageRes || !imageRes.data) {
        console.error('No response or data from upload');
        throw new Error('No response from upload service');
      }

      // Log the actual response data
      console.log('Upload response data:', {
        success: imageRes.data.success,
        urls: imageRes.data.urls,
        message: imageRes.data.message
      });

      if (imageRes.data.success === true && Array.isArray(imageRes.data.urls)) {
        console.log('Upload successful, creating car data');
        const data = {
          ...values,
          image: imageRes.data.urls,
          owner: { ...user },
        };
        console.log('Final car data:', data);
        return CarsService.add(data);
      }

      console.error('Upload failed:', imageRes.data);
      throw new Error(imageRes?.data?.message || 'Failed to upload images');
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
      console.log('Image data structure:', {
        hasImage: !!carData.image,
        imageType: typeof carData.image,
        isArray: Array.isArray(carData.image),
        imageLength: carData.image?.length,
        imageSample: carData.image?.[0],
        imageSampleType: typeof carData.image?.[0]
      });
      
      // Use setTimeout to ensure the form is ready before setting values
      setTimeout(() => {
        reset(carData);
        console.log('Form reset completed with car data');
      }, 100);
    }
  }, [isEditMode, carData, reset]);

  const onSubmit = handleSubmit((values) => {
    console.log('Form submitted with values:', values);
    console.log('Image field details:', {
      hasImage: !!values.image,
      imageType: typeof values.image,
      isArray: Array.isArray(values.image),
      imageLength: values.image?.length,
      imageSample: values.image?.[0],
      imageSampleType: typeof values.image?.[0]
    });
    
    if (isEditMode) {
      console.log('Submitting in edit mode');
      updateCarMutation.mutate({
        ...values,
        carID,
        ownerID: user?._id,
      });
    } else {
      console.log('Submitting in create mode');
      addCarMutation.mutate(values);
    }
  });

  const STEPPER = [
    {
      label: "Add Details",
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

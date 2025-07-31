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
    monthOfFirstRegistration: yup
      .string()
      .required("Month of first registration is required."),
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
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      carDetails: {
        make: '',
        yearOfManufacture: '',
        engineCapacity: '',
        fuelType: '',
        colour: '',
        monthOfFirstRegistration: '',
        model: '',
        features: [],
        makeType: '',
        driveTrain: '',
        doorPlan: '',
        variant: '',
      },
      category: 'sale',
    },
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const {
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
    watch,
  } = methods;
  const currentValues = watch();

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user = {} } = useAuthContext()?.user || {};

  const params = useSearchParams();
  const carID = params.get("carId");



  const onSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);
      if (isEditMode) {
        const res = await CarsService.updateCar({
          ...values,
          carID,
          ownerID: user?._id,
        });
        if (res?.status === 200) {
          enqueueSnackbar(res?.data, {
            variant: "success",
          });
          router.push(paths.dashboard.cars.my.list);
        }
      } else {
        const res = await CarsService.uploadCarImages(values.image);
        if (res?.data?.imagesUrl) {
          delete user?.password;
          const data = {
            ...values,
            image: res.data.imagesUrl,
            owner: { ...user },
          };
          const addCarRes = await CarsService.addNewCar(data);
          if (addCarRes.status === 200) {
            enqueueSnackbar(addCarRes?.data, {
              variant: "success",
            });
            router.push(paths.dashboard.cars.my.list);
          }
        }
      }
    } catch (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    } finally {
      setLoading(false);
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
          loading={loading}
          setActiveStep={setActiveStep}
        />
      ),
    },
  ];

  const fetchCarById = async () => {
    try {
      const res = await CarsService.getCarById(carID);
      if (res?.status === 200) {
        reset(res?.data);
      }
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    if (isEditMode && carID) {
      fetchCarById();
    }
  }, [isEditMode, carID]);

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEPPER.map((s) => (
            <Step>
              <StepLabel>{s.label}</StepLabel>
              <StepContent>{s.step}</StepContent>
            </Step>
          ))}
        </Stepper>
      </FormProvider>
    </Box>
  );
}

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  RHFMultiCheckbox,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/iconify/iconify";
import { CarsService } from "src/services";

const CAR_DETAILS_FIELDS = [
  
  { id: "make", name: "carDetails.make", label: "Make" },
  {
    id: "yearOfManufacture",
    name: "carDetails.yearOfManufacture",
    label: "Year of Manufacture",
  },
  {
    id: "engineCapacity",
    name: "carDetails.engineCapacity",
    label: "Engine Capacity",
  },
  
  { id: "fuelType", name: "carDetails.fuelType", label: "Fuel Type" },
 
  { id: "colour", name: "carDetails.colour", label: "Colour" },
  
 
  { id: "wheelplan", name: "carDetails.wheelplan", label: "Wheelplan" },
  { id: "registeredCity", name: "carDetails.registeredCity", label: "Registered City" },
  { id: "condition", name: "carDetails.condition", label: "Condition" },
  { id: "Transmission", name: "carDetails.ransmission", label: "Transmission" },
 
];

export default function AddCarDetails({
  setActiveStep = () => {},
  isEditMode = false,
}) {
  const [searchByRegNo, setSearchByNo] = useState("");
  const [carDetailsLoading, setCarDetailsLoading] = useState(false);

  const [carModels, setCarModels] = useState([]);
  const [carMakesList, setCarMakesList] = useState([]);

  const { setValue, watch, setError, clearErrors } = useFormContext();
  const currentValues = watch();

  console.log("currentValues: ", currentValues)

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchByNo(value);
  };

  const checkCarDetailsFilled = (data) => {
    const carDetails = { ...data };
    for (const value of Object.values(carDetails)) {
      if (value === undefined) {
        return false;
      }
    }
    return true;
  };

  const isAllFilled = useMemo(() => {
    if (currentValues?.carDetails) {
      return checkCarDetailsFilled(currentValues?.carDetails);
    }
    return false;
  }, [currentValues?.carDetails]);

  const fetchDetailsByRegNo = async () => {
    try {
      setCarDetailsLoading(true);
      const res = await CarsService.getDetailsByRegNo(searchByRegNo);
      if (res?.data) {
        setValue("carDetails", { ...res.data });
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setCarDetailsLoading(false);
    }
  };

  function extractString(str) {
    // Regular expression to match strings before "-" or space
    const regex = /^([^\s\-]+)/;

    // Extracting the desired substring
    const match = str.match(regex);

    // If match found, return the matched substring
    if (match) {
      return match[1];
    } else {
      // If no match found, return the original string
      return str;
    }
  }

  const fetchCarModels = async () => {
    try {
      const filterCarMake = carMakesList.find((make) => {
        const string = extractString(make?.value.toLowerCase());
        const subString = extractString(
          currentValues.carDetails.make?.toLowerCase()
        );

        if (string.includes(subString)) {
          return make;
        }
      });
      const data = {
        selectedCar: filterCarMake?.value?.toLowerCase() || currentValues.carDetails.make?.toLowerCase(),
        year: currentValues.carDetails.yearOfManufacture,
      };
      const res = await CarsService.getCarModelsByYear(data);
      if (res?.status === 200) {
        setCarModels(res?.data);
        if (!isEditMode) {
          setValue("carDetails.model", currentValues?.carDetails?.model || res?.data?.[0]?.model || "");
        }
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const fetchCarMakes = async () => {
    try {
      const res = await CarsService.getCarMakes();
      if (res?.data) {
        setCarMakesList(res?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    if (
      currentValues?.carDetails?.make &&
      currentValues?.carDetails?.yearOfManufacture
    ) {
      fetchCarModels();
    }
  }, [
    currentValues?.carDetails?.make,
    currentValues?.carDetails?.yearOfManufacture,
  ]);

  useEffect(() => {
    fetchCarMakes();
  }, []);

  const features = useMemo(() => {
    if (carModels?.length && currentValues?.carDetails?.model) {
      const filterSelectedModel = carModels.find(
        (car) => car?.model === currentValues?.carDetails?.model
      );
      setValue("carDetails.features", [...filterSelectedModel?.features]);
      setValue("carDetails.makeType", filterSelectedModel?.makeType);
      setValue("carDetails.driveTrain", filterSelectedModel?.wheel_plan);
      setValue("carDetails.wheelType", filterSelectedModel?.wheel_type);
      setValue("carDetails.doorPlan", filterSelectedModel?.door_plan);

      return filterSelectedModel?.features || [];
    } else {
      setValue("carDetails.features", []);
      return [];
    }
  }, [currentValues?.carDetails?.model, carModels]);

  const variants = useMemo(() => {
    if (carModels?.length && currentValues?.carDetails?.model) {
      const filterSelectedModel = carModels.find(
        (car) => car?.model === currentValues?.carDetails?.model
      );
      if (filterSelectedModel?.variants?.length) {
        setValue("carDetails.variant", filterSelectedModel?.variants[0]);
      }
      return filterSelectedModel?.variants || [];
    } else {
      setValue("carDetails.variant", "");
      return [];
    }
  }, [currentValues?.carDetails?.model, carModels]);

  const categoryDefaultValue = useMemo(() => {
    if (!currentValues.category) {
      setValue("category", !isEditMode ? "sale" : "");
      return !isEditMode ? "sale" : "";
    } else {
      return currentValues.category;
    }
  }, [currentValues.category, isEditMode]);

  return (
    <Grid p={2} container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <RHFRadioGroup
          row
          name="category"
          value={categoryDefaultValue}
          label="Category *"
          spacing={4}
          options={[
            { value: "sale", label: "Sale" },
            { value: "hire", label: "Hire" },
          ]}
        />
      </Grid>
      
      

      {CAR_DETAILS_FIELDS.map((c) => (
        <Grid key={c.name} item xs={12} md={3}>
          {carDetailsLoading ? (
            <Skeleton variant="rounded" height={53} />
          ) : (
            <RHFTextField
              name={c.name}
              label={c.label}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Grid>
      ))}

      <Grid item xs={12} md={3}>
        {carModels.length > 0 && (
          <RHFSelect fullWidth name="carDetails.model" label="Model">
            {carModels.map((data) => (
              <MenuItem key={data?.model} value={data?.model}>
                {data?.model}
              </MenuItem>
            ))}
          </RHFSelect>
        )}
      </Grid>

      {currentValues?.carDetails?.model && (
        <Grid item xs={12} md={3}>
          <RHFTextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Make Type"
            name="carDetails.makeType"
          />
        </Grid>
      )}

      {currentValues?.carDetails?.model && (
        <Grid item xs={12} md={3}>
          <RHFTextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Drivetrain"
            name="carDetails.driveTrain"
          />
        </Grid>
      )}
      {currentValues?.carDetails?.model && (
        <Grid item xs={12} md={3}>
          <RHFTextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Door Plan"
            name="carDetails.doorPlan"
          />
        </Grid>
      )}

      {variants?.length > 0 && (
        <Grid item xs={12} md={3}>
          <RHFSelect fullWidth name="carDetails.variant" label="Variant">
            {variants.map((data) => (
              <MenuItem key={data} value={data}>
                {data}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
      )}

      <Grid item xs={12} md={12}>
        {features.length > 0 && (
          <RHFMultiCheckbox
            row
            name="carDetails.features"
            label="Features"
            spacing={4}
            options={features.map((f) => {
              if (f) {
                return { value: f, label: f };
              }
            })}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ textAlign: "end" }}>
          <Button
            variant="contained"
            disabled={!isAllFilled}
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

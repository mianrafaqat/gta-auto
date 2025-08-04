import {
  Box,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  RHFMultiCheckbox,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

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
  {
    id: "registeredCity",
    name: "carDetails.registeredCity",
    label: "Registered City",
  },
  {
    id: "transmission",
    name: "carDetails.transmission",
    label: "Transmission",
    type: "select",
    options: ["Automatic", "Manual", "CVT", "Semi-Automatic"],
  },
  {
    id: "condition",
    name: "carDetails.condition",
    label: "Condition",
    type: "select",
    options: ["Excellent", "Good", "Fair", "Poor"],
  },
];

const REQUIRED_FIELDS = [
  'make',
  'yearOfManufacture', 
  'engineCapacity',
  'fuelType',
  'colour',
  'model',
  'registeredCity',
  'condition',
  'transmission',
  'carType',
  'makeType',
  'driveTrain',
  'doorPlan'
];

export default function AddCarDetails({
  setActiveStep = () => {},
  isEditMode = false,
}) {
  const [carModels, setCarModels] = useState([]);
  const [carMakesList, setCarMakesList] = useState([]);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isCustomVariant, setIsCustomVariant] = useState(false);

  const { setValue, watch, getValues, trigger, formState: { errors } } = useFormContext();
  
  // Watch all the fields we need
  const carDetails = watch('carDetails');
  const category = watch('category');
  
  // Log the form values when they change
  useEffect(() => {
    const values = getValues();
    console.log('Form State:', {
      values: {
        carDetails: values.carDetails,
        category: values.category,
      },
      errors: errors?.carDetails,
      isValid: !Object.keys(errors?.carDetails || {}).length,
    });
  }, [carDetails, category, getValues, errors]);

  const checkCarDetailsFilled = (data) => {
    if (!data) return false;
    
    return REQUIRED_FIELDS.every(field => {
      const value = data[field];
      return value && String(value).trim() !== '';
    });
  };

  const isAllFilled = useMemo(() => {
    if (!carDetails) return false;
    
    const result = REQUIRED_FIELDS.every(field => {
      const value = carDetails[field];
      console.log(`Field ${field}:`, value); // Debug log
      return value && String(value).trim() !== '';
    });
    
    console.log('All required fields:', REQUIRED_FIELDS);
    console.log('Current carDetails:', carDetails);
    console.log('Validation Result:', result);
    
    return result;
  }, [carDetails]);

  const extractString = (str) => {
    const match = str?.match(/^([^\s\-]+)/);
    return match ? match[1] : str;
  };

  const fetchCarModels = async () => {
    try {
      const filterCarMake = carMakesList.find((make) => {
        const string = extractString(make?.value?.toLowerCase());
        const subString = extractString(carDetails?.make?.toLowerCase());
        return string?.includes(subString);
      });

      const data = {
        selectedCar: filterCarMake?.value?.toLowerCase() || carDetails?.make?.toLowerCase(),
        year: carDetails?.yearOfManufacture,
      };

      const res = await CarsService.getCarModelsByYear(data);
      if (res?.status === 200) {
        setCarModels(res.data);
        if (!isEditMode) {
          setValue("carDetails.model", carDetails?.model || res.data?.[0]?.model || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch car models:", err);
    }
  };

  const fetchCarMakes = async () => {
    try {
      const res = await CarsService.getCarMakes();
      if (res?.status === 200) {
        setCarMakesList(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch car makes:", err);
    }
  };

  useEffect(() => {
    if (carDetails?.make && carDetails?.yearOfManufacture) {
      fetchCarModels();
    }
  }, [carDetails?.make, carDetails?.yearOfManufacture]);

  useEffect(() => {
    fetchCarMakes();
  }, []);

  const DEFAULT_FEATURES = [
    "Air Conditioning",
    "Power Steering",
    "Power Windows",
    "ABS",
    "Airbags",
    "Navigation System",
    "Bluetooth",
    "Keyless Entry",
    "Sunroof",
    "Leather Seats",
    "Alloy Wheels",
    "Parking Sensors",
    "Backup Camera",
    "Cruise Control",
    "USB Port",
    "FM Radio"
  ];

  const features = useMemo(() => {
    if (!carModels?.length || !carDetails?.model) {
      // If no model is selected, provide default features
      setValue("carDetails.features", []);
      return DEFAULT_FEATURES;
    }

    const selectedModel = carModels.find(car => car?.model === carDetails?.model);
    if (!selectedModel) {
      // If model not found, provide default features
      return DEFAULT_FEATURES;
    }

    setValue("carDetails.features", [...(selectedModel.features || [])]);
    setValue("carDetails.makeType", selectedModel.makeType || "");
    setValue("carDetails.driveTrain", selectedModel.wheel_plan || "");
    setValue("carDetails.wheelType", selectedModel.wheel_type || "");
    setValue("carDetails.doorPlan", selectedModel.door_plan || "");

    return selectedModel.features?.length ? selectedModel.features : DEFAULT_FEATURES;
  }, [carDetails?.model, carModels]);

  const variants = useMemo(() => {
    if (!carModels?.length || !carDetails?.model) {
      setValue("carDetails.variant", "");
      return [];
    }

    const selectedModel = carModels.find(car => car?.model === carDetails?.model);
    if (!selectedModel?.variants?.length) return [];

    setValue("carDetails.variant", selectedModel.variants[0]);
    return selectedModel.variants;
  }, [carDetails?.model, carModels]);

  const categoryDefaultValue = useMemo(() => {
    const category = watch('category');
    if (!category) {
      const defaultValue = !isEditMode ? "sale" : "";
      setValue("category", defaultValue);
      return defaultValue;
    }
    return category;
  }, [watch, isEditMode, setValue]);

  return (
    <Grid p={2} container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <RHFRadioGroup
          row
          name="category"
          value={categoryDefaultValue}
          label="Category *"
          spacing={4}
          options={[{ value: "sale", label: "Sale" }]}
        />
      </Grid>

      <Grid item xs={12}>
        <RHFRadioGroup
          row
          name="carDetails.carType"
          label="Car Type *"
          spacing={4}
          options={[
            { value: "new", label: "New" },
            { value: "used", label: "Used" }
          ]}
          error={!!errors?.carDetails?.carType}
          helperText={errors?.carDetails?.carType?.message}
        />
      </Grid>

      {CAR_DETAILS_FIELDS.map((c) => (
        <Grid key={c.name} item xs={12} md={3}>
          {c.type === 'select' ? (
            <RHFSelect
              name={c.name}
              label={`${c.label} *`}
              fullWidth
              error={!!errors?.carDetails?.[c.id]}
              helperText={errors?.carDetails?.[c.id]?.message || ' '}
              InputLabelProps={{ 
                shrink: true,
                sx: {
                  transform: 'translate(14px, -9px) scale(0.75)',
                  background: '#fff',
                  px: 1,
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '&.Mui-error': {
                    borderColor: 'error.main',
                  },
                  '& fieldset': {
                    borderWidth: '1px !important',
                  },
                },
                '& .MuiSelect-select': {
                  padding: '12.5px 14px',
                },
                '& .MuiFormLabel-root': {
                  marginTop: 0,
                }
              }}
            >
              <MenuItem value="">Select {c.label}</MenuItem>
              {c.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          ) : (
            <RHFTextField
              name={c.name}
              label={`${c.label} *`}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setValue(c.name, e.target.value);
              }}
              error={!!errors?.carDetails?.[c.id]}
              helperText={errors?.carDetails?.[c.id]?.message || ' '}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-error': {
                    borderColor: 'error.main',
                  }
                }
              }}
            />
          )}
        </Grid>
      ))}

      <Grid item xs={12} md={3}>
        {isCustomModel ? (
          <RHFTextField
            fullWidth
            name="carDetails.model"
            label="Custom Model *"
            InputLabelProps={{ shrink: true }}
            error={!!errors?.carDetails?.model}
            helperText={errors?.carDetails?.model?.message || ' '}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-error': {
                  borderColor: 'error.main',
                }
              }
            }}
          />
        ) : (
          <RHFSelect 
            fullWidth 
            name="carDetails.model" 
            label="Model *"
            error={!!errors?.carDetails?.model}
            helperText={errors?.carDetails?.model?.message || ' '}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-error': {
                  borderColor: 'error.main',
                }
              }
            }}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomModel(true);
                setValue('carDetails.model', '');
              } else {
                setValue('carDetails.model', e.target.value);
              }
            }}
          >
            <MenuItem value="custom">
              <em>Enter Custom Model</em>
            </MenuItem>
            {carModels.map((data) => (
              <MenuItem key={data?.model} value={data?.model}>
                {data?.model}
              </MenuItem>
            ))}
          </RHFSelect>
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        <RHFTextField
          InputLabelProps={{ shrink: true }}
          label="Make Type *"
          name="carDetails.makeType"
          error={!!errors?.carDetails?.makeType}
          helperText={errors?.carDetails?.makeType?.message || ' '}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <RHFTextField
          InputLabelProps={{ shrink: true }}
          label="Drivetrain *"
          name="carDetails.driveTrain"
          error={!!errors?.carDetails?.driveTrain}
          helperText={errors?.carDetails?.driveTrain?.message || ' '}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <RHFTextField
          InputLabelProps={{ shrink: true }}
          label="Door Plan *"
          name="carDetails.doorPlan"
          error={!!errors?.carDetails?.doorPlan}
          helperText={errors?.carDetails?.doorPlan?.message || ' '}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        {isCustomVariant ? (
          <RHFTextField
            fullWidth
            name="carDetails.variant"
            label="Custom Variant"
            InputLabelProps={{ shrink: true }}
            error={!!errors?.carDetails?.variant}
            helperText={errors?.carDetails?.variant?.message || ' '}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-error': {
                  borderColor: 'error.main',
                }
              }
            }}
          />
        ) : (
          <RHFSelect 
            fullWidth 
            name="carDetails.variant" 
            label="Variant"
            error={!!errors?.carDetails?.variant}
            helperText={errors?.carDetails?.variant?.message || ' '}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-error': {
                  borderColor: 'error.main',
                }
              }
            }}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomVariant(true);
                setValue('carDetails.variant', '');
              } else {
                setValue('carDetails.variant', e.target.value);
              }
            }}
          >
            <MenuItem value="custom">
              <em>Enter Custom Variant</em>
            </MenuItem>
            {variants.map((data) => (
              <MenuItem key={data} value={data}>
                {data}
              </MenuItem>
            ))}
          </RHFSelect>
        )}
      </Grid>

      <Grid item xs={12} md={12}>
        {features.length > 0 && (
          <RHFMultiCheckbox
            row
            name="carDetails.features"
            label="Features"
            spacing={4}
            options={features.map(f => f && { value: f, label: f })}
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ textAlign: "end" }}>
          <Button
            variant="contained"
            onClick={async () => {
              // Validate all car detail fields
              const fieldsToValidate = REQUIRED_FIELDS.map(field => `carDetails.${field}`);
              const isValid = await trigger(fieldsToValidate);
              
              if (isValid) {
                setActiveStep((prev) => prev + 1);
              } else {
                console.log('Validation failed:', errors);
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

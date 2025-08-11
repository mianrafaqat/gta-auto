import PropTypes from "prop-types";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from "src/components/hook-form";

import {
  useCreateShippingMethod,
  useUpdateShippingMethod,
} from "src/hooks/use-shipping";

// ----------------------------------------------------------------------

export default function ShippingMethodForm({ currentMethod }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const createMethod = useCreateShippingMethod();
  const updateMethod = useUpdateShippingMethod();

  const NewMethodSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be greater than or equal to 0"),
    estimatedDelivery: Yup.object().shape({
      min: Yup.number()
        .required("Minimum delivery days is required")
        .min(0, "Minimum days must be greater than or equal to 0"),
      max: Yup.number()
        .required("Maximum delivery days is required")
        .min(Yup.ref("min"), "Maximum days must be greater than minimum days"),
    }),
    countries: Yup.array(),
    isActive: Yup.boolean(),
  });

  const defaultValues = {
    name: currentMethod?.name || "",
    price: currentMethod?.price || 0,
    estimatedDelivery: {
      min: currentMethod?.estimatedDelivery?.min || 1,
      max: currentMethod?.estimatedDelivery?.max || 3,
    },
    countries: currentMethod?.countries || [],
    isActive: currentMethod?.isActive ?? true,
  };

  const methods = useForm({
    resolver: yupResolver(NewMethodSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentMethod) {
        // Update existing method
        await updateMethod.mutateAsync({ id: currentMethod._id, data });
        enqueueSnackbar("Shipping method updated successfully");
      } else {
        // Create new method
        await createMethod.mutateAsync(data);
        enqueueSnackbar("Shipping method created successfully");
      }

      reset();
      router.push(paths.dashboard.shipping.methods.root);
    } catch (error) {
      console.error("Error saving shipping method:", error);
      enqueueSnackbar(error.message || "Error saving shipping method", {
        variant: "error",
      });
    }
  });

  const renderDetails = (
    <>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}>
        <RHFTextField name="name" label="Method Name" />
        <RHFTextField
          name="price"
          label="Price"
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
        />
      </Box>

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
        sx={{ mt: 3 }}>
        <RHFTextField
          name="estimatedDelivery.min"
          label="Minimum Delivery Days"
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
        />
        <RHFTextField
          name="estimatedDelivery.max"
          label="Maximum Delivery Days"
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
        />
      </Box>

      <RHFAutocomplete
        name="countries"
        label="Countries"
        multiple
        options={["US", "CA", "UK", "AU", "DE", "FR", "IT", "ES", "JP", "CN"]}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        sx={{ mt: 3 }}
      />

      <FormControlLabel
        control={
          <Switch defaultChecked={defaultValues.isActive} name="isActive" />
        }
        label="Active"
        sx={{ mt: 3 }}
      />
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            {renderDetails}

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={
                  isSubmitting ||
                  createMethod.isPending ||
                  updateMethod.isPending
                }>
                {currentMethod ? "Save Changes" : "Create Method"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ShippingMethodForm.propTypes = {
  currentMethod: PropTypes.object,
};

"use client";

import { useState, useCallback } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useSnackbar } from "src/components/snackbar";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form";
import TaxService from "src/services/tax/tax.service";

// ----------------------------------------------------------------------

const TaxSchema = Yup.object().shape({
  name: Yup.string().required("Tax name is required"),
  description: Yup.string(),
  country: Yup.string().required("Country is required"),
  state: Yup.string(),
  rate: Yup.number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .min(0, "Rate must be at least 0"),
  isDefault: Yup.boolean(),
});

const defaultValues = {
  name: "",
  description: "",
  country: "",
  state: "",
  rate: "",
  isDefault: false,
};

// ----------------------------------------------------------------------

export default function AddTaxListView({ isEdit = false, taxId }) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(TaxSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // If you want to support edit, you can fetch the tax by id here and reset the form.
  // For now, we only implement add.

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        description: data.description,
        country: data.country,
        state: data.state,
        rate: Number(data.rate),
        isDefault: data.isDefault,
      };

      // Only add, not edit
      const response = await TaxService.add(payload);
      if (response?.status === 200) {
        snackbar.enqueueSnackbar("Tax added successfully!");
        router.push(paths.dashboard.tax.list);
      }
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar(
        error?.response?.data?.message || "Failed to add tax",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.tax.list);
  }, [router]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add New Tax
        </Typography>

        <FormProvider methods={methods}>
          <Box>
            <Stack spacing={3}>
              <RHFTextField
                name="name"
                label="Tax Name"
                placeholder="Enter tax name"
              />

              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                placeholder="Enter tax description (optional)"
              />

              <RHFTextField
                name="country"
                label="Country"
                placeholder="Enter country code (e.g. US, CA)"
              />

              <RHFTextField
                name="state"
                label="State"
                placeholder="Enter state code (optional)"
              />

              <RHFTextField
                name="rate"
                label="Tax Rate (%)"
                placeholder="Enter tax rate"
                type="number"
                inputProps={{ min: 0, step: "any" }}
              />

              <Stack direction="row" alignItems="center" spacing={2}>
                <label>
                  <input type="checkbox" {...methods.register("isDefault")} />
                  &nbsp;Set as default tax
                </label>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                  disabled={loading}>
                  Cancel
                </Button>

                <LoadingButton
                  onClick={onSubmit}
                  variant="contained"
                  loading={isSubmitting || loading}>
                  Add Tax
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Card>
    </Container>
  );
}

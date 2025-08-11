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
import CouponService from "src/services/coupons/coupons.service";

// ----------------------------------------------------------------------

const CouponSchema = Yup.object().shape({
  code: Yup.string().required("Coupon code is required"),
  description: Yup.string(),
  discountType: Yup.string()
    .oneOf(
      ["percentage", "fixed"],
      "Discount type must be 'percentage' or 'fixed'"
    )
    .required("Discount type is required"),
  discountValue: Yup.number()
    .typeError("Discount value must be a number")
    .required("Discount value is required")
    .min(0, "Discount value must be at least 0"),
  minAmount: Yup.number()
    .typeError("Minimum amount must be a number")
    .min(0, "Minimum amount must be at least 0")
    .nullable(),
  expiresAt: Yup.date()
    .nullable()
    .typeError("Expiration date must be a valid date"),
  usageLimit: Yup.number()
    .typeError("Usage limit must be a number")
    .min(1, "Usage limit must be at least 1")
    .nullable(),
});

const defaultValues = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minAmount: "",
  expiresAt: "",
  usageLimit: "",
};

// ----------------------------------------------------------------------

export default function AddCouponListView({ isEdit = false, couponId }) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(CouponSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Only add, not edit
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minAmount: data.minAmount ? Number(data.minAmount) : undefined,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      };

      const response = await CouponService.add(payload);
      if (response?.status === 200) {
        snackbar.enqueueSnackbar("Coupon added successfully!");
        router.push(paths.dashboard.admin.coupons.list);
      }
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar(
        error?.response?.data?.message || "Failed to add coupon",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.admin.coupons.list);
  }, [router]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add New Coupon
        </Typography>

        <FormProvider methods={methods}>
          <Box>
            <Stack spacing={3}>
              <RHFTextField
                name="code"
                label="Coupon Code"
                placeholder="Enter coupon code"
              />

              <RHFTextField
                name="description"
                label="Description"
                multiline
                rows={4}
                placeholder="Enter coupon description (optional)"
              />

              <RHFTextField
                name="discountType"
                label="Discount Type"
                select
                SelectProps={{ native: true }}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </RHFTextField>

              <RHFTextField
                name="discountValue"
                label="Discount Value"
                placeholder="Enter discount value"
                type="number"
                inputProps={{ min: 0, step: "any" }}
              />

              <RHFTextField
                name="minAmount"
                label="Minimum Amount"
                placeholder="Enter minimum order amount (optional)"
                type="number"
                inputProps={{ min: 0, step: "any" }}
              />

              <RHFTextField
                name="expiresAt"
                label="Expiration Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="usageLimit"
                label="Usage Limit"
                placeholder="Enter usage limit (optional)"
                type="number"
                inputProps={{ min: 1, step: 1 }}
              />

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
                  Add Coupon
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Card>
    </Container>
  );
}

"use client";

import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Divider, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import FormProvider from "src/components/hook-form";
import { CarsService } from "src/services";
import { useSnackbar } from "notistack";
import { flexbox } from "@mui/system";

const INTERESTED_OPTIONS = [
  "I'm interested in this",
  "I'd like to know your best price for this",
  "I'd like to test drive this",
  "I'd like a history report for this vehicle",
];

const schema = Yup.object().shape({
  name: Yup.string().required(),
  userEmail: Yup.string().email("Invalid email").required("Email is required"),
  area: Yup.string().required(),
  interested: Yup.string().required(),
  phone: Yup.string().required(),
});

export default function CheckAvailabiltyForm({
  make = "",
  year = "",
  carUserEmail,
}) {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    interested: INTERESTED_OPTIONS[0],
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      values = {
        ...values,
        carName: year + " " + make,
        carUserEmail,
        link: window.location.href,
      };
      const res = await CarsService.sendEmail(values);
      if (res?.status === 200) {
        enqueueSnackbar(res?.data);
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      enqueueSnackbar(error || "An unknown error occured!", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ mb: 1 }} variant="h4" color="#000">
          Request Information
        </Typography>
        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack
          variant="body1"
          direction="row"
          sx={{
            flexWrap: "wrap",
            whiteSpace: "nowrap",
            mt: 1,
          }}
          alignItems="center"
          gap="10px"
        >
          <Typography
            sx={{
              flexWrap: "wrap",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#000"
            }}
          >
            Hi! my name is{" "}
            <RHFTextField
              hideHelperText
              sx={{ width: "50%" }}
              placeholder="Name"
              name="name"
              size="small"
            />
            and
            <RHFSelect
              sx={{ width: "50%" }}
              size="small"
              name="interested"
              InputLabelProps={{ shrink: true }}
            >
              {INTERESTED_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </RHFSelect>
            {year} {make}. I'm in the
            <RHFTextField
              hideHelperText
              fullWidth
              sx={{ width: "30%" }}
              placeholder="Area"
              name="area"
              size="small"
            />
            area. You can reach me by email at
            <RHFTextField
              sx={{ width: "50%" }}
              hideHelperText
              placeholder="Email"
              name="userEmail"
              size="small"
            />
            or by phone at
            <RHFTextField
              sx={{ width: "50%" }}
              hideHelperText
              placeholder="Phone"
              name="phone"
              size="small"
            />
          </Typography>
        </Stack>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 1, width: "100%" }}
          loading={loading}
        >
          Check Availability
        </LoadingButton>
      </FormProvider>
    </Box>
  );
}

"use client";

import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Divider, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import FormProvider from "src/components/hook-form";
import { CarsService } from "src/services";
import { useSnackbar } from "notistack";

const INTERESTED_OPTIONS = [
  "I'm interested in this",
  "I'd like to know your best price for this",
  "I'd like to test drive this",
  "I'd like a history report for this vehicle",
];

const RENTAL_INTERESTED_OPTIONS = [
  "I'm interested in renting this vehicle",
  "I'd like to know your rental rates",
  "I'd like to check availability for specific dates",
  "I'd like to know about rental terms and conditions",
];

const RENTAL_DURATION_OPTIONS = [
  "1 Day",
  "3 Days",
  "1 Week",
  "2 Weeks", 
  "1 Month",
  "3 Months",
  "6 Months",
  "1 Year",
  "Other (Please specify in message)"
];

const schema = Yup.object().shape({
  name: Yup.string().required(),
  userEmail: Yup.string().email("Invalid email").required("Email is required"),
  area: Yup.string().required(),
  interested: Yup.string().required(),
  phone: Yup.string().required(),
  // Rental-specific fields
  rentalDuration: Yup.string().when('$category', {
    is: 'rent',
    then: (schema) => schema.required("Rental duration is required"),
    otherwise: (schema) => schema.optional(),
  }),
  startDate: Yup.string().when('$category', {
    is: 'rent',
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  endDate: Yup.string().when('$category', {
    is: 'rent',
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  additionalMessage: Yup.string().optional(),
});

export default function CheckAvailabiltyForm({
  category = "",
  make = "",
  year = "",
  carUserEmail,
}) {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    interested: category === "rent" ? RENTAL_INTERESTED_OPTIONS[0] : INTERESTED_OPTIONS[0],
    rentalDuration: category === "rent" ? RENTAL_DURATION_OPTIONS[0] : "",
    startDate: "",
    endDate: "",
    additionalMessage: "",
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    context: { category },
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Prepare email data based on category
      const emailData = {
        ...values,
        carName: year + " " + make,
        carUserEmail,
        link: window.location.href,
        category,
        requestType: category === "rent" ? "rental_quote" : "purchase_inquiry",
      };

      // Add rental-specific information to the email if it's a rental request
      if (category === "rent") {
        emailData.subject = `Rental Quote Request for ${year} ${make}`;
        emailData.emailType = "rental_quote";
        
        // Format rental duration and dates for the email
        let rentalDetails = `Rental Duration: ${values.rentalDuration}`;
        if (values.startDate) {
          rentalDetails += `\nPreferred Start Date: ${values.startDate}`;
        }
        if (values.endDate) {
          rentalDetails += `\nPreferred End Date: ${values.endDate}`;
        }
        if (values.additionalMessage) {
          rentalDetails += `\nAdditional Requirements: ${values.additionalMessage}`;
        }
        
        emailData.rentalDetails = rentalDetails;
      } else {
        emailData.subject = `Purchase Inquiry for ${year} ${make}`;
        emailData.emailType = "purchase_inquiry";
      }

      const res = await CarsService.sendEmail(emailData);
      if (res?.status === 200) {
        enqueueSnackbar(res?.data, { variant: "success" });
        // Clear the form after successful submission
        reset(defaultValues);
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      enqueueSnackbar(error || "An unknown error occurred!", {
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
          {category === "rent" ? "Get Rental Quote" : "Request Information"}
        </Typography>
        <Divider sx={{ borderStyle: "dashed" }} />

        {category === "rent" ? (
          // Rental Quote Form
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="name"
                  label="Your Name *"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="phone"
                  label="Phone Number *"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="userEmail"
                  label="Email Address *"
                  type="email"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="area"
                  label="Your Location *"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <RHFSelect
                  name="interested"
                  label="I am interested in *"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {RENTAL_INTERESTED_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFSelect
                  name="rentalDuration"
                  label="Rental Duration *"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                >
                  {RENTAL_DURATION_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField
                  name="startDate"
                  label="Preferred Start Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <RHFTextField
                  name="endDate"
                  label="Preferred End Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField
                  name="additionalMessage"
                  label="Additional Message or Special Requirements"
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  placeholder="Please let us know if you have any special requirements or questions about the rental..."
                />
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ mt: 2, mb: 1, color: "text.secondary" }}>
              Request for: <strong>{year} {make}</strong>
            </Typography>
          </Box>
        ) : (
          // Regular Sale/Purchase Form
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
        )}

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: "100%" }}
          loading={loading}
        >
          {category === "rent" ? "Request Rental Quote" : "Check Availability"}
        </LoadingButton>
      </FormProvider>
    </Box>
  );
}

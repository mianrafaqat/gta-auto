import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RHFEditor, RHFSelect, RHFTextField } from "src/components/hook-form";

const OTHER_FIELDS = [
  { name: "title", label: "Title *" },
  { name: "price", label: "Price *" },
  { name: "carDetails.mileage", label: "Mileage *" },
  { name: "link", label: "Youtube Link" },
  { name: "location", label: "Location *" },
  { name: "postalCode", label: "Postal Code *" },
  { name: "carDetails.tel", label: "Phone No. *" },
];

export default function AdditionalInformation({
  setActiveStep = () => {},
  loading = false,
  isEditMode = false,
}) {
  const { watch, setValue, setError, clearErrors } = useFormContext();

  const currentValues = watch();

  useEffect(() => {
    if (!isEditMode && !currentValues.title) {
      setValue(
        "title",
        currentValues.carDetails.yearOfManufacture +
          " - " +
          currentValues.carDetails.make +
          " " +
          currentValues.carDetails.model
      );
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!currentValues.saleAs && currentValues.category == "sale") {
      setError("saleAs", { type: "error", custom: "Sale As is required" });
    } else {
      clearErrors("saleAs");
    }
  }, [currentValues.saleAs, currentValues.category]);

  useEffect(() => {
    if (
      !currentValues.companyOrSellerName &&
      currentValues.category == "sale"
    ) {
      setError("companyOrSellerName", { type: "error", custom: "Required" });
    } else {
      clearErrors("companyOrSellerName");
    }
  }, [currentValues.companyOrSellerName, currentValues.category]);

  return (
    <>
      <Grid container spacing={1} p={1}>
        {OTHER_FIELDS.map((c) => (
          <Grid key={c.name} item xs={12} md={4}>
            <RHFTextField
              name={c.name}
              label={c.label}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        ))}
        {currentValues.category === "sale" && (
          <Grid item xs={12} md={4}>
            <RHFSelect
              InputLabelProps={{ shrink: true }}
              native
              label="Sale As *"
              name="saleAs"
            >
              <option value="">
                -- SELECT {currentValues?.category?.toUpperCase()} AS --{" "}
              </option>
              <option value="Company">Company</option>
              <option value="Private">Private</option>
            </RHFSelect>
          </Grid>
        )}
        {currentValues.category === "sale" && currentValues.saleAs && (
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="companyOrSellerName"
              label={
                currentValues.saleAs === "Company"
                  ? "Company Name"
                  : "Seller Name"
              }
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <RHFEditor simple name="description" sx={{ height: 200 }} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 1, textAlign: "end" }}>
        <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>
        <LoadingButton
          // disabled={!isValid}
          loading={loading}
          variant="contained"
          color="primary"
          type="submit"
          sx={{ ml: 1 }}
        >
          Submit
        </LoadingButton>
      </Box>
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import * as Yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useSnackbar } from "src/components/snackbar";
import { RHFTextField } from "src/components/hook-form";
import FormProvider from "src/components/hook-form";
import AttributeService from "src/services/attribute/attribute.service";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

// Utility function to generate slug from string
function generateSlug(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const AttributeSchema = Yup.object().shape({
  name: Yup.string().required("Attribute name is required"),
  slug: Yup.string().required("Slug is required"),
  type: Yup.string().required("Type is required"),
  values: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Value name is required"),
        slug: Yup.string().required("Slug is required"),
      })
    )
    .min(1, "At least one value is required"),
});

const defaultValues = {
  name: "",
  slug: "",
  type: "",
  values: [{ name: "", slug: "" }],
};

// ----------------------------------------------------------------------

export default function AddAttributeListView({ isEdit = false, attributeId }) {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(AttributeSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "values",
  });

  const typeValue = watch("type");
  const nameValue = watch("name");
  const valuesArray = watch("values");

  // Automatically generate slug for attribute name
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setValue("name", newName);
    setValue("slug", generateSlug(newName));
  };

  // Automatically generate slug for attribute type
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setValue("type", newType);
  };

  // Automatically generate slug for attribute value name
  const handleValueNameChange = (idx, value) => {
    setValue(`values.${idx}.name`, value);
    setValue(`values.${idx}.slug`, generateSlug(value));
  };

  // TODO: Add edit logic if needed

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name,
        type: data.type,
        slug: data.slug,
        values: data.values,
      };

      // Only add, no edit for now
      const response = await AttributeService.add(payload);
      if (response?.status === 200) {
        snackbar.enqueueSnackbar("Attribute added successfully!");
        router.push(paths.dashboard.admin.attribute.list);
      }
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar(
        error?.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "add"} attribute`,
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.admin.attribute.list);
  }, [router]);

  return (
    <Container maxWidth={false}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {isEdit ? "Edit Attribute" : "Add New Attribute"}
        </Typography>

        <FormProvider methods={methods}>
          <Box>
            <Stack spacing={3}>
              <RHFTextField
                name="name"
                label="Attribute Name"
                placeholder="Enter attribute name"
                onChange={handleNameChange}
                value={nameValue}
              />

              <RHFTextField
                name="slug"
                label="Attribute Slug"
                placeholder="Enter attribute slug"
                value={watch("slug")}
                InputProps={{
                  readOnly: true,
                }}
              />

              <RHFTextField
                name="type"
                label="Type"
                placeholder="Enter type (e.g. select, text, color, etc.)"
                onChange={handleTypeChange}
                value={typeValue}
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Attribute Values
                </Typography>
                <Stack spacing={2}>
                  {fields.map((field, idx) => (
                    <Stack
                      key={field.id}
                      direction="row"
                      spacing={2}
                      alignItems="center">
                      <Controller
                        name={`values.${idx}.name`}
                        control={control}
                        defaultValue={field.name}
                        render={({ field: valueField }) => (
                          <RHFTextField
                            {...valueField}
                            label="Value Name"
                            placeholder="e.g. Small"
                            sx={{ flex: 1 }}
                            onChange={(e) => {
                              handleValueNameChange(idx, e.target.value);
                            }}
                          />
                        )}
                      />
                      <RHFTextField
                        name={`values.${idx}.slug`}
                        label="Slug"
                        placeholder="e.g. small"
                        sx={{ flex: 1 }}
                        value={valuesArray?.[idx]?.slug || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => remove(idx)}
                        disabled={fields.length === 1}
                        aria-label="Remove value">
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => append({ name: "", slug: "" })}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    sx={{ alignSelf: "flex-start" }}>
                    Add Value
                  </Button>
                </Stack>
              </Box>

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
                  {isEdit ? "Update Attribute" : "Add Attribute"}
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </FormProvider>
      </Card>
    </Container>
  );
}

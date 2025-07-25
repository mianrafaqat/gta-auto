"use client";

import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
import { paths } from "src/routes/paths";
import * as Yup from "yup";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "src/components/snackbar";
import { LoadingButton } from "@mui/lab";
import { useBoolean } from "src/hooks/use-boolean";
import Iconify from "src/components/iconify";
import { AdminService, UserService } from "src/services";
import { useAuthContext } from "src/auth/hooks";

const schema = Yup.object().shape({
  name: Yup.string(),
  phone: Yup.string(),
  oldPassword: Yup.string(),
  newPassword: Yup.string(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords must match"
  ),
});

export default function UserProfileChangePassword() {
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(false);

  const oldPassword = useBoolean();
  const newPassword = useBoolean();
  const reTypeNewPassword = useBoolean();

  const { user = {} } = useAuthContext()?.user || {};
  const { login = () => {} } = useAuthContext();

  const defaultValues = useMemo(() => {
    if (user) {
      return {
        name: user?.name,
        phone: user?.phone,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    }
  }, [user]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);

      const userData = {
        ...(user?.role === "user"
          ? { userID: user?._id }
          : { adminID: user?._id }),
        ...formData,
      };

      const serviceFunction =
        user?.role === "user"
          ? UserService.editProfile
          : AdminService.updateProfile;

      const res = await serviceFunction(userData);

      if (res?.status === 200) {
        enqueueSnackbar(res?.data);
        login({ email: user?.email, password: formData?.newPassword, role: user?.role });
      }
    } catch (error) {
      console.error("error: ", error);
      enqueueSnackbar(error || "An unknown error occurred!", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <CustomBreadcrumbs
        heading="User Profile"
        links={[
          {
            name: "Dasboard",
            href: paths.dashboard.root,
          },
          {
            name: "User",
          },
          { name: "Profile" },
        ]}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid mt={1} container spacing={1}>
          {user?.role === "user" && (
            <>
              <Grid item xs={12} md={6}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="phone" label="Phone No." />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              value={user?.email}
              disabled
              label="Email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="oldPassword"
              label="Old Password"
              type={oldPassword.value ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={oldPassword.onToggle} edge="end">
                      <Iconify
                        icon={
                          oldPassword.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="newPassword"
              label="New Password"
              type={newPassword.value ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={newPassword.onToggle} edge="end">
                      <Iconify
                        icon={
                          newPassword.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="confirmPassword"
              label="Confirm Password"
              type={reTypeNewPassword.value ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={reTypeNewPassword.onToggle} edge="end">
                      <Iconify
                        icon={
                          reTypeNewPassword.value
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "end", mt: 1 }}>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isValid}
            loading={loading}
          >
            Update
          </LoadingButton>
        </Box>
      </FormProvider>
    </Container>
  );
}

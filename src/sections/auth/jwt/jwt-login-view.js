"use client";

import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useRouter, useSearchParams } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { useAuthContext } from "src/auth/hooks";
import { PATH_AFTER_LOGIN } from "src/config-global";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  let role = "user";

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const password = useBoolean();

  const auth = useAuthContext();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
    captchaResponse: Yup.string().required("Captcha is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
    captchaResponse: "dummy data",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.email === "ahmadvision345@gmail.com" || data.email === "rafaqatmehar007@gmail.com") {
        role = "admin";
      }
      await login?.({ ...data, role });
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  useEffect(() => {
    const handleMoveToDashboard = () => {
      router.push(PATH_AFTER_LOGIN);
    };

    if (auth?.authenticated) {
      handleMoveToDashboard();
    }
  }, [auth, router]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />
      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* <Link sx={{ textAlign: 'end' }} color="black" href={paths.dashboard.user.forgotPassword}>
        <Typography variant="body2">Forgot Password?</Typography>
      </Link> */}
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
      {/* <RadioGroup
        onChange={(e) => setRole(e.target.value)}
        sx={{ alignItems: 'center', gap: 2 }}
        row
        defaultValue="user"
      >
        <Typography variant="body1">Sign in as:</Typography>
        <FormControlLabel value="user" control={<Radio size="medium" />} label="User" />
        <FormControlLabel value="admin" control={<Radio size="medium" />} label="Admin" />
      </RadioGroup> */}
      <Link
        sx={{ textAlign: "end" }}
        color="black"
        href={paths.dashboard.user.forgotPassword}
      >
        <Typography variant="body2">Forgot Password?</Typography>
      </Link>
      <Typography
        variant="body2"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          justifyContent: "end",
        }}
      >
        Don't have an account?
        <Link
          color="primary"
          fontWeight={900}
          href={paths.auth.jwt.register}
        >
          <Typography variant="body2">Create an account</Typography>
        </Link>
      </Typography>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}

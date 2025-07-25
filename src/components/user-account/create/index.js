'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Grid, IconButton, InputAdornment, Skeleton, Tooltip } from '@mui/material';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Container from '@mui/material/Container';
import { LoadingButton } from '@mui/lab';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { AccountTypeService, AdminUserService } from 'src/services';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';

const ACCOUNT_TYPES = [
  // {
  //   id: 1,
  //   createdDate: 'February 01, 2024 09:57:53+0000',
  //   lastModifiedDate: 'February 01, 2024 09:57:53+0000',
  //   createdBy: null,
  //   name: 'SuperAdmin',
  //   accountGroup: 'SuperAdmin',
  // },
  {
    id: 2,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'CompanyAdmin',
    accountGroup: 'CompanyAdmin',
  },
  {
    id: 3,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'ItemLister',
    accountGroup: 'ItemLister',
  },
  {
    id: 4,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'OrderManager',
    accountGroup: 'OrderManager',
  },
];

const UserCreateForm = ({ isEditMode }) => {
  const schema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        'Password must be 8 or more characters in length, contain at least one uppercase letter, one digit, and one special character'
      ),
    accountTypeName: yup.string().required('Account type is required'),
    companyName: yup.string().required('Company name is required'),
  });

  const [loading, setLoading] = useState(false);
  const [accountTypeLoading, setAccountTypeLoading] = useState(false);
  const settings = useSettingsContext();
  const password = useBoolean();
  const [accountTypeOptions, setAccountTypesOptions] = useState([]);
  const [userById, setUserById] = useState({});
  const params = useSearchParams();
  const userId = params.get('userId');

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  // Account Types
  const fetchContentTypes = async () => {
    try {
      setAccountTypeLoading(true);
      const res = await AccountTypeService.getAccountTypes();
      if (res?.data?.data) {
        setAccountTypesOptions(res.data.data);
      } else {
        setAccountTypesOptions([]);
      }
    } catch (e) {
      console.log('error', e);
      setAccountTypesOptions([]);
    } finally {
      setAccountTypeLoading(false);
    }
  };

  useEffect(() => {
    fetchContentTypes();
  }, []);

  // Get User By  Id
  const handleGetUserById = async (id) => {
    const response = await AdminUserService.getUserById(id);
    if (response?.data?.status === '200') {
      setUserById(response?.data?.data);
    } else {
      enqueueSnackbar(response?.data?.description);
    }
  };
  useEffect(() => {
    if (userId) {
      handleGetUserById(userId);
    }
  }, [userId]);

  const defaultValues = useMemo(() => {
    if (isEditMode && accountTypeOptions) {
      const accountTypeMatch = accountTypeOptions.find(
        (accountType) => accountType.id === userById?.userAccountTypeId
      );

      return {
        firstName: userById?.firstName || '',
        lastName: userById?.lastName || '',
        email: userById?.email || '',
        password: userById?.planPass || '',
        accountTypeName: accountTypeMatch ? accountTypeMatch.name : '',
      };
    } else {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        accountTypeName: '',
        companyName: '',
      };
    }
  }, [isEditMode, userById, accountTypeOptions]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  useEffect(() => {
    // Reset the form with updated default values after user data is fetched
    methods.reset(defaultValues);
  }, [defaultValues]);
  const {
    handleSubmit,
    watch,
    formState: { isValid }, // Destructure isValid from formState
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      let res;
      if (data?.accountTypeName === 'CompanyAdmin') {
        if (isEditMode) {
          res = await AdminUserService.updateUserById(userId, data);
        } else {
          res = await AdminUserService.addCompanyAdminUser(data);
        }
      } else {
        if (isEditMode) {
          res = await AdminUserService.updateUserById(userId, data);
        } else {
          res = await AdminUserService.addCompanyUser(data);
        }
      }

      if (res?.data?.status === '200') {
        enqueueSnackbar(res?.data?.description);
        router.push(paths.dashboard.users.list);
      }
    } catch (e) {
      console.log('error', e);
      enqueueSnackbar(e || 'An unknown error occurred', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Users"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User' },
          { name: 'Create' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              label="First Name"
              name="firstName"
              InputProps={{
                shrink: !isEditMode,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Last Name" name="lastName" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField label="Email *" name="email" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="password"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Password
                  <Tooltip title="Password must be 8 or more characters in length, 1 or more uppercase characters, 1 or more digit characters and 1 or more special characters.">
                    <Iconify icon="material-symbols:info-outline" />
                  </Tooltip>
                </Box>
              }
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {accountTypeLoading ? (
              <Skeleton variant="rounded" height={50} />
            ) : (
              <RHFSelect
                InputLabelProps={{ shrink: true }}
                native
                label="Account Type *"
                name="accountTypeName"
              >
                <option value="">--Select Account Type -- </option>
                {accountTypeOptions?.length &&
                  accountTypeOptions?.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
              </RHFSelect>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {accountTypeLoading ? (
              <Skeleton variant="rounded" height={50} />
            ) : (
              <RHFTextField label="Company Name *" name="companyName" />
            )}
          </Grid>
        </Grid>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'end' }}>
          <LoadingButton type="submit" variant="contained" loading={loading || accountTypeLoading}>
            {isEditMode ? 'Update' : 'Create'}
          </LoadingButton>
        </Box>
      </FormProvider>
    </Container>
  );
};

export default UserCreateForm;

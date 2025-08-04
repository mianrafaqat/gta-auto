import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from 'src/auth/hooks';
import { CarsService } from 'src/services';
import { paths } from 'src/routes/paths';
import { Box, Grid } from '@mui/material';
import { RHFEditor, RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import Upload from 'src/components/upload/upload';

const schema = yup.object().shape({
  price: yup.string().required('Price is required.'),
  description: yup.string().required('Description is required.'),
  image: yup
    .array()
    .min(3, 'Minimum of 3 images required')
    .max(9, 'Maximum of 9 images allowed')
    .required('At least one image is required.'),
  carDetails: yup.object().shape({
    mileage: yup.string().required('Mileage is required.'),
  }),
  title: yup.string().required('Title is required.'),
  category: yup.string().required('Category is required.'),
  link: yup.string().optional(), // Make link optional
  location: yup.string().required('Location is required.'),
});

const FORMAT_INCLUDES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function EditCarForm() {
  const params = useSearchParams();
  const carId = params.get('carId');
  const router = useRouter();

  const { user = {} } = useAuthContext()?.user || {};
  
  console.log('EditCarForm - carId:', carId);
  console.log('EditCarForm - user:', user);

  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = useState([]);

  const [carDetails, setCarDetails] = useState({});

  const defaultValues = useMemo(() => {
    console.log('defaultValues carDetails:', carDetails);
    if (carDetails) {
      setFiles(carDetails.image || []);
      
      console.log('Car details structure check:', {
        hasCarDetails: !!carDetails.carDetails,
        carDetailsKeys: carDetails.carDetails ? Object.keys(carDetails.carDetails) : [],
        mileage: carDetails.carDetails?.mileage,
        directMileage: carDetails.mileage
      });

      return {
        ...carDetails,
        carDetails: {
          ...carDetails.carDetails,
          // Fallback for mileage if it's not in carDetails
          mileage: carDetails.carDetails?.mileage || carDetails.mileage || '',
        },
      };
    }
    return {
      price: '',
      description: '',
      image: [],
      title: '',
      category: '',
      link: '',
      location: '',
    };
  }, [carDetails]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };
  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const handleDropRestrictedFormats = () => {
    if (files.length) {
      const filteredFiles = files.filter(
        (file) => FORMAT_INCLUDES.includes(file.type) || file?.includes('https://gtaAutos.co.uk/')
      );
      setFiles(filteredFiles);
      setValue('image', filteredFiles);
    }
  };

  useEffect(() => {
    handleDropRestrictedFormats();
  }, [JSON.stringify(files)]);

  const fetchCarById = async () => {
    try {
      console.log('Fetching car with ID:', carId);
      const res = await CarsService.getCarById(carId);
      console.log('Car fetch response:', res);

      if (res.status === 200) {
        setCarDetails(res?.data);
        console.log('Car details set:', res?.data);
        console.log('Car details structure:', {
          title: res?.data?.title,
          price: res?.data?.price,
          description: res?.data?.description,
          category: res?.data?.category,
          link: res?.data?.link,
          location: res?.data?.location,
          carDetails: res?.data?.carDetails,
          image: res?.data?.image
        });
      } else {
        console.log('Error response:', res);
        enqueueSnackbar(res?.data, { variant: 'error' });
        router.push(paths.dashboard.cars.my.list);
      }
    } catch (err) {
      console.log('🚀 ~ fetchCarById ~ err:', err);
    } finally {
    }
  };

  useEffect(() => {
    console.log('useEffect triggered - carId:', carId, 'user._id:', user?._id);
    if (carId && user?._id) {
      fetchCarById();
    }
  }, [carId, user?._id]);

  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    formState: { isValid, errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    console.log('Resetting form with defaultValues:', defaultValues);
    console.log('Form values being set:', {
      title: defaultValues?.title,
      price: defaultValues?.price,
      description: defaultValues?.description,
      category: defaultValues?.category,
      link: defaultValues?.link,
      location: defaultValues?.location,
      carDetails: defaultValues?.carDetails,
      image: defaultValues?.image
    });
    reset(defaultValues);
  }, [defaultValues]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log('Form values being submitted:', values);
      values = {
        ...values,
        carID: carId,
        ownerID: user?._id,
      };
      console.log('Final values being sent to API:', values);
      const res = await CarsService.update(values);
      if (res.status === 200) {
        enqueueSnackbar(res?.data);
        router.push(paths.dashboard.cars.my.list);
      } else {
        enqueueSnackbar(res?.data, { variant: 'error' });
      }
    } catch (err) {
      console.log('Submit error:', err);
      enqueueSnackbar(err, { variant: 'error' });
    } finally {
    }
  });

  return (
    <Box>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RHFRadioGroup
              row
              name="category"
              defaultValue="hire"
              label="Category *"
              spacing={4}
              options={[
                { value: 'sale', label: 'Sale' },
                { value: 'hire', label: 'Hire' },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              InputLabelProps={{
                shrink: true,
              }}
              name="title"
              label="Title"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              InputLabelProps={{
                shrink: true,
              }}
              name="price"
              label="Price"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              InputLabelProps={{
                shrink: true,
              }}
              name="carDetails.mileage"
              label="Mileage"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              InputLabelProps={{
                shrink: true,
              }}
              name="link"
              label="Youtube Link"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField
              InputLabelProps={{
                shrink: true,
              }}
              name="location"
              label="Location"
            />
          </Grid>
          <Grid item xs={12}>
            <Upload
              multiple
              files={files}
              onDrop={handleDropMultiFile}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              buttonPosition="start"
              edit
            />
          </Grid>
          <Grid item xs={12}>
            <RHFEditor simple name="description" sx={{ height: 200 }} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'end' }}>
            <LoadingButton type="submit" variant="contained">
              Update
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
}

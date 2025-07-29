"use client";

import React, { useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import Iconify from "../iconify";
import { CarsService } from "src/services";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import CarBodyTypesSection from "./car-body-types";
import ServicesSection from "./services-section";
import FeaturedCarsSection from "./featured-cars";
import BrowseBrandsSection from "./browse-brands";
import LatestProductsSection from "./latest-products";
import UpcomingCarsSection from "./upcoming-cars";
import LastestEightCars from "../first-eight-cars";

export default function CarsFiltersPage() {
  const [carBodyList, setCarBodyList] = useState([]);

  const fetchCarBodyList = async () => {
    try {
      const res = await CarsService.getCarBodyList();
      if (res?.data) {
        setCarBodyList(res?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    fetchCarBodyList();
  }, []);

  const [allCars, setAllCars] = useState([]);

  const fetchAllCars = async () => {
    try {
      const res = await CarsService.getAll();
      if (res?.status === 200) {
        const filteredCar = res?.data?.filter(c => c?.status !== 'Paused') || [];
        setAllCars(filteredCar);
      }
    } catch (e) {
      console.log("error: ", err);
    }
  };
  useEffect(() => {
    console.log("fetching all cars");
    fetchAllCars();
  }, []);

  return (
    <>
      <Container
        sx={{
          borderRadius:"12px",
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          minHeight: 630,
          background: "url(/assets/images/home/hero/cityautos-header-hero.jpg)",
          backgroundRepeat:'no-repeat',
          backgroundSize:"cover",
          backgroundPosition:'center center'
        }}
        maxWidth="xl"
      >
        <Box
          p={3}
          sx={{
            borderRadius: "12px",
            maxWidth: {
              sm: "95%",
              md: "80%",
              lg: "70%",
            },
            width: "90%",
            background:'#fff',
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          }}
        >
          <Box mt={2}>
            <SearchByModels />
          </Box>
        </Box>
      </Container>
      
      {/* Car Body Types Section */}
      <CarBodyTypesSection />
      
      {/* Services Section */}
      <ServicesSection />

      <LastestEightCars allCars={allCars} />
      
      {/* Featured Cars Section */}
      <FeaturedCarsSection />
      
      {/* Browse Brands Section */}
      <BrowseBrandsSection />
      
      {/* Latest Products Section */}
      <LatestProductsSection />
      
      {/* Upcoming Cars And Events Section */}
      <UpcomingCarsSection />

      
      
    </>
  );
}

function SearchByModels({ reset = false, fetchAllCars=()=>{} }) {
  const [selectedCar, setSelectedCar] = useState({});
  const [carsMakesList, setCarsMakesList] = useState([]);
  const [carModelsList, setCarsModelsList] = useState([]);
  const [selectedModel, setSelectModel] = useState({});
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const transmissionOptions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];

  const fetchCarModels = async () => {
    try {
      const res = await CarsService.getCarModels({
        selectedCar: selectedCar?.value,
      });
      if (res?.data?.models) {
        let data = [...res?.data?.models];
        data.splice(0, 0, { model: "All" });
        setCarsModelsList(data);
        setSelectModel(data[0]);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const fetchCarMakes = async () => {
    try {
      setLoading(false);
      const res = await CarsService.getCarMakes();
      if (res?.data) {
        let data = [...res?.data] || [];
        data.splice(0, 0, { label: "All", value: "all" });
        setCarsMakesList(res?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelectChange = (event, newValue) => {
    setSelectedCar(newValue);
    setSelectModel({});
  };

  const onHandleSearch = () => {
    try {
      router.push(
        `${paths.cars.root}?selectedCar=${selectedCar?.value}&model=${selectedModel?.model}&transmission=${selectedTransmission}&tab=one`
      );
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    fetchCarMakes();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      if (Object.keys(selectedCar).length) {
        fetchCarModels();
      }
    } else {
      resetFilters();
      fetchAllCars();
    }
  }, [selectedCar]);

  const resetFilters = () => {
    setSelectedCar({});
    setCarsModelsList([]);
    setSelectModel({});
    setSelectedTransmission("");
  };

  useEffect(() => {
    resetFilters();
  }, [reset]);

  return (
    <Box>
      {/* Labels */}
      <Stack direction="row" spacing={0} mb={2}>
        <Box sx={{ flex: 1,  color: "black" }}>
          <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
            Explore
          </Typography>
        </Box>
        <Box sx={{ flex: 1,  color: "black" }}>
          <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
            Make
          </Typography>
        </Box>
        <Box sx={{ flex: 1,  color: "black" }}>
          <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
            Transmission
          </Typography>
        </Box>
      </Stack>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          borderRadius: '12px',
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          overflow: 'hidden',
          minHeight: '70px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Search Input */}
        <Box sx={{ flex: 1, borderRight: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', width: '100%' }}>
          <TextField
            fullWidth
            placeholder="What are you looking for..."
            variant="standard"
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" sx={{ mr: 1, color: '#666', fontSize: '22px' }} />,
              disableUnderline: true,
              sx: { px: 3, py: 2.5, fontSize: '16px', width: '100%', display: 'flex', alignItems: 'center' }
            }}
          />
        </Box>

        {/* Make Dropdown */}
        <Box sx={{ flex: 1, borderRight: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', width: '100%' }}>
          <Autocomplete
            options={carsMakesList}
            onChange={handleCarSelectChange}
            value={selectedCar}
            getOptionLabel={(option) => option?.label || ""}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select an option"
                variant="standard"
                sx={{ width: '100%', paddingTop: "0" }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <Iconify icon="eva:plus-fill" sx={{ mr: 1, color: '#666', fontSize: '22px' }} />,
                  disableUnderline: true,
                  sx: { px: 3, py: 0, fontSize: '16px', width: '100%', display: 'flex', alignItems: 'center', paddingTop: "0" }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} value={option.value} key={option.label}>
                {option.label}
              </li>
            )}
          />
        </Box>

        {/* Transmission Dropdown */}
        <Box sx={{ flex: 1, borderRight: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', width: '100%' }}>
          <Autocomplete
            options={transmissionOptions}
            value={selectedTransmission}
            onChange={(event, newValue) => setSelectedTransmission(newValue)}
            getOptionLabel={(option) => option || ""}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select an option"
                variant="standard"
                sx={{ width: '100%' }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <Iconify icon="eva:settings-2-fill" sx={{ mr: 1, color: '#666', fontSize: '22px' }} />,
                  disableUnderline: true,
                  sx: { px: 3, py: 0, fontSize: '16px', width: '100%', display: 'flex', alignItems: 'center', paddingTop: "0" }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />
        </Box>

        {/* Search Button */}
        <Button
          variant="contained"
          onClick={onHandleSearch}
          sx={{
            backgroundColor: '#00ff00',
            color: 'white',
            borderRadius: 0,
            px: 8,
            py: 2.5,
            fontSize: '16px',
            fontWeight: 'bold',
            minHeight: '70px',
            '&:hover': {
              backgroundColor: '#00cc00',
            }
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}

function SearchByCarBody({ reset = false, carBodyList = [] }) {
  const [selectedCarBody, setSelectedBody] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (selectedCarBody) {
      router.push(`${paths.cars.root}?makeType=${selectedCarBody}&tab=two`);
    }
  }, [selectedCarBody]);

  return (
    <>
      <Autocomplete
        fullWidth
        options={carBodyList}
        value={selectedCarBody}
        onChange={(event, newValue) => {
          setSelectedBody(newValue);
        }}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} label="Car Body" margin="none" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option}
          </li>
        )}
      />
    </>
  );
}

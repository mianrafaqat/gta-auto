
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import MuxPlayer from "@mux/mux-player-react";
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
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import CarBodyTypesSection from "./car-body-types";
import ServicesSection from "./services-section";
import FeaturedCarsSection from "./featured-cars";
import BrowseBrandsSection from "./browse-brands";
import LatestProductsSection from "./latest-products";
import UpcomingCarsSection from "./upcoming-cars";
import SellYourCarSection from './sell-your-car';
import LastestEightCars from "../first-eight-cars";
import BrowseVideosSection from "./browse-videos";
import { useGetCarBodyList, useGetCarMakes, useGetCarModels } from "src/hooks/use-cars";

export default function CarsFiltersPage() {
  const { data: carBodyList = [], isLoading: carBodyLoading } = useGetCarBodyList();

  return (
    <>
      <Container
        sx={{
          borderRadius: "12px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          minHeight: 630,
          position: 'relative',
          // overflow: 'hidden',
        }}
        maxWidth="xl"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            '& > *': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }
          }}
        >
          <MuxPlayer
            playbackId="9WU2Y5OXCT56CzULR8mFAhmKPwJshaP66G902lnvKyek"
            autoPlay
            muted
            controls={false}
            loop
            streamType="on-demand"
            style={{
              height: '100%',
              width: '100vw',
              objectFit: 'cover',
              // borderRadius: '12px',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
              '--controls': 'none',
              '--media-control-display': 'none',
              '& mux-player': {
                '--controls': 'none !important',
              },
              pointerEvents: 'none',
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '60%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            textAlign: 'center',
            // width: '100%'
          }}
        >
          <Box
            component="img"
            src="/assets/logo.webp"
            alt="Logo"
            sx={{
              width: { xs: '200px', sm: '250px', md: '300px' },
              height: 'auto',
              marginBottom: 3
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 700,
              textTransform: 'uppercase',
              animation: 'fadeInOut 2s infinite',
              '@keyframes fadeInOut': {
                '0%': { opacity: 0.4 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.4 },
              },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
            }}
          >
            Coming Soon
          </Typography>
        </Box>
        <Box
          p={3}
          sx={{
            zIndex: 999,
            borderRadius: "12px",
            marginBottom: 0,
            maxWidth: {
              sm: "95%",
              md: "80%",
              lg: "100%",
            },
            width: "90%",
            background: '#fff',
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
            position: 'relative',
            zIndex: 1,
            mb: "-50px"
          }}
        >
          <Box mt={2}>
            <SearchByModels />
          </Box>
        </Box>
      </Container>

       {/* Sell Your Car Section */}
       <SellYourCarSection />
      
      {/* Car Body Types Section */}
      <CarBodyTypesSection  />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Featured Cars Section */}
      <FeaturedCarsSection />
      
      {/* Browse Brands Section */}
      
      
      {/* Latest Products Section */}
      <LatestProductsSection />

      <BrowseBrandsSection />
      
      
      
      {/* Browse Videos Section */}
      <BrowseVideosSection />
      
      {/* Upcoming Cars And Events Section */}
      <UpcomingCarsSection />
      
     
      
    </>
  );
}

function SearchByModels({ reset = false, fetchAllCars=()=>{} }) {
  const [selectedCar, setSelectedCar] = useState({});
  const [carModelsList, setCarsModelsList] = useState([]);
  const [selectedModel, setSelectModel] = useState({});
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const transmissionOptions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];

  // React Query hooks
  const { data: carsMakesList = [], isLoading: makesLoading } = useGetCarMakes();
  const { data: carModelsData, isLoading: modelsLoading } = useGetCarModels(selectedCar?.value);

  const fetchCarModels = async () => {
    try {
      if (carModelsData?.data?.models) {
        let data = [...carModelsData.data.models];
        data.splice(0, 0, { model: "All" });
        setCarsModelsList(data);
        setSelectModel(data[0]);
      }
    } catch (err) {
      console.log("err: ", err);
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
    if (selectedCar) {
      if (Object.keys(selectedCar).length) {
        fetchCarModels();
      }
    } else {
      resetFilters();
      fetchAllCars();
    }
  }, [selectedCar, carModelsData]);

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
            loading={makesLoading}
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
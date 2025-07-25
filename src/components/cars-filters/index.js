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
} from "@mui/material";
import Iconify from "../iconify";
import { CarsService } from "src/services";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";

export default function CarsFiltersPage() {
  const [currentTab, setCurrentTab] = useState("one");

  const [carBodyList, setCarBodyList] = useState([]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    //  fetchAllCars();
  }, []);

  const TABS = [
    {
      value: "one",
      icon: <Iconify icon="solar:phone-bold" width={24} />,
      label: "By Car",
      component: (
        <SearchByModels
        //   fetchAllCars={fetchAllCars}
        //   reset={reset}
        //   onHandleSearch={onHandleSearch}
        />
      ),
    },
    {
      value: "two",
      icon: <Iconify icon="solar:phone-bold" width={24} />,
      label: "By Car Body",
      component: (
        <SearchByCarBody
          //   onChange={handleFilterCarBody}
          carBodyList={carBodyList}
          //   reset={reset}
        />
      ),
    },
  ];

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
          p={2}
          sx={{
            borderRadius: "5px",
            maxWidth: {
              sm: "100%",
              md: "40%",
            },
            width:'60%',
            background:'#fff',
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          }}
        >
          <Tabs value={currentTab} onChange={handleChangeTab}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
          <Box mt={2}>
            {TABS.map(
              (tab) =>
                tab.value === currentTab && (
                  <Box key={tab.value}>{tab.component}</Box>
                )
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

function SearchByModels({ reset = false, fetchAllCars=()=>{} }) {
  const [selectedCar, setSelectedCar] = useState({});
  console.log("swl", selectedCar)

  const [carsMakesList, setCarsMakesList] = useState([]);
  console.log("carsMakesList: ", carsMakesList)
  const [carModelsList, setCarsModelsList] = useState([]);
  const [selectedModel, setSelectModel] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchCarModels = async () => {
    try {
      const res = await CarsService.getCarModels({
        selectedCar: selectedCar?.value,
      });
      if (res?.data?.models) {
        let data = [...res?.data?.models];
        data.splice(0, 0, { model: "All" });
        setCarsModelsList(data);
        setSelectModel(data[0]); // Set the default model after fetching
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
    // Clear the selected model when a new car is selected
    setSelectModel({});
  };

  const onHandleSearch = () => {
    try {
      router.push(
        `${paths.cars.root}?selectedCar=${selectedCar?.value}&model=${selectedModel?.model}&tab=one`
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
  };

  useEffect(() => {
    resetFilters();
  }, [reset]);

  return (
    <Stack sx={{
      flexDirection:  {
        xs: 'column',
        md: 'row'
      },
    }}  gap={1}>
      <Autocomplete
        fullWidth
        options={carsMakesList}
        onChange={handleCarSelectChange}
        value={selectedCar}
        // inputValue={inputValue}
        getOptionLabel={(option) => option?.label || ""}
        renderInput={(params) => <TextField {...params} label="Select Make" />}
        renderOption={(props, option) => (
          <li {...props} value={option.value} key={option.label}>
            {option.label}
          </li>
        )}
      />

      <Autocomplete
        fullWidth
        options={carModelsList}
        value={selectedModel}
        onChange={(event, newValue) => {
          setSelectModel(newValue);
        }}
        disabled={!Boolean(selectedCar)}
        // inputValue={inputValue}
        getOptionLabel={(option) => option?.model || ""}
        renderInput={(params) => <TextField {...params} label="Select Model" />}
        renderOption={(props, option) => (
          <li {...props} value={option.model} key={option.model}>
            {option.model}
          </li>
        )}
      />

      <Button
        disabled={!Boolean(selectedCar && selectedModel)}
        fullWidth
        variant="contained"
        onClick={onHandleSearch}
      >
        Search
      </Button>
    </Stack>
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

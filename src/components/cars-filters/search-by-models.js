"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import Iconify from "src/components/iconify";
import { useGetCarMakes, useGetCarModels } from "src/hooks/use-cars";

function SearchByModels({ reset = false, fetchAllCars = () => {} }) {
  const [searchText, setSearchText] = useState("");
  const [selectedCar, setSelectedCar] = useState({});
  const [carModelsList, setCarsModelsList] = useState([]);
  const [selectedModel, setSelectModel] = useState({});
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const transmissionOptions = ["Automatic", "Manual", "CVT", "Semi-Automatic"];

  // React Query hooks
  const { data: carsMakesResponse, isLoading: makesLoading } = useGetCarMakes();
  const { data: carModelsData, isLoading: modelsLoading } = useGetCarModels(
    selectedCar?.value
  );

  // Ensure carsMakesList is always an array
  const carsMakesList = useMemo(() => {
    if (carsMakesResponse?.data && Array.isArray(carsMakesResponse.data)) {
      return carsMakesResponse.data;
    }
    return [];
  }, [carsMakesResponse]);

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
      // If user has selected car-specific filters (make, model, transmission), search only in cars
      const hasCarFilters = selectedCar?.value || selectedModel?.model || selectedTransmission;
      
      if (hasCarFilters) {
        // Navigate to cars page with specific filters
        router.push(
          `${paths.cars.root}?searchText=${searchText || ""}&selectedCar=${selectedCar?.value || ""}&model=${selectedModel?.model || ""}&transmission=${selectedTransmission || ""}&tab=one`
        );
      } else if (searchText) {
        // If only text search (no car-specific filters), navigate to unified search page
        // This will search across both cars and products
        router.push(`/search?searchText=${encodeURIComponent(searchText)}`);
      } else {
        // If no search criteria, go to cars page
        router.push(paths.cars.root);
      }
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
    setSearchText("");
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
        <Box sx={{ flex: 1, color: "black" }}>
          <Typography
            variant="body2"
            sx={{ color: "black", fontWeight: "bold", fontSize: "14px" }}>
            Explore
          </Typography>
        </Box>
        <Box sx={{ flex: 1, color: "black" }}>
          <Typography
            variant="body2"
            sx={{ color: "black", fontWeight: "bold", fontSize: "14px" }}>
            Make
          </Typography>
        </Box>
        <Box sx={{ flex: 1, color: "black" }}>
          <Typography
            variant="body2"
            sx={{ color: "black", fontWeight: "bold", fontSize: "14px" }}>
            Transmission
          </Typography>
        </Box>
      </Stack>

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          borderRadius: "12px",
          backgroundColor: "white",
          border: "2px solid #e0e0e0",
          overflow: "hidden",
          minHeight: "70px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
        {/* Search Input */}
        <Box
          sx={{
            flex: 1,
            borderRight: "2px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}>
          <TextField
            fullWidth
            placeholder="What are you looking for..."
            variant="standard"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onHandleSearch();
              }
            }}
            sx={{ width: "100%" }}
            InputProps={{
              startAdornment: (
                <Iconify
                  icon="eva:search-fill"
                  sx={{ mr: 1, color: "#666", fontSize: "22px" }}
                />
              ),
              disableUnderline: true,
              sx: {
                px: 3,
                py: 2.5,
                fontSize: "16px",
                width: "100%",
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </Box>

        {/* Make Dropdown */}
        <Box
          sx={{
            flex: 1,
            borderRight: "2px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}>
          <Autocomplete
            options={carsMakesList || []}
            onChange={handleCarSelectChange}
            value={selectedCar}
            getOptionLabel={(option) => option?.label || ""}
            loading={makesLoading}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select an option"
                variant="standard"
                sx={{ width: "100%", paddingTop: "0" }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Iconify
                      icon="eva:plus-fill"
                      sx={{ mr: 1, color: "#666", fontSize: "22px" }}
                    />
                  ),
                  disableUnderline: true,
                  sx: {
                    px: 3,
                    py: 0,
                    fontSize: "16px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "0",
                  },
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
        <Box
          sx={{
            flex: 1,
            borderRight: "2px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}>
          <Autocomplete
            options={transmissionOptions}
            value={selectedTransmission}
            onChange={(event, newValue) => setSelectedTransmission(newValue)}
            getOptionLabel={(option) => option || ""}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select an option"
                variant="standard"
                sx={{ width: "100%" }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Iconify
                      icon="eva:settings-2-fill"
                      sx={{ mr: 1, color: "#666", fontSize: "22px" }}
                    />
                  ),
                  disableUnderline: true,
                  sx: {
                    px: 3,
                    py: 0,
                    fontSize: "16px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "0",
                  },
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
            backgroundColor: "#00ff00",
            color: "white",
            borderRadius: 0,
            px: 8,
            py: 2.5,
            fontSize: "16px",
            fontWeight: "bold",
            minHeight: "70px",
            "&:hover": {
              backgroundColor: "#00cc00",
            },
          }}>
          Search
        </Button>
      </Box>
    </Box>
  );
}

export default SearchByModels;

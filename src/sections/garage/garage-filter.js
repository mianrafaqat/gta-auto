import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputBase, { inputBaseClasses } from "@mui/material/InputBase";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ColorPicker } from "src/components/color-utils";
import {
  Autocomplete,
  Box,
  ToggleButton,
  Select,
  Tab,
  Tabs,
  TextField,
  ToggleButtonGroup,
} from "@mui/material";
import ComponentBlock from "../_examples/component-block";
import { CarsService } from "src/services";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "src/routes/paths";

// ----------------------------------------------------------------------

export default function GarageFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  colorOptions,
  genderOptions,
  ratingOptions,
  categoryOptions,
  fuelOptions,
  onHandleSearch,
  reset,
  fetchAllCars = () => {},
}) {
  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10;

    const firstValue = index === 0 ? `$${value}` : `${value}`;

    return {
      value,
      label: index % 4 ? "" : firstValue,
    };
  });

  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleFilterGender = useCallback(
    (newValue) => {
      const checked = filters?.gender?.includes(newValue)
        ? filters.gender.filter((value) => value !== newValue)
        : [...filters?.gender, newValue];
      onFilters("gender", checked);
    },
    [filters.gender, onFilters]
  );

  const handleFilterCarBody = useCallback(
    (newValue) => {
      onFilters("makeType", newValue);
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (e, newValue) => {
      onFilters("category", newValue);
      setSelectedCategory(newValue);
    },
    [onFilters]
  );

  const handleSearch = useCallback(
    (newValue) => {
      onFilters("searchByTitle", newValue);
    },
    [onFilters]
  );

  const handleFuelType = useCallback(
    (newValue) => {
      onFilters("fuelType", newValue);
    },
    [onFilters]
  );

  const handleFilterPriceRange = useCallback(
    (event, newValue) => {
      onFilters("priceRange", newValue);
    },
    [onFilters]
  );

  const handleFilterMileage = useCallback(
    (event, newValue) => {
      onFilters("mileage", newValue);
    },
    [onFilters]
  );

  const handleFilterYearRange = useCallback(
    (event, newValue) => {
      onFilters("year", newValue);
    },
    [onFilters]
  );

  const handleFilterRating = useCallback(
    (newValue) => {
      onFilters("rating", newValue);
    },
    [onFilters]
  );
  const [currentTab, setCurrentTab] = useState("one");
  const [carBodyList, setCarBodyList] = useState([]);
  const params = useSearchParams();

  const paramTab = params.get("tab");

  const router = useRouter();

  useEffect(() => {
    if (paramTab) {
      setCurrentTab(paramTab);
    } else {
      setCurrentTab("one");
    }
  }, [paramTab]);

  const TABS = [
    {
      value: "one",
      icon: <Iconify icon="solar:phone-bold" width={24} />,
      label: "By Car",
      component: (
        <SearchByModels
          fetchAllCars={fetchAllCars}
          reset={reset}
          onHandleSearch={onHandleSearch}
        />
      ),
    },
    {
      value: "two",
      icon: <Iconify icon="solar:phone-bold" width={24} />,
      label: "By Car Body",
      component: (
        <SearchByCarBody
          onChange={handleFilterCarBody}
          carBodyList={carBodyList}
          reset={reset}
        />
      ),
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push(`${paths.cars.root}?tab=${newValue}`);
    onResetFilters();
  }, []);

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

  useEffect(() => {
    setSelectedCategory("all");
  }, [reset]);

  const renderHead = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h6" color="#fff" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const control = {
    value: selectedCategory,
    onChange: handleFilterCategory,
    exclusive: true,
  };

  const CategoriesButtons = () => {
    return (
      <ToggleButtonGroup color="primary" {...control} fullWidth>
        <ToggleButton value="sale" key="sale">
          Sale
        </ToggleButton>
      </ToggleButtonGroup>
    );
  };

  const renderFuelType = (
    <Stack>
      <Typography variant="subtitle2" color="#fff" sx={{ mb: 1 }}>
        Fuel Type
      </Typography>
      <Autocomplete
        label=""
        fullWidth
        options={fuelOptions}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleFuelType(value)}
        value={filters.fuelType}
        sx={{
          "& .MuiInputBase-input": {
            color: "#fff",
            "&::placeholder": {
              color: "#fff",
              opacity: 1,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="none"
            placeholder="Select Fuel Type"
            sx={{
              "& .MuiInputBase-input": {
                color: "#fff",
                "&::placeholder": {
                  color: "#fff",
                  opacity: 1,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
            }}
            // Set TextField's value based on selected option
            onChange={() => {}} // Make TextField uncontrolled to prevent override
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option} color="#fff">
            {option}
          </li>
        )}
      />
    </Stack>
  );

  const searchByTitle = (
    <Box>
      <TextField
        value={filters.searchByTitle}
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        label="Search"
        sx={{
          "& .MuiInputBase-input": {
            color: "#fff",
          },
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        }}
      />
    </Box>
  );

  const renderMileage = (
    <Stack>
      <Typography variant="subtitle2" color="#fff" sx={{ flexGrow: 1 }}>
        Mileage
      </Typography>

      <Stack direction="row" spacing={5} sx={{ my: 2 }}>
        <InputRange type="min" value={filters.mileage} onFilters={onFilters} />
        <InputRange type="max" value={filters.mileage} onFilters={onFilters} />
      </Stack>

      <Slider
        value={filters.mileage}
        onChange={handleFilterMileage}
        step={1000}
        min={0}
        max={1000000}
        sx={{
          alignSelf: "center",
          width: `calc(100% - 24px)`,
        }}
      />
    </Stack>
  );

  const renderPrice = (
    <Stack>
      <Typography variant="subtitle2" color="#fff" sx={{ flexGrow: 1 }}>
        Price (PKR)
      </Typography>

      <Stack direction="row" spacing={5} sx={{ my: 2 }}>
        <InputRange
          type="min"
          value={filters.priceRange}
          onFilters={onFilters}
        />
        <InputRange
          type="max"
          value={filters.priceRange}
          onFilters={onFilters}
        />
      </Stack>

      <Slider
        value={filters.priceRange}
        onChange={handleFilterPriceRange}
        step={10000}
        min={100000}
        max={25000000}
        // marks={marksLabel}
        getAriaValueText={(value) => `$${value}`}
        valueLabelFormat={(value) => `$${value}`}
        sx={{
          alignSelf: "center",
          width: `calc(100% - 24px)`,
        }}
      />
    </Stack>
  );

  const renderYear = (
    <Stack>
      <Typography variant="subtitle2" color="#fff" sx={{ flexGrow: 1 }}>
        Manufacturer Year
      </Typography>

      <Stack direction="row" spacing={5} sx={{ my: 2 }}>
        <InputRange
          type="min"
          value={filters.year}
          onFilters={onFilters}
          name="year"
        />
        <InputRange
          type="max"
          value={filters.year}
          onFilters={onFilters}
          name="year"
        />
      </Stack>

      <Slider
        value={filters.year}
        onChange={handleFilterYearRange}
        step={1}
        min={1940}
        max={new Date().getFullYear()}
        // marks={marksLabel}
        getAriaValueText={(value) => `$${value}`}
        valueLabelFormat={(value) => `$${value}`}
        sx={{
          alignSelf: "center",
          width: `calc(100% - 24px)`,
        }}
      />
    </Stack>
  );

  const renderRating = (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="subtitle2">Rating</Typography>

      {ratingOptions.map((item, index) => (
        <Stack
          key={item}
          direction="row"
          onClick={() => handleFilterRating(item)}
          sx={{
            borderRadius: 1,
            cursor: "pointer",
            typography: "body2",
            "&:hover": { opacity: 0.48 },
            ...(filters.rating === item && {
              pl: 0.5,
              pr: 0.75,
              py: 0.25,
              bgcolor: "action.selected",
            }),
          }}>
          <Rating readOnly value={4 - index} sx={{ mr: 1 }} /> & Up
        </Stack>
      ))}
    </Stack>
  );

  const renderTabs = (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          "& .MuiTab-root": {
            color: "#fff",
            "&:hover": {
              color: "#fff",
              opacity: 0.8,
            },
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#00FF00",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#00FF00",
          },
        }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {TABS.map(
        (tab) =>
          tab.value === currentTab && <Box key={tab.value}>{tab.component}</Box>
      )}
    </>
  );

  return (
    <>
      <Scrollbar sx={{ px: 2.5, py: 3 }}>
        <Stack spacing={3}>
          {renderHead}
          <CategoriesButtons />
          {renderTabs}
          {searchByTitle}
          {/* {renderGender} */}

          {/* {renderCategory} */}

          {/* {renderColor} */}

          {renderPrice}

          {renderYear}

          {renderFuelType}

          {renderMileage}

          {/* {renderRating} */}
        </Stack>
      </Scrollbar>
    </>
  );
}

GarageFilters.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  genderOptions: PropTypes.array,
  onResetFilters: PropTypes.func,
  ratingOptions: PropTypes.array,
  categoryOptions: PropTypes.array,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

// ----------------------------------------------------------------------

function SearchByCarBody({ onChange, carBodyList = [], reset = false }) {
  const [selectedCarBody, setSelectedBody] = useState("");

  const params = useSearchParams();
  const paramCarBody = params.get("makeType");
  const tab = params.get("tab");

  const router = useRouter();

  const resetFilters = () => setSelectedBody("");

  const ref = useRef();

  useEffect(() => {
    if (!ref?.current) {
      ref.current = true;
      return;
    }
    resetFilters();
    router.push(`${paths.cars.root}?tab=two`);
  }, [reset]);

  useEffect(() => {
    if (paramCarBody && tab === "two") {
      onChange(paramCarBody);
      setSelectedBody(paramCarBody);
    } else {
      resetFilters();
    }
  }, [paramCarBody, tab]);

  return (
    <>
      <Autocomplete
        fullWidth
        options={carBodyList}
        value={selectedCarBody}
        onChange={(event, newValue) => {
          onChange(newValue);
          setSelectedBody(newValue);
        }}
        sx={{
          "& .MuiInputBase-input": {
            color: "#fff",
            "&::placeholder": {
              color: "#fff",
              opacity: 1,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        }}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Car Body"
            margin="none"
            sx={{ color: "#fff" }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option} color="#000">
            {option}
          </li>
        )}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function SearchByModels({
  onHandleSearch = () => {},
  reset = false,
  fetchAllCars = () => {},
}) {
  const [selectedCar, setSelectedCar] = useState({});

  const [carsMakesList, setCarsMakesList] = useState([]);
  const [carModelsList, setCarsModelsList] = useState([]);
  const [selectedModel, setSelectModel] = useState({});
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const paramsSelectedCar = params.get("selectedCar");
  const paramsSelectedModel = params.get("model");
  const paramTab = params.get("tab");

  const router = useRouter();

  const fetchCarModels = async () => {
    try {
      const res = await CarsService.getCarModels({
        selectedCar: selectedCar?.value,
      });
      if (res?.data?.models) {
        let data = [...res?.data?.models];
        setCarsModelsList(data);
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
        setCarsMakesList(res?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterCarsByMakeAndModel = async (paramModel = undefined) => {
    try {
      if (
        !Boolean(
          (paramModel?.model || selectedModel?.model) && selectedCar?.value
        )
      ) {
        return;
      }
      const data = {
        model: paramModel?.model || selectedModel?.model,
        make: selectedCar?.value,
      };
      const res = await CarsService.filterByMakeAndModel({ ...data });
      if (res?.data) {
        onHandleSearch(res?.data);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleCarSelectChange = (event, newValue) => {
    if (!newValue?.value) {
      router.push(`${paths.cars.root}?tab=one`);
      return;
    }
    router.push(
      `${paths.cars.root}?selectedCar=${newValue?.value}&model=All&tab=one`
    );
  };

  useEffect(() => {
    fetchCarMakes();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      if (Object.keys(selectedCar).length) {
        fetchCarModels();
      }
    }
  }, [selectedCar]);

  const resetFilters = () => {
    setSelectedCar({});
    setCarsModelsList([]);
    setSelectModel({});
    fetchAllCars();
  };

  useEffect(() => {
    if (paramsSelectedCar && paramsSelectedModel && paramTab === "one") {
      if (carsMakesList?.length) {
        const filterMake = carsMakesList.find(
          (carMake) => carMake?.value === paramsSelectedCar
        );
        console.log("filterMake: ", filterMake);
        if (filterMake) {
          setSelectedCar({ ...filterMake });
        } else {
        }
        if (paramsSelectedModel) {
          const filterModel = carModelsList.find(
            (carModel) => carModel.model === paramsSelectedModel
          );
          if (paramsSelectedModel === "All") {
            setSelectModel({ model: "All" });
          } else {
            setSelectModel(filterModel);
          }
          handleFilterCarsByMakeAndModel(
            paramsSelectedModel === "All" ? "All" : filterModel
          );
        }
      }
    } else {
      setSelectedCar({});
    }
  }, [
    paramsSelectedCar,
    paramsSelectedModel,
    JSON.stringify(carModelsList),
    JSON.stringify(carsMakesList),
    paramTab,
    router?.query,
  ]);

  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      return;
    }
    resetFilters();
    router.push(`${paths.cars.root}?tab=one`);
  }, [reset]);

  useEffect(() => {
    if (!paramsSelectedModel || !carModelsList?.length) {
      setSelectModel({});
    }
  }, [paramsSelectedModel, JSON.stringify(carModelsList)]);

  return (
    <Stack direction="column" gap={1} color="#fff">
      <Autocomplete
        fullWidth
        options={carsMakesList}
        onChange={handleCarSelectChange}
        value={selectedCar}
        // inputValue={inputValue}
        sx={{
          "& .MuiInputBase-input": {
            color: "#fff",
          },
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        }}
        getOptionLabel={(option) => option?.label || ""}
        renderInput={(params) => <TextField {...params} label="Select Make" />}
        renderOption={(props, option) => (
          <li
            {...props}
            value={option.value}
            key={option.label}
            style={{ color: "#000" }}>
            {option.label}
          </li>
        )}
        ListboxProps={{
          style: {
            backgroundColor: "#fff",
          },
        }}
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
        sx={{
          "& .MuiInputBase-input": {
            color: "#fff",
          },
          "& .MuiInputLabel-root": {
            color: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
        }}
        getOptionLabel={(option) => option?.model || ""}
        renderInput={(params) => (
          <TextField {...params} label="Select Model" sx={{ color: "#fff" }} />
        )}
        renderOption={(props, option) => (
          <li {...props} value={option.model} key={option.model} color="#000">
            {option.model}
          </li>
        )}
      />

      <Button
        disabled={!Boolean(selectedCar && selectedModel)}
        fullWidth
        variant="contained"
        onClick={handleFilterCarsByMakeAndModel}
        sx={{ color: "#fff", backgroundColor: "#4caf50" }}>
        Search
      </Button>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function InputRange({ name = "priceRange", type, value, onFilters }) {
  const min = value[0];

  const max = value[1];

  const handleBlurInputRange = useCallback(() => {
    if (min < 0) {
      onFilters(name, [0, max]);
    }
    if (min > 200) {
      onFilters(name, [200, max]);
    }
    if (max < 0) {
      onFilters(name, [min, 0]);
    }
    if (max > 200) {
      onFilters(name, [min, 200]);
    }
  }, [max, min, onFilters]);

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: 1 }}>
      <Typography
        variant="caption"
        sx={{
          flexShrink: 0,
          color: "#fff",
          textTransform: "capitalize",
          fontWeight: "fontWeightSemiBold",
        }}>
        {`${type} `}
      </Typography>

      <InputBase
        fullWidth
        value={type === "min" ? min : max}
        onChange={(event) =>
          type === "min"
            ? onFilters(name, [Number(event.target.value), max])
            : onFilters(name, [min, Number(event.target.value)])
        }
        // onBlur={handleBlurInputRange}
        inputProps={{
          step: 10,
          min: 0,
          max: 200,
          type: "number",
          "aria-labelledby": "input-slider",
        }}
        sx={{
          color: "#fff",
          borderRadius: 0.75,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          [`& .${inputBaseClasses.input}`]: {
            pr: 1,
            py: 0.75,
            textAlign: "center",
            typography: "body2",
          },
        }}
      />
    </Stack>
  );
}

InputRange.propTypes = {
  name: PropTypes.string,
  onFilters: PropTypes.func,
  type: PropTypes.oneOf(["min", "max"]),
  value: PropTypes.arrayOf(PropTypes.number),
};

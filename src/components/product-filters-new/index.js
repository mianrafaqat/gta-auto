import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Slider,
  TextField,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import Iconify from "../iconify";

const ProductFiltersNew = ({ filters, onFilters, onResetFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableItems, setAvailableItems] = useState([
    { name: "GTA BOX", checked: false },
    { name: "Car Wash", checked: false },
    { name: "Wash N Wax", checked: false },
    { name: "Engine", checked: false },
    { name: "Interior", checked: false },
    { name: "Cleaner", checked: false },
    { name: "Shampoo", checked: false },
    { name: "Wax", checked: false },
    { name: "Shiner", checked: false },
    { name: "Decreaser", checked: false },
    { name: "Purpose", checked: false },
    { name: "Others", checked: false },
  ]);

  const categories = [
    "Chemicals",
    "Car Accessories",
    "Car Care",
    "Car Interior",
    "Car Exterior",
    "Car Keys & Remotes",
    "Engine & Mechanical Parts",
    "Tools & Gadgets",
    "Lights, LED & Headlights",
    "Brakes",
    "Oils & Lubricants",
    "Tyres & Rims",
    "Stereo & Sounds",
    "4x4 Modifications",
    "Bikes",
  ];

  const priceRanges = [
    "All Price",
    "Under Pkr.500",
    "Pkr.501 to Pkr.1,000",
    "Pkr.1,001 to Pkr.2,000",
    "Pkr.2,001 to Pkr.5,000",
    "Pkr.5,001 to Pkr.10,000",
    "Above Pkr.10,000",
  ];

  const popularTags = [
    "Civic",
    "Corolla",
    "Sonata",
    "Mehran",
    "Mira",
    "Elantra",
    "Land Cruiser",
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    onFilters("category", event.target.value);
  };

  const handleItemChange = (itemName) => {
    const updatedItems = availableItems.map((item) =>
      item.name === itemName ? { ...item, checked: !item.checked } : item
    );
    setAvailableItems(updatedItems);
    onFilters("availableItems", updatedItems);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilters("priceRange", newValue);
    console.log("Price range changed:", newValue); // Debug log
  };

  const handlePriceRangeRadioChange = (event) => {
    setSelectedPriceRange(event.target.value);
    onFilters("priceRangeOption", event.target.value);
    console.log("Price range option changed:", event.target.value); // Debug log
  };

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    onFilters("popularTags", updatedTags);
  };

  const handleMinPriceChange = (event) => {
    const newMin = parseInt(event.target.value) || 0;
    setPriceRange([newMin, priceRange[1]]);
    onFilters("priceRange", [newMin, priceRange[1]]);
  };

  const handleMaxPriceChange = (event) => {
    const newMax = parseInt(event.target.value) || 50000;
    setPriceRange([priceRange[0], newMax]);
    onFilters("priceRange", [priceRange[0], newMax]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#000",
        color: "#fff",
        pr: "24px",
        // borderRadius: 2,
        // minHeight: "100vh",
      }}>
      {/* CATEGORY Section */}
      <Box sx={{ mb: "20px" }}>
        <Typography
          variant="h7"
          sx={{
            color: "#4caf50",
            mb: "16px",
            fontSize: "16px",
          }}>
          CATEGORY
        </Typography>

        <FormControl component="fieldset" sx={{ width: "100%", mt: "16px" }}>
          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                value={category}
                control={
                  <Radio
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": {
                        color: "#4caf50",
                      },
                      width: "30px",
                      height: "30px",
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: selectedCategory === category ? "#fff" : "#828282",
                      fontSize: "14px",
                      fontWeight:
                        selectedCategory === category ? "bold" : "normal",
                    }}>
                    {category}
                  </Typography>
                }
                sx={{ mb: "0" }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ borderColor: "#fff", mb: "20px" }} />

      {/* AVAILABLE ITEMS Section */}
      <Box sx={{ mb: "20px" }}>
        <Typography
          variant="h7"
          sx={{
            color: "#4caf50",
            mb: "16px",
            fontSize: "16px",
          }}>
          AVAILABLE ITEMS
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0",
            mt: "8px",
          }}>
          {availableItems.map((item) => (
            <FormControlLabel
              key={item.name}
              control={
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleItemChange(item.name)}
                  sx={{
                    color: "#fff",
                    "&.Mui-checked": {
                      color: "#4caf50",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: "#828282",
                    fontSize: "12px",
                    fontWeight: item.checked ? "bold" : "normal",
                  }}>
                  {item.name}
                </Typography>
              }
              sx={{ mb: "0px" }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#fff", mb: "20px" }} />

      {/* PRICE RANGE Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h7"
          sx={{
            color: "#4caf50",
            mb: "16px",
            fontSize: "16px",
          }}>
          PRICE RANGE
        </Typography>

        {/* Slider */}
        <Box sx={{ mb: 3 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            sx={{
              color: "#4caf50",
              "& .MuiSlider-thumb": {
                backgroundColor: "#4caf50",
              },
              "& .MuiSlider-track": {
                backgroundColor: "#4caf50",
              },
            }}
          />
        </Box>

        {/* Price Input Fields */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Min price"
            type="number"
            value={priceRange[0]}
            onChange={handleMinPriceChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "#333",
                },
                "&:hover fieldset": {
                  borderColor: "#4caf50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
            }}
          />
          <TextField
            label="Max price"
            type="number"
            value={priceRange[1]}
            onChange={handleMaxPriceChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "#333",
                },
                "&:hover fieldset": {
                  borderColor: "#4caf50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
            }}
          />
        </Stack>

        {/* Price Range Options */}
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup
            value={selectedPriceRange}
            onChange={handlePriceRangeRadioChange}>
            {priceRanges.map((range) => (
              <FormControlLabel
                key={range}
                value={range}
                control={
                  <Radio
                    sx={{
                      color: "#fff",
                      width: "30px",
                      height: "30px",
                      "&.Mui-checked": {
                        color: "#4caf50",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: "#828282",
                      fontSize: "14px",
                      fontWeight:
                        selectedPriceRange === range ? "bold" : "normal",
                    }}>
                    {range}
                  </Typography>
                }
                sx={{ mb: "0px" }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ borderColor: "#fff", mb: "20px" }} />

      {/* POPULAR TAG Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h7"
          sx={{
            color: "#4caf50",
            mb: "16px",
            fontSize: "16px",
          }}>
          POPULAR TAG
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: "16px" }}>
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              sx={{
                backgroundColor: selectedTags.includes(tag)
                  ? "#fff"
                  : "transparent",
                color: selectedTags.includes(tag) ? "#4CAF50" : "#828282",
                border: "1px solid #fff",
                "&:hover": {
                  backgroundColor: selectedTags.includes(tag)
                    ? "#4caf50"
                    : "#333",
                },
                fontSize: "12px",
                fontWeight: selectedTags.includes(tag) ? "bold" : "normal",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Active Filters */}
      {(selectedCategory ||
        selectedPriceRange ||
        selectedTags.length > 0 ||
        availableItems.some((item) => item.checked)) && (
        <Box sx={{ mt: 4 }}>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "14px",
              mb: 1,
            }}>
            Active Filters:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedCategory && (
              <Chip
                label={selectedCategory}
                onDelete={() => {
                  setSelectedCategory("");
                  onFilters("category", "");
                }}
                deleteIcon={<Iconify icon="mdi:close" />}
                sx={{
                  backgroundColor: "transparent",
                  color: "#4caf50",
                  border: "1px solid #4caf50",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                }}
              />
            )}
            {selectedPriceRange && (
              <Chip
                label={selectedPriceRange}
                onDelete={() => {
                  setSelectedPriceRange("");
                  onFilters("priceRangeOption", "");
                }}
                deleteIcon={<Iconify icon="mdi:close" />}
                sx={{
                  backgroundColor: "transparent",
                  color: "#4caf50",
                  border: "1px solid #4caf50",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                }}
              />
            )}
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => {
                  const updatedTags = selectedTags.filter((t) => t !== tag);
                  setSelectedTags(updatedTags);
                  onFilters("popularTags", updatedTags);
                }}
                deleteIcon={<Iconify icon="mdi:close" />}
                sx={{
                  backgroundColor: "transparent",
                  color: "#4caf50",
                  border: "1px solid #4caf50",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                }}
              />
            ))}
            {availableItems
              .filter((item) => item.checked)
              .map((item) => (
                <Chip
                  key={item.name}
                  label={item.name}
                  onDelete={() => {
                    const updatedItems = availableItems.map((i) =>
                      i.name === item.name ? { ...i, checked: false } : i
                    );
                    setAvailableItems(updatedItems);
                    onFilters("availableItems", updatedItems);
                  }}
                  deleteIcon={<Iconify icon="mdi:close" />}
                  sx={{
                    backgroundColor: "transparent",
                    color: "#4caf50",
                    border: "1px solid #4caf50",
                    "& .MuiChip-deleteIcon": {
                      color: "#fff",
                    },
                  }}
                />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductFiltersNew;

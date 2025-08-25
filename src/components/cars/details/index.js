"use client";

import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import ProductDetailsCarousel from "src/sections/product/product-details-carousel";
import ProductDetailsDescription from "src/sections/product/product-details-description";
import ProductDetailsSummary from "src/sections/product/product-details-summary";
import { CarsService } from "src/services";

export default function CarsDetailPage() {
  const params = useSearchParams();
  const carId = params.get("carId");
  const settings = useSettingsContext();

  const [carDetails, setCarDetails] = useState({});
  const [currentTab, setCurrentTab] = useState("description");

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const fetchCarById = async () => {
    try {
      const res = await CarsService.getById(carId);
      if (res?.status === 200) {
        setCarDetails(res?.data);
      } else {
        setCarDetails({});
      }
    } catch (err) {
      console.log("error: ", err);
      setCarDetails({});
    }
  };

  useEffect(() => {
    if (carId) {
      fetchCarById();
    }
  }, [carId]);

  const features = useMemo(() => {
    if (Object.keys(carDetails)?.length) {
      return {
        ...(carDetails?.carDetails ? carDetails.carDetails : {}),
      };
    }
    return {};
  }, [JSON.stringify(carDetails)]);

  return (
    <>
      <Container
        sx={{ mt: 10 }}
        maxWidth={settings.themeStretch ? false : "lg"}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={5}
            order={{ xs: 1, md: 2 }}
            sx={{ mb: { xs: 2, md: 0 } }}>
            <ProductDetailsSummary disabledActions product={carDetails} />
          </Grid>
          <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
            <ProductDetailsCarousel product={carDetails} />
            <Features data={features} />
            <Overview data={carDetails} />
            <OtherDetails data={carDetails?.carDetails} />
            <AdditionalFeatures
              features={carDetails?.carDetails?.features || []}
            />
          </Grid>
        </Grid>

        {/* <Card sx={{ marginBottom: 2 }}> */}
        {/* <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 3,
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            {[
              {
                value: "description",
                label: "Description",
              },
            ].map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs> */}

        {/* {currentTab === "details" && (
            <ProductDescription description={carDetails?.carDetails} />
          )} */}

        {currentTab === "description" && (
          <Box
            sx={{
              background: "transparent",
              border: "1px solid #4caf50",
              borderRadius: "10px",
              padding: "18px",
              my: 5,
            }}>
            <Typography variant="h6" color="#fff">
              Description
            </Typography>
            <Typography variant="body2" mt={1}>
              <span
                style={{ color: "#fff" }}
                dangerouslySetInnerHTML={{ __html: carDetails?.description }}
              />
            </Typography>
          </Box>
        )}

        {/* {currentTab === 'reviews' && (
            <ProductDetailsReview
              ratings={product.ratings}
              reviews={product.reviews}
              totalRatings={product.totalRatings}
              totalReviews={product.totalReviews}
            />
          )} */}
        {/* </Card> */}
      </Container>
    </>
  );
}

const AdditionalFeatures = ({ features = [] }) => {
  if (!features?.length) {
    return null;
  }
  return (
    <>
      <Grid container spacing={2} my={1}>
        {features.map((f) => (
          <Grid key={f} item>
            <Chip
              xs={3}
              variant="filled"
              label={f}
              sx={{ color: "#fff", backgroundColor: "#4caf50" }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const Features = ({ data = {} }) => {
  if (!Object.keys(data).length) {
    return null;
  }
  const details = useMemo(() => {
    if (!Object.keys(data).length) {
      return [];
    } else {
      return [
        {
          icon: "carbon:meter",
          label: "Mileage",
          value: data?.mileage || "No information available",
        },
        {
          icon: "fluent:drive-train-20-regular",
          label: "Drive Train",
          value: data?.driveTrain || "No information available",
        },
        {
          icon: "ph:drop",
          label: "Colour",
          value: data?.colour || "No information available",
        },

        {
          icon: "solar:fuel-broken",
          label: "Fuel type",
          value: data?.fuelType || "No information available",
        },
        {
          icon: "solar:wheel-outline",
          label: data?.wheelType ? data?.wheelType + " wheels" : "",
        },
        {
          icon: "icon-park-outline:bluetooth",
          label: "Bluetooth",
        },
      ];
    }
  }, [JSON.stringify(data)]);

  const DataField = ({ label = "", value = "", icon = "" }) => {
    return (
      <>
        <Stack direction="row" gap={1} alignItems="center">
          <Box
            sx={{
              border: "1px solid #e7e7e7",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderRadius: "50%",
            }}>
            <Iconify style={{ width: "40px", height: "40px" }} icon={icon} />
          </Box>
          <Box>
            <Typography variant="body1" color="#fff">
              {label}
            </Typography>
            <Typography variant="caption" color="#fff">
              {value}
            </Typography>
          </Box>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Typography mt={5} variant="h6" color="#fff">
        Features
      </Typography>

      <Grid mt={2} container alignItems="center" spacing={2}>
        {details?.map((d) => (
          <Grid item xs={6} key={d?.label} sx={{ color: "#fff" }}>
            <DataField {...d} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const Overview = ({ data = {} }) => {
  const details = useMemo(() => {
    if (!Object.keys(data).length) {
      return [];
    } else {
      return [
        {
          label: "Make",
          value: data?.carDetails?.make || "No information available",
        },
        {
          label: "Mileage",
          value: data?.carDetails?.mileage
            ? data?.carDetails.mileage + " mi"
            : "No information available",
        },
        {
          label: "Model",
          value: data?.carDetails?.model || "No information available",
        },

        {
          label: "Year",
          value:
            data?.carDetails?.yearOfManufacture || "No information available",
        },
        {
          label: "Registration",
          value:
            data?.carDetails?.registrationNumber || "No information available",
        },
        {
          label: "Exterior colour",
          value: data?.carDetails?.colour || "No information available",
        },
        {
          label: "Variant",
          value: data?.carDetails?.variant || "No information available",
        },
      ];
    }
  }, [JSON.stringify(data)]);
  return (
    <>
      <Typography mt={5} variant="h6" color="#fff">
        Overview
      </Typography>

      <Grid container mt={1}>
        {details.map((d) => (
          <Grid item xs={6} key={d?.label} sx={{ color: "#fff" }}>
            <Typography variant="body2" color="#fff">
              {d?.label}: {d.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const ignoreKeys = [
  "make",
  "mileage",
  "model",
  "yearOfManufacture",
  "registrationNumber",
  "colour",
  "variant",
  "features",
  "fuelType",
  "driveTrain",
  "wheelType",
];

const OtherDetails = ({ data = {} }) => {
  const details = useMemo(() => {
    if (!Object.keys(data).length) {
      return [];
    } else {
      let values = [];
      for (const key in data) {
        if (!ignoreKeys.includes(key)) {
          // Convert key from camelCase to normal text, if needed
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            });
          let value;
          if (typeof data[key] === "boolean") {
            value = data[key]?.toString();
          } else {
            value = data[key];
          }
          values.push({ label: formattedKey, value });
        }
      }
      return values;
    }
  }, [JSON.stringify(data)]);

  return (
    <>
      <Typography mt={5} variant="h6" color="#fff">
        Other details
      </Typography>
      <Grid container mt={1}>
        {details.map((d) => (
          <Grid item xs={6} key={d?.label} sx={{ color: "#fff" }}>
            <Typography variant="body2" color="#fff">
              {d?.label}: {d.value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";

import {
  Box,
  Grid,
} from "@mui/material";
import { CarsService } from "src/services";
import { useQuery } from "@tanstack/react-query";
import GarageList from "./garage-list";
import { Button, Card, CardContent } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";

// Pagination settings
const ITEMS_PER_PAGE = 12;

// ----------------------------------------------------------------------

export default function GarageView() {
  const settings = useSettingsContext();

  // Pagination state
  const [page, setPage] = useState(1);
  const [displayedCars, setDisplayedCars] = useState([]);
  const loaderRef = useRef(null);

  // Fetch all cars with React Query
  const { data: allCars = [], isLoading: loading } = useQuery({
    queryKey: ["cars", "all"],
    queryFn: async () => {
      const res = await CarsService.getAll();
      if (res?.data) {
        return res?.data?.filter((c) => c?.status !== "Paused" && c?.category?.toLowerCase() === "sale") || [];
      }
      return [];
    },
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Update displayed cars when data changes or page changes
  useEffect(() => {
    if (allCars.length > 0) {
      const startIndex = 0;
      const endIndex = page * ITEMS_PER_PAGE;
      setDisplayedCars(allCars.slice(startIndex, endIndex));
    }
  }, [allCars, page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && displayedCars.length < allCars.length) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, displayedCars.length, allCars.length]);

  const hasMore = displayedCars.length < allCars.length;

  return (
    <Box sx={{ mt: "85px" }}>
      <Container
        maxWidth={settings.themeStretch ? false : "xl"}
        sx={{
          mb: 15,
        }}>
        <Grid container spacing={2}>
          {/* Title and Header */}
          <Grid item xs={12}>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mt: "32px",
              }}>
              <Typography
                variant="h4"
                sx={{
                  my: { xs: 3, md: 5 },
                  color: "#fff",
                }}>
                Vehicles
              </Typography>

              <Box
                sx={{ width: "85%", display: { md: "block", xs: "none" } }}>
                <Card
                  sx={{
                    background: "#25D366",
                    borderRadius: 3,
                    mb: 4,
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    },
                  }}>
                  <CardContent
                    sx={{
                      p: { xs: 4, md: "32px" },
                      textAlign: "center",
                      position: "relative",
                      zIndex: 2,
                    }}>
                    <Stack direction="row" gap={2} alignItems="center">
                      <Box>
                        <img width={560} style={{ objectFit: "contain" }} src="/assets/bugati.png" alt="Comic" />
                      </Box>

                      <Box>
                        <Typography
                          variant="h2"
                          sx={{
                            color: "#000",
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: "2rem", md: "34px !important" },
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                          }}>
                          Import Your Dream Car
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: "#ffffff",
                            fontSize: "16px !important",
                            mb: 4,
                            fontWeight: 400,
                            opacity: 0.9,
                            maxWidth: 800,
                            mx: "auto",
                            lineHeight: 1.2,
                            textAlign: "center",
                          }}>
                          From luxury brands to your everyday ride, we make
                          importing your dream car a reality. Expert guidance,
                          competitive pricing, and seamless process.
                        </Typography>
                      </Box>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        justifyContent="center"
                        alignItems="center">
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<WhatsApp sx={{ fontSize: 28 }} />}
                          onClick={() => {
                            const message =
                              "Hi! I'm interested in importing car parts. Can you help me find the parts I need?";
                            const whatsappUrl = `https://wa.me/923263333456?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, "_blank");
                          }}
                          sx={{
                            backgroundColor: "transparent",
                            border: "1px solid #fff",
                            color: "#000",
                            px: 4,
                            py: 2,
                            fontSize: "16px !important",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            borderRadius: "50px",
                            minWidth: 250,
                            whiteSpace: "nowrap",
                          }}>
                          Book an appointment
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Grid>

          {/* Empty state */}
          <Grid item xs={12}>
            {!displayedCars?.length && !loading && (
              <EmptyContent
                filled
                title="No Data"
                sx={{ py: 10, color: "#fff" }}
              />
            )}
          </Grid>

          {/* Vehicle List */}
          <Grid item xs={12}>
            <GarageList 
              products={displayedCars} 
              loading={loading}
              loaderRef={loaderRef}
              hasMore={hasMore}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

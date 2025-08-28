"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

// --- Updated integration: use products.service.js directly ---
import ProductService from "src/services/products/products.service";
import { PRODUCT_STOCK_OPTIONS } from "src/_mock";
import { extractErrorMessage, handleApiError } from "src/utils/apiErrorHandler";
import { buildPaginationParams, extractPagination } from "src/utils/pagination";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import EmptyContent from "src/components/empty-content";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import ProductTableToolbar from "../product-table-toolbar";
import ProductTableFiltersResult from "../product-table-filters-result";
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
} from "../product-table-row";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const defaultFilters = {
  publish: [],
  stock: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ["category", "actions"];

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  // Safety check for settings context
  if (!settings) {
    return (
      <Container maxWidth="lg">
        <div>Loading settings...</div>
      </Container>
    );
  }

  // --- Updated state management with pagination and filters ---
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    stockStatus: "",
    sort: "-createdAt",
  });
  const [error, setError] = useState(null);

  // If there's a critical error, show error state
  if (error) {
    return (
      <Container maxWidth="lg">
        <Card sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error Loading Products
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error.message || "An unexpected error occurred"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setError(null);
              fetchProducts();
            }}>
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  // Fetch products with filters and pagination
  const fetchProducts = useCallback(
    async (newFilters = filters) => {
      try {
        setProductsLoading(true);

        // Build pagination parameters
        const params = buildPaginationParams({
          page: newFilters.page,
          limit: newFilters.limit,
        });

        // Add filter parameters
        if (newFilters.search) params.search = newFilters.search;
        if (newFilters.category) params.category = newFilters.category;
        if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
        if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
        if (newFilters.type) params.type = newFilters.type;
        if (newFilters.stockStatus) params.stockStatus = newFilters.stockStatus;
        if (newFilters.sort) params.sort = newFilters.sort;
        if (newFilters.salePrice) params.salePrice = newFilters.salePrice;

        const response = await ProductService.getAll(params);

        console.log("API Response:", response);
        console.log("Response products:", response?.products);
        console.log("Response data:", response?.data);

        // Handle response format according to API docs
        if (response && response.products) {
          console.log("Setting products from response.products");
          setProducts(response.products);
          // Extract pagination with fallback values
          const extractedPagination = extractPagination(response);
          console.log("Extracted pagination:", extractedPagination);
          setPagination({
            page: extractedPagination.page || 1,
            limit: extractedPagination.limit || 10,
            total: extractedPagination.total || 0,
            pages: extractedPagination.pages || 0,
          });
        } else if (response && response.data) {
          console.log("Setting products from response.data");
          setProducts(response.data);
          setPagination({
            page: 1,
            limit: 10,
            total: response.data.length || 0,
            pages: 1,
          });
        } else {
          console.log("No products found in response, setting empty array");
          setProducts([]);
          setPagination({
            page: 1,
            limit: 10,
            total: 0,
            pages: 0,
          });
        }
      } catch (error) {
        const formattedError = handleApiError(error, {
          onUnauthorized: () => {
            enqueueSnackbar("Please login to view products", {
              variant: "error",
            });
          },
          onForbidden: () => {
            enqueueSnackbar("You don't have permission to view products", {
              variant: "error",
            });
          },
          onNotFound: () => {
            enqueueSnackbar("Products not found", { variant: "error" });
          },
          onServerError: () => {
            enqueueSnackbar("Server error occurred", { variant: "error" });
          },
        });

        // Set error state for critical errors
        if (error.response?.status >= 500) {
          setError(
            new Error(formattedError.message || "Server error occurred")
          );
        } else {
          enqueueSnackbar(formattedError.message, { variant: "error" });
        }

        setProducts([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        });
      } finally {
        setProductsLoading(false);
      }
    },
    [filters, enqueueSnackbar]
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter changes
  const handleFilters = useCallback(
    (name, value) => {
      const newFilters = { ...filters, [name]: value, page: 1 }; // Reset to first page
      setFilters(newFilters);
      fetchProducts(newFilters);
    },
    [filters, fetchProducts]
  );

  // Handle pagination changes
  const handlePageChange = useCallback(
    (newPage) => {
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
      fetchProducts(newFilters);
    },
    [filters, fetchProducts]
  );

  // Handle limit changes
  const handleLimitChange = useCallback(
    (newLimit) => {
      const newFilters = { ...filters, limit: newLimit, page: 1 };
      setFilters(newFilters);
      fetchProducts(newFilters);
    },
    [filters, fetchProducts]
  );

  // Handle search
  const handleSearch = useCallback(
    (searchTerm) => {
      const newFilters = { ...filters, search: searchTerm, page: 1 };
      setFilters(newFilters);
      fetchProducts(newFilters);
    },
    [filters, fetchProducts]
  );

  // Handle sort
  const handleSort = useCallback(
    (sortField) => {
      const newFilters = { ...filters, sort: sortField, page: 1 };
      setFilters(newFilters);
      fetchProducts(newFilters);
    },
    [filters, fetchProducts]
  );

  // Handle delete
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await ProductService.delete(id);
        enqueueSnackbar("Product deleted successfully");
        fetchProducts(); // Refresh the list
      } catch (error) {
        const formattedError = handleApiError(error, {
          onUnauthorized: () => {
            enqueueSnackbar("Please login to delete products", {
              variant: "error",
            });
          },
          onForbidden: () => {
            enqueueSnackbar("You don't have permission to delete products", {
              variant: "error",
            });
          },
          onNotFound: () => {
            enqueueSnackbar("Product not found", { variant: "error" });
          },
          onServerError: () => {
            enqueueSnackbar("Server error occurred", { variant: "error" });
          },
        });

        enqueueSnackbar(formattedError.message, { variant: "error" });
      }
    },
    [fetchProducts, enqueueSnackbar]
  );

  // Handle edit
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  // Handle view
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  // Handle create new
  const handleCreateNew = useCallback(() => {
    router.push(paths.dashboard.product.new);
  }, [router]);

  // Data for DataGrid
  const dataGridRows = (products || []).map((product) => ({
    id: product?.id || product?._id || `temp-${Math.random()}`,
    name: product?.name || "Unnamed Product",
    description: product?.description || "",
    price: product?.price || 0,
    regularPrice: product?.regularPrice || 0,
    salePrice: product?.salePrice || 0,
    images: product?.images || [],
    categories: product?.categories || [],
    stockStatus: product?.stockStatus > 0 ? "instock" : "out of stock",
    type: product?.type || "simple",
    slug: product?.slug || "",
    createdAt: product?.createdAt || new Date().toISOString(),
    updatedAt: product?.updatedAt || new Date().toISOString(),
    status: product?.status || "draft",
    stockQuantity: product?.stockQuantity || product?.stockQuantity || 0,
  }));

  // Loading state
  if (productsLoading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Stack
          spacing={2.5}
          direction={{
            xs: "column",
            md: "row",
          }}
          alignItems={{
            xs: "flex-end",
            md: "center",
          }}
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">Products</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Loading...
            </Typography>
          </Stack>
        </Stack>

        <Card sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
            Loading products...
          </Typography>
        </Card>
      </Container>
    );
  }

  const dataGridColumns = [
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <RenderCellProduct
          name={params.row?.name || "Unnamed Product"}
          images={params.row?.images || []}
          categories={params.row?.categories || []}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 180,
      renderCell: (params) => (
        <RenderCellPrice
          price={params.row?.price || 0}
          regularPrice={params.row?.regularPrice || 0}
          salePrice={params.row?.salePrice || 0}
        />
      ),
    },
    {
      field: "stockStatus",
      headerName: "Stock",
      width: 140,
      renderCell: (params) => (
        <RenderCellStock
          stockStatus={params.row?.stockStatus || "instock"}
          stockQuantity={params.row?.stockQuantity || 0}
        />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <RenderCellPublish status={params.row?.status || "draft"} />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 180,
      renderCell: (params) => (
        <RenderCellCreatedAt
          value={params.row?.createdAt || new Date().toISOString()}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => {
            const productId = params.row.id || params.row._id;
            if (productId) {
              router.push(paths.dashboard.product.edit(productId));
            } else {
              enqueueSnackbar("Invalid product ID", { variant: "error" });
            }
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: "error.main" }}
        />,
      ],
    },
  ];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Stack
          spacing={2.5}
          direction={{
            xs: "column",
            md: "row",
          }}
          alignItems={{
            xs: "flex-end",
            md: "center",
          }}
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">Products</Typography>
            {pagination.total > 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ({pagination.total} products)
              </Typography>
            )}
            {pagination.total === 0 && !productsLoading && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                (No products found)
              </Typography>
            )}
          </Stack>

          <Button
            component={RouterLink}
            href={paths.dashboard.product.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateNew}>
            New Product
          </Button>
        </Stack>

        <Card>
          {products.length === 0 && !productsLoading ? (
            <EmptyContent
              title="No products found"
              description="There are no products to display. Try adjusting your filters or create a new product."
              sx={{ py: 10 }}
            />
          ) : (
            <>
              <DataGrid
                rows={dataGridRows || []}
                columns={dataGridColumns}
                pagination
                paginationModel={{
                  page: (pagination.page || 1) - 1, // Convert 1-based to 0-based for DataGrid
                  pageSize: pagination.limit || 10,
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                rowCount={pagination.total || 0}
                paginationMode="server"
                onPaginationModelChange={(model) => {
                  try {
                    // Convert 0-based back to 1-based for API
                    const newPage = model.page + 1;
                    const newLimit = model.pageSize;

                    // Only update if values actually changed
                    if (
                      newPage !== filters.page ||
                      newLimit !== filters.limit
                    ) {
                      if (newPage !== filters.page) {
                        handlePageChange(newPage);
                      }
                      if (newLimit !== filters.limit) {
                        handleLimitChange(newLimit);
                      }
                    }
                  } catch (error) {
                    console.error("Error handling pagination change:", error);
                    enqueueSnackbar("Error updating pagination", {
                      variant: "error",
                    });
                  }
                }}
                loading={productsLoading}
                disableRowSelectionOnClick
                getRowId={(row) => row.id || `temp-${Math.random()}`}
                slots={{
                  toolbar: () => (
                    <GridToolbarContainer>
                      <GridToolbarQuickFilter />
                      <GridToolbarFilterButton />
                      <GridToolbarColumnsButton />
                      <GridToolbarExport />
                    </GridToolbarContainer>
                  ),
                  noRowsOverlay: () => (
                    <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                      <Typography variant="h6">No products found</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters or create a new product
                      </Typography>
                    </Stack>
                  ),
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {
                      placeholder: "Search products...",
                      onChange: (event) => {
                        try {
                          handleSearch(event.target.value);
                        } catch (error) {
                          console.error("Error handling search:", error);
                          enqueueSnackbar("Error performing search", {
                            variant: "error",
                          });
                        }
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "none",
                    backgroundColor: "background.neutral",
                  },
                  minHeight: 400, // Ensure minimum height for better UX
                }}
              />
            </>
          )}
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={confirmRows.onFalse}>
            Delete
          </Button>
        }
      />
    </>
  );
}

"use client";

import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { useAuthContext } from "src/auth/hooks";

import { useBoolean } from "src/hooks/use-boolean";
import { useGetMyOrders, useUpdateOrderStatus } from "src/hooks/use-orders";

import { isAfter, isBetween } from "src/utils/format-time";
import { transformApiOrdersToComponent } from "src/utils/order-transformer";

import { ORDER_STATUS_OPTIONS } from "src/_mock";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";

import MyOrderTableRow from "../my-order-table-row";
import OrderTableToolbar from "../order-table-toolbar";
import OrderTableFiltersResult from "../order-table-filters-result";
import OrderCancelDialog from "../order-cancel-dialog";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  { id: "id", label: "", width: 116 },
  { id: "orderNumber", label: "Order", width: 116 },
  { id: "createdAt", label: "Date", width: 140 },
  { id: "totalQuantity", label: "Items", width: 120, align: "center" },
  { id: "totalAmount", label: "Price", width: 140 },
  { id: "status", label: "Status", width: 110 },
  { id: "action", label: "Action", width: 110 },
];

const defaultFilters = {
  name: "",
  status: "all",
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function MyOrdersView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: "orderNumber" });

  const settings = useSettingsContext();

  const router = useRouter();
  
  const { user } = useAuthContext();

  const confirm = useBoolean();
  
  // State for cancel order dialog
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  // Order status update mutation
  const { mutate: updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const [filters, setFilters] = useState(defaultFilters);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch user's orders from API with pagination
  const { data: apiOrders, isLoading, error, refetch } = useGetMyOrders({
    page,
    limit,
    status: filters.status !== "all" ? filters.status : undefined,
  });

  // Transform API data to component format
  const tableData = transformApiOrdersToComponent(apiOrders?.orders || []);

  // Get pagination info
  const pagination = apiOrders?.pagination || { total: 0, page: 1, pages: 1 };

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  // For server-side pagination, use all filtered data
  const dataInPage = dataFiltered;

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name ||
    filters.status !== "all" ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setPage(1); // Reset to first page when filters change
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setPage(1); // Reset to first page when filters are reset
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );
  
  // Handle opening cancel dialog
  const handleCancelOrder = useCallback((order) => {
    setOrderToCancel(order);
    setIsCancelDialogOpen(true);
  }, []);
  
  // Handle actual cancellation
  const handleSubmitCancellation = useCallback((reason) => {
    if (!orderToCancel || !orderToCancel.id) {
      enqueueSnackbar('Error: Order information is missing', { variant: 'error' });
      return;
    }
    
    updateOrderStatus(
      {
        id: orderToCancel.id,
        data: {
          status: 'cancelled',
          note: reason,
          userId: user?.id || user?.user?.id,
        },
        sendEmail: true,
      },
      {
        onSuccess: () => {
          enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
          setIsCancelDialogOpen(false);
          setOrderToCancel(null);
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        },
      }
    );
  }, [orderToCancel, updateOrderStatus, user, enqueueSnackbar, refetch]);

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Card sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
        </Card>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Failed to load your orders:</strong> {error.message}
          {error.response?.status && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              Status: {error.response.status} {error.response.statusText}
            </Box>
          )}
          {error.response?.data?.message && (
            <Box component="div" sx={{ mt: 1, fontSize: "0.875rem" }}>
              Server: {error.response.data.message}
            </Box>
          )}
        </Alert>
        <Button onClick={() => refetch()} variant="contained" sx={{ mr: 2 }}>
          Retry
        </Button>
        <Button
          onClick={() => (window.location.href = "/login")}
          variant="outlined">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="My Orders"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "My Orders",
          },
        ]}
        action={
          <Button
            component="a"
            href={paths.product.root}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}>
            Shop Now
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />

      <Card>
        <Tabs
          value={filters.status}
          onChange={(event, newValue) => {
            handleFilters("status", newValue);
          }}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}>
          {STATUS_OPTIONS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <OrderTableToolbar
          filters={filters}
          onFilters={handleFilters}
          statusOptions={ORDER_STATUS_OPTIONS}
        />

        {canReset && (
          <OrderTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataInPage.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataInPage.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="View Details">
                <IconButton color="primary">
                  <Iconify icon="solar:eye-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <MyOrderTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onViewRow={() => handleViewRow(row.id)}
                    onCancelOrder={handleCancelOrder}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    dataFiltered.length
                  )}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={pagination.total}
          page={page - 1} // Convert to 0-based index for MUI
          rowsPerPage={limit}
          onPageChange={(event, newPage) => {
            setPage(newPage + 1); // Convert from 0-based to 1-based
          }}
          onRowsPerPageChange={(event) => {
            setLimit(parseInt(event.target.value, 10));
            setPage(1); // Reset to first page when changing rows per page
          }}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      
      {/* Cancel Order Dialog */}
      <OrderCancelDialog
        open={isCancelDialogOpen}
        onClose={() => {
          setIsCancelDialogOpen(false);
          setOrderToCancel(null);
        }}
        onSubmit={handleSubmitCancellation}
        loading={isUpdating}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, startDate, endDate } = filters;

  let filtered = inputData;

  if (name) {
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        (order.customer?.name && order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1)
    );
  }

  if (status !== "all") {
    filtered = filtered.filter((order) => order.status === status);
  }

  if (dateError) {
    filtered = [];
  } else {
    if (startDate && endDate) {
      filtered = filtered.filter(
        (order) =>
          isBetween(order.createdAt, startDate, endDate) ||
          order.createdAt.getTime() === startDate.getTime() ||
          order.createdAt.getTime() === endDate.getTime()
      );
    }
  }

  return filtered.sort(comparator);
}

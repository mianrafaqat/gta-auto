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

import { useBoolean } from "src/hooks/use-boolean";
import { useGetAllOrders, useDeleteOrder } from "src/hooks/use-orders";

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

import OrderTableRow from "../order-table-row";
import OrderTableToolbar from "../order-table-toolbar";
import OrderTableFiltersResult from "../order-table-filters-result";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  { id: "id", label: "", width: 116 },
  { id: "orderNumber", label: "Order", width: 116 },
  { id: "name", label: "Customer" },
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

export default function OrderListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: "orderNumber" });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Delete mutation
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  // Fetch orders from API with pagination
  const { data: apiOrders, isLoading, error, refetch } = useGetAllOrders({
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

  const handleDeleteRow = useCallback(
    (id) => {
      deleteOrder(id, {
        onSuccess: () => {
          enqueueSnackbar("Order deleted successfully!", { variant: "success" });
          refetch();
          table.onUpdatePageDeleteRow(dataInPage.length);
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || error.message || "Failed to delete order";
          enqueueSnackbar(errorMessage, { variant: "error" });
        },
      });
    },
    [dataInPage.length, enqueueSnackbar, table, refetch, deleteOrder]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleDeleteRows = useCallback(() => {
    const deletePromises = table.selected.map((id) =>
      new Promise((resolve, reject) => {
        deleteOrder(id, {
          onSuccess: resolve,
          onError: reject,
        });
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        enqueueSnackbar(`${table.selected.length} order(s) deleted successfully!`, { variant: "success" });
        refetch();
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        confirm.onFalse();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete some orders";
        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  }, [table, deleteOrder, enqueueSnackbar, refetch, dataInPage.length, dataFiltered.length, confirm]);

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

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Order List"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Order",
          },
        ]}
        action={
          <Button
            component="a"
            href={paths.dashboard.order.root}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}>
            New Order
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
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
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
                  <OrderTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onViewRow={() => handleViewRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure you want to delete{" "}
            <strong>{table.selected.length}</strong> order(s)?
          </>
        }
        action={
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteRows}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        }
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
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
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

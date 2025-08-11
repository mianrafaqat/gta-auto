import PropTypes from "prop-types";
import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";

import {
  useGetShippingMethods,
  useDeleteShippingMethod,
} from "src/hooks/use-shipping";
import ShippingMethodTableRow from "./shipping-method-table-row";
import ShippingMethodTableToolbar from "./shipping-method-table-toolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Method Name", align: "left" },
  { id: "price", label: "Price", align: "left" },
  { id: "estimatedDelivery", label: "Delivery Time", align: "left" },
  { id: "countries", label: "Countries", align: "left" },
  { id: "isActive", label: "Status", align: "center" },
  { id: "", label: "Actions", align: "right" },
];

// ----------------------------------------------------------------------

export default function ShippingMethodsList() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const { data: methods = [], isLoading, refetch } = useGetShippingMethods();
  const deleteMethod = useDeleteShippingMethod();

  const dataFiltered = applyFilter({
    inputData: methods,
    comparator: getComparator(table.order, table.orderBy),
    filterName: table.filterName,
  });

  const handleEditRow = (id) => {
    router.push(paths.dashboard.shipping.methods.edit(id));
  };

  const handleDeleteRow = async (id) => {
    try {
      await deleteMethod.mutateAsync(id);
      enqueueSnackbar("Shipping method deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting shipping method:", error);
      enqueueSnackbar(error.message || "Error deleting shipping method", {
        variant: "error",
      });
    }
  };

  const handleCreateMethod = () => {
    router.push(paths.dashboard.shipping.methods.new);
  };

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  const notFound = !dataFiltered.length && !!table.filterName;

  return (
    <Container maxWidth="lg">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}>
        <Typography variant="h4">Shipping Methods</Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleCreateMethod}>
          New Method
        </Button>
      </Stack>

      <Card>
        <ShippingMethodTableToolbar
          filterName={table.filterName}
          onFilterName={table.onFilterName}
        />

        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <ShippingMethodTableRow
                    key={row._id}
                    row={row}
                    onEditRow={() => handleEditRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={72}
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
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (method) =>
        method.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

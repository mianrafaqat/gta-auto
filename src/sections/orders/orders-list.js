import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";

import orderService from "src/services/orders/orders.service";
import OrderTableRow from "./order-table-row";
import OrderTableToolbar from "./order-table-toolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "orderId", label: "Order ID", align: "left" },
  { id: "customer", label: "Customer", align: "left" },
  { id: "items", label: "Items", align: "left" },
  { id: "total", label: "Total", align: "right" },
  { id: "paymentMethod", label: "Payment", align: "left" },
  { id: "status", label: "Status", align: "center" },
  { id: "", label: "Actions", align: "right" },
];

// ----------------------------------------------------------------------

export default function OrdersList() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();

  // --- Replace useGetAllOrders with direct service call ---
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setOrdersLoading(true);
    setOrdersError(null);
    orderService
      .getAll()
      .then((data) => {
        if (!ignore) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      })
      .catch((err) => {
        if (!ignore) setOrdersError(err);
      })
      .finally(() => {
        if (!ignore) setOrdersLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    filterName: table.filterName,
  });

  const handleViewRow = (id) => {
    router.push(paths.dashboard.order.details(id));
  };

  if (ordersLoading) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (ordersError) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {ordersError.message || "Failed to load orders"}
        </Alert>
      </Container>
    );
  }

  // Show "No orders found" if there are no orders at all (regardless of filter)
  const noOrders = orders.length === 0;

  // Show "No results found" if there are orders but filter yields nothing
  const notFound =
    !dataFiltered.length && !!table.filterName && orders.length > 0;

  return (
    <Container maxWidth="lg">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}>
        <Typography variant="h4">Orders</Typography>
      </Stack>

      <Card>
        <OrderTableToolbar
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
                {dataFiltered.length > 0 &&
                  dataFiltered.map((row) => (
                    <OrderTableRow
                      key={row._id}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
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

                {/* Show "No orders found" if there are no orders at all */}
                {noOrders && (
                  <TableNoData notFound={true} message="No orders found" />
                )}

                {/* Show "No results found" if filter yields nothing but there are orders */}
                {!noOrders && notFound && <TableNoData notFound={true} />}
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

function applyFilter({ inputData = [], comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (order) =>
        order.shippingAddress?.firstName
          ?.toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1 ||
        order.shippingAddress?.lastName
          ?.toLowerCase()
          .indexOf(filterName.toLowerCase()) !== -1 ||
        order._id?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import { useTable } from "src/components/table";
import TableHeadCustom from "src/components/table/table-head-custom";
import { TablePaginationCustom } from "src/components/table";
import { TableNoData } from "src/components/table";
import { TableEmptyRows } from "src/components/table";
import Iconify from "src/components/iconify";

import CouponService from "src/services/coupons/coupons.service";
import CouponsTableRow from "./coupons-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "code", label: "Code" },
  { id: "description", label: "Description" },
  { id: "discountType", label: "Type" },
  { id: "discountValue", label: "Value" },
  { id: "allowedUsers", label: "Users" },
  { id: "createdAt", label: "Created" },
  { id: "expiresAt", label: "Expires" },
  { id: "" },
];

// ----------------------------------------------------------------------

function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export default function CouponsListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all coupons
  const getAllCoupons = async () => {
    setLoading(true);
    try {
      const response = await CouponService.getAll();
      // Expecting response.data to be { coupons: [...], pagination: {...} }
      if (
        response &&
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data.coupons)
      ) {
        setTableData(response.data.coupons);
      } else {
        setTableData([]);
        enqueueSnackbar("No coupon data found or unexpected response format.", {
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch coupons",
        { variant: "error" }
      );
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteRow = async (id) => {
    setLoading(true);
    try {
      const response = await CouponService.delete(id);
      if (response?.status === 200) {
        enqueueSnackbar("Coupon deleted successfully");
        getAllCoupons(); // Refresh the list
      } else {
        enqueueSnackbar(response?.data?.message || "Failed to delete coupon", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete coupon",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit handler: navigate to edit page
  const handleEditRow = (id) => {
    router.push(`${paths.dashboard.admin.coupons.edit}/${id}`);
  };

  const notFound = !loading && !tableData.length;

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  return (
    <Container maxWidth={false}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}>
        <Typography variant="h4">All Coupons</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.admin.coupons.add)}
          disabled={loading}>
          Add Coupon
        </Button>
      </Stack>

      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={table.onSort}
              />

              <TableBody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={TABLE_HEAD.length}
                      style={{ textAlign: "center", height: 120 }}>
                      <Typography variant="body1">Loading...</Typography>
                    </td>
                  </tr>
                ) : (
                  dataInPage.map((row) => (
                    <CouponsTableRow
                      key={row._id}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ))
                )}

                {!loading && (
                  <>
                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        tableData.length
                      )}
                    />

                    <TableNoData notFound={notFound} />
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={tableData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

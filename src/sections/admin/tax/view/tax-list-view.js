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

import TaxService from "src/services/tax/tax.service";
import TaxTableRow from "./tax-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "createdAt", label: "Created" },
  { id: "" },
];

// ----------------------------------------------------------------------

function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export default function TaxListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all taxes
  const getAllTaxes = async () => {
    setLoading(true);
    try {
      // Make sure the API call is actually being made
      const response = await TaxService.getAll();
      // Check the response and log for debugging
      // console.log("TaxService.getAll response:", response);
      if (response && response.status === 200 && Array.isArray(response.data)) {
        setTableData(response.data);
      } else {
        setTableData([]);
        enqueueSnackbar("No tax data found or unexpected response format.", {
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error fetching taxes:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch taxes",
        { variant: "error" }
      );
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTaxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteRow = async (id) => {
    setLoading(true);
    try {
      const response = await TaxService.delete(id);
      if (response?.status === 200) {
        enqueueSnackbar("Tax deleted successfully");
        getAllTaxes(); // Refresh the list
      } else {
        enqueueSnackbar(response?.data?.message || "Failed to delete tax", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete tax",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit handler: navigate to edit page
  const handleEditRow = (id) => {
    router.push(`${paths.dashboard.admin.tax.edit}/${id}`);
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
        <Typography variant="h4">All Taxes</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.admin.tax.add)}
          disabled={loading}>
          Add Tax
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
                    <TaxTableRow
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

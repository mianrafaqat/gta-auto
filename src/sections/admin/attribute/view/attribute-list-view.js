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

import AttributeService from "src/services/attribute/attribute.service";
import AttributeTableRow from "./attribute-table-row";

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

export default function AttributeListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all attributes
  const getAllAttributes = async () => {
    try {
      const response = await AttributeService.getAll();
      if (response?.status === 200) {
        setTableData(response.data);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch attributes",
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    getAllAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteRow = async (id) => {
    try {
      const response = await AttributeService.delete(id);
      if (response?.status === 200) {
        enqueueSnackbar("Attribute deleted successfully");
        getAllAttributes(); // Refresh the list
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete attribute",
        { variant: "error" }
      );
    }
  };

  // Placeholder for edit handler
  const handleEditRow = (id) => {
    // Implement edit logic or navigation here
    // For example: router.push(`/dashboard/admin/attribute/edit/${id}`);
  };

  const notFound = !tableData.length;

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
        <Typography variant="h4">All Attributes</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.admin.attribute.add)}>
          Add Attribute
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
                {dataInPage.map((row) => (
                  <AttributeTableRow
                    key={row._id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    onEditRow={() => handleEditRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    tableData.length
                  )}
                />

                <TableNoData notFound={notFound} />
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

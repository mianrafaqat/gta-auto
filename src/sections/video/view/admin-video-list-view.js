"use client";

import { useState, useCallback, useEffect } from "react";

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

import VideoTableRow from "../video-table-row";
import { VideoService } from "src/services";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Title" },
  { id: "url", label: "Video URL" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created" },
  { id: "" },
];

// ----------------------------------------------------------------------

export default function AdminVideoListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const getAllVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await VideoService.getAllVideos();
      if (response?.status === 200) {
        setTableData(response.data);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to fetch videos",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDeleteRow = async (id) => {
    try {
      const response = await VideoService.deleteVideo(id);
      if (response?.status === 200) {
        enqueueSnackbar("Video deleted successfully");
        getAllVideos(); // Refresh the list
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to delete video",
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    getAllVideos();
  }, [getAllVideos]);

  const notFound = !tableData.length;

  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  return (
    <Container maxWidth={false}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}>
        <Typography variant="h4">All Videos</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.admin.video.add)}>
          Add Video
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
                  <VideoTableRow
                    key={row._id}
                    row={row}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={table.dense ? 52 : 72}
                  emptyRows={table.emptyRows(tableData.length)}
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

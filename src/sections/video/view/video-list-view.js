"use client";

import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { useTable } from "src/components/table";
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from "src/components/table";
import { useSnackbar } from "src/components/snackbar";
import Scrollbar from "src/components/scrollbar";
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

function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export default function VideoListView() {
  const router = useRouter();
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMyVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await VideoService.getAll();
      if (response?.status === 200) {
        setTableData(response.data || []);
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
      const response = await VideoService.delete({
        videoID: id,
      });
      if (response?.status === 200) {
        enqueueSnackbar("Video deleted successfully");
        getMyVideos(); // Refresh the list
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
    getMyVideos();
  }, [getMyVideos]);

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
        <Typography variant="h4">My Videos</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.video.my.add)}>
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

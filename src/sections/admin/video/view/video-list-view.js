'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import TableHeadCustom from 'src/components/table/table-head-custom';
import { TablePaginationCustom } from 'src/components/table';
import { TableNoData } from 'src/components/table';
import { TableEmptyRows } from 'src/components/table';
import Iconify from 'src/components/iconify';

import VideoTableRow from 'src/sections/video/video-table-row';
import { VideoService } from 'src/services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'url', label: 'Video URL' },
  { id: 'type', label: 'Type' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created' },
  { id: '' },
];

// ----------------------------------------------------------------------

function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export default function VideoListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Query for fetching all videos
  const { data: allVideos = [], isLoading: loading } = useQuery({
    queryKey: ['videos', 'all'],
    queryFn: async () => {
      const response = await VideoService.getAllVideos();
      if (response?.status === 200) {
        return response.data;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
  });

  // Mutation for deleting a video
  const deleteMutation = useMutation({
    mutationFn: (id) => VideoService.deleteVideo(id),
    onSuccess: () => {
      enqueueSnackbar('Video deleted successfully', { variant: 'success' });
      queryClient.invalidateQueries(['videos', 'all']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to delete video', { variant: 'error' });
    },
  });

  // Mutation for updating video
  const updateMutation = useMutation({
    mutationFn: (data) => VideoService.updateVideo(data),
    onSuccess: () => {
      enqueueSnackbar('Video updated successfully', { variant: 'success' });
      queryClient.invalidateQueries(['videos', 'all']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to update video', { variant: 'error' });
    },
  });

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.admin.video.edit(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  useEffect(() => {
    if (allVideos?.length) {
      setTableData(allVideos);
    }
  }, [allVideos]);

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
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">All Videos </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => router.push(paths.dashboard.admin.video.add)}
        >
          Add Video
        </Button>
      </Stack>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    onEditRow={() => handleEditRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
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
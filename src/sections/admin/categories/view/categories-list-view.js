"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

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
import { extractErrorMessage, handleApiError } from "src/utils/apiErrorHandler";
import { buildPaginationParams, extractPagination } from "src/utils/pagination";

import { CategoryService } from "src/services";
import CategoriesTableRow from "./categories-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name" },
  { id: "description", label: "Description" },
  { id: "parent", label: "Parent Category" },
  { id: "createdAt", label: "Created" },
  { id: "" },
];

// ----------------------------------------------------------------------

function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export default function CategoryListView() {
  const table = useTable();
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState(0); // 0: List, 1: Tree
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all categories with pagination
  const getAllCategories = useCallback(
    async (page = 1, limit = 10) => {
      try {
        setLoading(true);
        setError(null);

        const params = buildPaginationParams({ page, limit });
        const response = await CategoryService.getAll(params);

        if (response?.status === 200) {
          setTableData(response.data || []);
          setPagination(extractPagination(response));
        } else {
          setTableData([]);
          setPagination({});
        }
      } catch (error) {
        const formattedError = handleApiError(error, {
          onUnauthorized: () => {
            enqueueSnackbar("Please login to view categories", {
              variant: "error",
            });
          },
          onForbidden: () => {
            enqueueSnackbar("You don't have permission to view categories", {
              variant: "error",
            });
          },
          onNotFound: () => {
            enqueueSnackbar("Categories not found", { variant: "error" });
          },
          onServerError: () => {
            enqueueSnackbar("Server error occurred", { variant: "error" });
          },
        });

        setError(formattedError);
        setTableData([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  // Fetch category tree
  const getCategoryTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CategoryService.getTree();

      if (response?.status === 200) {
        setTreeData(response.data || []);
      } else {
        setTreeData([]);
      }
    } catch (error) {
      const formattedError = handleApiError(error, {
        onUnauthorized: () => {
          enqueueSnackbar("Please login to view category tree", {
            variant: "error",
          });
        },
        onForbidden: () => {
          enqueueSnackbar("You don't have permission to view category tree", {
            variant: "error",
          });
        },
        onNotFound: () => {
          enqueueSnackbar("Category tree not found", { variant: "error" });
        },
        onServerError: () => {
          enqueueSnackbar("Server error occurred", { variant: "error" });
        },
      });

      setError(formattedError);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Initial fetch
  useEffect(() => {
    if (viewMode === 0) {
      getAllCategories();
    } else {
      getCategoryTree();
    }
  }, [viewMode, getAllCategories, getCategoryTree]);

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  // Handle pagination changes
  const handlePageChange = useCallback(
    (newPage) => {
      getAllCategories(newPage + 1, pagination.limit || 10);
    },
    [getAllCategories, pagination.limit]
  );

  // Handle limit changes
  const handleLimitChange = useCallback(
    (newLimit) => {
      getAllCategories(1, newLimit);
    },
    [getAllCategories]
  );

  // Handle delete
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await CategoryService.delete(id);
        if (response?.status === 200) {
          enqueueSnackbar("Category deleted successfully");
          // Refresh based on current view mode
          if (viewMode === 0) {
            getAllCategories(pagination.page || 1, pagination.limit || 10);
          } else {
            getCategoryTree();
          }
        }
      } catch (error) {
        const formattedError = handleApiError(error, {
          onUnauthorized: () => {
            enqueueSnackbar("Please login to delete categories", {
              variant: "error",
            });
          },
          onForbidden: () => {
            enqueueSnackbar("You don't have permission to delete categories", {
              variant: "error",
            });
          },
          onNotFound: () => {
            enqueueSnackbar("Category not found", { variant: "error" });
          },
          onServerError: () => {
            enqueueSnackbar("Server error occurred", { variant: "error" });
          },
        });

        enqueueSnackbar(formattedError.message, { variant: "error" });
      }
    },
    [
      enqueueSnackbar,
      viewMode,
      pagination.page,
      pagination.limit,
      getAllCategories,
      getCategoryTree,
    ]
  );

  // Handle edit
  const handleEditRow = useCallback(
    (id) => {
      if (!id) {
        enqueueSnackbar("Category ID is required", { variant: "error" });
        return;
      }
      router.push(paths.dashboard.category.edit(id));
    },
    [router, enqueueSnackbar]
  );

  // Handle create new
  const handleCreateNew = useCallback(() => {
    router.push(paths.dashboard.category.add);
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Failed to load categories"}
        </Alert>
        <Button
          variant="contained"
          onClick={() =>
            viewMode === 0 ? getAllCategories() : getCategoryTree()
          }
          startIcon={<Iconify icon="solar:refresh-bold" />}>
          Retry
        </Button>
      </Container>
    );
  }

  // Render tree view
  const renderTreeView = () => {
    const renderCategoryNode = (category, level = 0) => (
      <Box key={category.id || category._id} sx={{ pl: level * 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            {category.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {category.description}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleEditRow(category.id || category._id)}>
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDeleteRow(category.id || category._id)}>
              Delete
            </Button>
          </Stack>
        </Stack>
        {category.children &&
          category.children.map((child) =>
            renderCategoryNode(child, level + 1)
          )}
      </Box>
    );

    return (
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Category Tree Structure
          </Typography>
          {treeData.length > 0 ? (
            treeData.map((category) => renderCategoryNode(category))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No categories found
            </Typography>
          )}
        </Box>
      </Card>
    );
  };

  // Render list view
  const renderListView = () => {
    const notFound = !tableData.length;
    const dataInPage = tableData.slice(
      table.page * table.rowsPerPage,
      table.page * table.rowsPerPage + table.rowsPerPage
    );
    const denseHeight = table.dense ? 52 : 72;

    return (
      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id || row._id)
                  )
                }
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <CategoriesTableRow
                    key={row.id || row._id}
                    row={row}
                    selected={table.selected.includes(row.id || row._id)}
                    onSelectRow={() => table.onSelectRow(row.id || row._id)}
                    onEditRow={() => handleEditRow(row.id || row._id)}
                    onDeleteRow={() => handleDeleteRow(row.id || row._id)}
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
          count={pagination.total || 0}
          page={pagination.page - 1} // Table uses 0-based pagination
          rowsPerPage={pagination.limit || 10}
          onPageChange={(event, newPage) => handlePageChange(newPage)}
          onRowsPerPageChange={(event) =>
            handleLimitChange(parseInt(event.target.value, 10))
          }
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
    );
  };

  return (
    <>
      <Stack
        spacing={2.5}
        direction={{
          xs: "column",
          md: "row",
        }}
        alignItems={{
          xs: "flex-end",
          md: "center",
        }}
        justifyContent="space-between"
        sx={{
          mb: { xs: 3, md: 5 },
        }}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h4">Categories</Typography>
          {viewMode === 0 && pagination.total > 0 && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ({pagination.total} categories)
            </Typography>
          )}
        </Stack>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateNew}>
          New Category
        </Button>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={viewMode} onChange={handleViewModeChange}>
          <Tab label="List View" />
          <Tab label="Tree View" />
        </Tabs>
      </Box>

      {viewMode === 0 ? renderListView() : renderTreeView()}
    </>
  );
}

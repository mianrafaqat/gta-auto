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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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

import TaxService from "src/services/tax/tax.service";
import TaxTableRow from "./tax-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name" },
  { id: "country", label: "Country" },
  { id: "state", label: "State" },
  { id: "rate", label: "Rate (%)" },
  { id: "isDefault", label: "Default" },
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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    country: "",
    state: ""
  });
  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false);
  const [calculationData, setCalculationData] = useState({
    amount: "",
    country: "",
    state: "",
    includesTax: false
  });
  const [calculationResult, setCalculationResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all taxes with pagination and filters
  const getAllTaxes = useCallback(async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build pagination parameters
      const params = buildPaginationParams({
        page: newFilters.page,
        limit: newFilters.limit
      });
      
      // Add filter parameters
      if (newFilters.country) params.country = newFilters.country;
      if (newFilters.state) params.state = newFilters.state;
      
      const response = await TaxService.getAll(params);
      
      if (response && response.status === 200) {
        setTableData(response.data || []);
        setPagination(extractPagination(response));
      } else {
        setTableData([]);
        setPagination({});
      }
    } catch (error) {
      const formattedError = handleApiError(error, {
        onUnauthorized: () => {
          enqueueSnackbar("Please login to view taxes", { variant: "error" });
        },
        onForbidden: () => {
          enqueueSnackbar("You don't have permission to view taxes", { variant: "error" });
        },
        onNotFound: () => {
          enqueueSnackbar("Taxes not found", { variant: "error" });
        },
        onServerError: () => {
          enqueueSnackbar("Server error occurred", { variant: "error" });
        }
      });
      
      setError(formattedError);
      setTableData([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [filters, enqueueSnackbar]);

  // Initial fetch
  useEffect(() => {
    getAllTaxes();
  }, []);

  // Handle filter changes
  const handleFilters = useCallback(
    (name, value) => {
      const newFilters = { ...filters, [name]: value, page: 1 }; // Reset to first page
      setFilters(newFilters);
      getAllTaxes(newFilters);
    },
    [filters, getAllTaxes]
  );

  // Handle pagination changes
  const handlePageChange = useCallback(
    (newPage) => {
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
      getAllTaxes(newFilters);
    },
    [filters, getAllTaxes]
  );

  // Handle limit changes
  const handleLimitChange = useCallback(
    (newLimit) => {
      const newFilters = { ...filters, limit: newLimit, page: 1 };
      setFilters(newFilters);
      getAllTaxes(newFilters);
    },
    [filters, getAllTaxes]
  );

  // Handle delete
  const handleDeleteRow = useCallback(async (id) => {
    try {
      const response = await TaxService.delete(id);
      if (response?.status === 200) {
        enqueueSnackbar("Tax deleted successfully");
        getAllTaxes(); // Refresh the list
      }
    } catch (error) {
      const formattedError = handleApiError(error, {
        onUnauthorized: () => {
          enqueueSnackbar("Please login to delete taxes", { variant: "error" });
        },
        onForbidden: () => {
          enqueueSnackbar("You don't have permission to delete taxes", { variant: "error" });
        },
        onNotFound: () => {
          enqueueSnackbar("Tax not found", { variant: "error" });
        },
        onServerError: () => {
          enqueueSnackbar("Server error occurred", { variant: "error" });
        }
      });
      
      enqueueSnackbar(formattedError.message, { variant: "error" });
    }
  }, [enqueueSnackbar, getAllTaxes]);

  // Handle edit
  const handleEditRow = useCallback((id) => {
    router.push(paths.dashboard.tax.edit(id));
  }, [router]);

  // Handle create new
  const handleCreateNew = useCallback(() => {
    router.push(paths.dashboard.tax.add);
  }, [router]);

  // Handle calculate tax
  const handleCalculateTax = useCallback(async () => {
    try {
      setCalculating(true);
      
      const response = await TaxService.calculate({
        amount: parseFloat(calculationData.amount),
        country: calculationData.country,
        state: calculationData.state || undefined,
        includesTax: calculationData.includesTax
      });
      
      if (response && response.status === 200) {
        setCalculationResult(response.data);
      } else {
        setCalculationResult(null);
      }
    } catch (error) {
      const formattedError = handleApiError(error, {
        onUnauthorized: () => {
          enqueueSnackbar("Please login to calculate tax", { variant: "error" });
        },
        onForbidden: () => {
          enqueueSnackbar("You don't have permission to calculate tax", { variant: "error" });
        },
        onNotFound: () => {
          enqueueSnackbar("Tax calculation failed", { variant: "error" });
        },
        onServerError: () => {
          enqueueSnackbar("Server error occurred", { variant: "error" });
        }
      });
      
      enqueueSnackbar(formattedError.message, { variant: "error" });
      setCalculationResult(null);
    } finally {
      setCalculating(false);
    }
  }, [calculationData, enqueueSnackbar]);

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
          {error.message || "Failed to load taxes"}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => getAllTaxes()}
          startIcon={<Iconify icon="solar:refresh-bold" />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const notFound = !tableData.length;
  const dataInPage = tableData.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const denseHeight = table.dense ? 52 : 72;

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
        }}
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="h4">Tax Rules</Typography>
          {pagination.total > 0 && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ({pagination.total} tax rules)
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:calculator-bold" />}
            onClick={() => setCalculateDialogOpen(true)}
          >
            Calculate Tax
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateNew}
          >
            New Tax Rule
          </Button>
        </Stack>
      </Stack>

      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset" }}>
          <Scrollbar>
            <Table size={table.dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
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
                  <TaxTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
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
          onPageChange={(event, newPage) => handlePageChange(newPage + 1)}
          onRowsPerPageChange={(event) => handleLimitChange(parseInt(event.target.value, 10))}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>

      {/* Tax Calculation Dialog */}
      <Dialog 
        open={calculateDialogOpen} 
        onClose={() => setCalculateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Calculate Tax</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={calculationData.amount}
              onChange={(e) => setCalculationData({ ...calculationData, amount: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Country"
              value={calculationData.country}
              onChange={(e) => setCalculationData({ ...calculationData, country: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="State (Optional)"
              value={calculationData.state}
              onChange={(e) => setCalculationData({ ...calculationData, state: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Tax Included</InputLabel>
              <Select
                value={calculationData.includesTax}
                onChange={(e) => setCalculationData({ ...calculationData, includesTax: e.target.value })}
                label="Tax Included"
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>

            {calculationResult && (
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Calculation Result</Typography>
                <Typography variant="body2">
                  Amount: ${calculationData.amount}
                </Typography>
                <Typography variant="body2">
                  Tax Rate: {calculationResult.rate}%
                </Typography>
                <Typography variant="body2">
                  Tax Amount: ${calculationResult.taxAmount}
                </Typography>
                <Typography variant="body2">
                  Total: ${calculationResult.total}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalculateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCalculateTax} 
            variant="contained"
            disabled={calculating || !calculationData.amount || !calculationData.country}
          >
            {calculating ? "Calculating..." : "Calculate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

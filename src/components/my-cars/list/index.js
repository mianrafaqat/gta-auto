"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { PRODUCT_STOCK_OPTIONS } from "src/_mock";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import EmptyContent from "src/components/empty-content";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import ProductTableToolbar from "../product-table-toolbar";
import ProductTableFiltersResult from "../product-table-filters-result";
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderCellStatus,
} from "../product-table-row";
import { CarsService } from "src/services";
import { useAuthContext } from "src/auth/hooks";
import { Link } from "@mui/material";

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const defaultFilters = {
  publish: [],
  stock: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ["category", "actions"];

// ----------------------------------------------------------------------

export default function MyCarsListPage() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState(HIDE_COLUMNS);

  const { user = {} } = useAuthContext()?.user || {};

  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      const res = await CarsService.getMyCars(user?._id);
      if (res?.data?.length) {
        setMyCars(res?.data);
      } else {
        setMyCars([]);
      }
    } catch (err) {
      console.log("🚀 ~ fetchMyCars ~ err:", err);
      setMyCars([]);
    } finally {
      setLoading(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const data = {
        carID: id,
        ownerID: user?._id,
      };
      handleDeleteCar(data, true);
    },
    [enqueueSnackbar, tableData]
  );

 

  const handleDeleteCar = async (data, singleRow = false) => {
    try {
      const res = await CarsService.deleteCarById(data);
      if (res?.data && singleRow) {
        enqueueSnackbar(res.data);
        fetchMyCars();
      }
    } catch (e) {
      console.log("error: ", e);
      enqueueSnackbar(e, { variant: "error" });
    }
  };

  
  const handleUpdateStatus = async (details) => {
    try {
      let  {_id: carID = '', status } = details
      status = status === 'Active' ? 'Paused' : 'Active'
      const data = {
        carID,
        ownerID: user?._id,
        status
      }
      const res = await CarsService.updateCar(data);
      if (res?.status === 200) {
        enqueueSnackbar(res.data);
        fetchMyCars();
      }
    } catch (e) {
      console.log("error: ", e);
      enqueueSnackbar(e, { variant: "error" });
    }
  };

  const handleDeleteRows = useCallback(async () => {
    try {
      if (selectedRowIds.length) {
        selectedRowIds.forEach((id) => {
          const data = {
            ownerID: user?._id,
            carID: id,
          };
          handleDeleteCar(data);
        });
        fetchMyCars();
      }
    } catch (e) {
      console.log("error: ", e);
      enqueueSnackbar(e, { variant: "error" });
    }
  }, [selectedRowIds]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.cars.my.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const columns = [
    {
      field: "category",
      headerName: "Category",
      filterable: false,
    },
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: "createdAt",
      headerName: "Create at",
      width: 160,
      renderCell: (params) => (
        <RenderCellCreatedAt date={params?.row?.createdAt} />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: "expireAt",
      headerName: "Expire At",
      width: 160,
      renderCell: (params) => (
        <RenderCellCreatedAt
          secondaryText={false}
          date={params?.row?.expireAt}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      type: "actions",
      field: "actions",
      headerName: " ",
      align: "right",
      headerAlign: "right",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row._id);
          }}
          sx={{ color: "error.main" }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify width='18px' icon={params.row?.status === 'Active' ? "raphael:no" : "mdi:tick-circle"} />}
          label={params.row.status === 'Active' ? "Paused" : "Active"}
          onClick={() => {
            handleUpdateStatus(params?.row);
          }}
          sx={{ color: params?.row?.status === 'Active' ? "error.main" : 'green' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  useEffect(() => {
    if (myCars.length) {
      setTableData(myCars);
    } else {
      setTableData([]);
    }
  }, [myCars]);

  useEffect(() => {
    if (user?._id) {
      fetchMyCars();
    }
  }, [user?._id]);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : "lg"}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Cars",
            },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.cars.my.add}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Car
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: "flex" },
            flexDirection: { md: "column" },
          }}
        >
          <DataGrid
            getRowId={(row) => row._id}
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={loading}
            getRowHeight={() => "auto"}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <ProductTableToolbar
                      filters={filters}
                      onFilters={handleFilters}
                     
                    />

                    <GridToolbarQuickFilter />

                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {!!selectedRowIds.length && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          }
                          onClick={confirmRows.onTrue}
                        >
                          Delete ({selectedRowIds.length})
                        </Button>
                      )}
                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <ProductTableFiltersResult
                      filters={filters}
                      onFilters={handleFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) =>
      stock.includes(product.inventoryType)
    );
  }

  if (publish.length) {
    inputData = inputData.filter((product) =>
      publish.includes(product.publish)
    );
  }

  return inputData;
}

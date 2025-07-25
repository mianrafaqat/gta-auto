'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList } from 'src/_mock';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import UserListingRow from '../userListingRows/index';
import { AdminUserService, SellerService } from 'src/services';
import DownloadPdfFile from 'src/components/pdfContent/index_old';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'password', label: 'Password' },
  { id: 'recentLogin', label: 'Last Login' },
  { id: 'accountType', label: 'Account Type' },
  { id: 'email', label: 'Email' },
  { id: 'createdDate', label: 'Created Date' },
  { id: 'status', label: 'Active?' },
  { id: 'authorized', label: 'Authorized' },
  { id: '', label: '' },
];
const ACCOUNT_TYPES = [
  {
    id: 1,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'SuperAdmin',
    accountGroup: 'SuperAdmin',
  },
  {
    id: 2,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'CompanyAdmin',
    accountGroup: 'CompanyAdmin',
  },
  {
    id: 3,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'ItemLister',
    accountGroup: 'ItemLister',
  },
  {
    id: 4,
    createdDate: 'February 01, 2024 09:57:53+0000',
    lastModifiedDate: 'February 01, 2024 09:57:53+0000',
    createdBy: null,
    name: 'OrderManager',
    accountGroup: 'OrderManager',
  },
];
const defaultFilters = {
  id: '',
  firstname: '',
  lastname: '',
  ebayUsername: '',
  invitationEmail: '',
  ebayEmail: '',
};

export default function UserListingPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [updateCount, setUpdateCount] = useState(0);
  const table = useTable();
  const router = useRouter();
  const handleGetAdminUsers = async () => {
    const response = await AdminUserService.getAllAdminUsers();
    const result = response?.data?.data;
    setTableData(result);
  };
  useEffect(() => {
    handleGetAdminUsers();
  }, [table.rowsPerPage, table.page, updateCount]);

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  const [filterValues, setFilterValues] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterValues,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filterValues);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      const response = await AdminUserService.deleteUser(id);
      if (response?.data?.status === '200') {
        setTableData((prevTableData) => prevTableData.filter((row) => row.id !== id));
        enqueueSnackbar(response?.data?.description, { variant: 'success' });
      } else {
        enqueueSnackbar(response?.data?.description, { variant: 'error' });
      }
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditUser = (row) => {
    router.push(paths.dashboard.users.edit + `?userId=${row?.id}`);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="User"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'List' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {/* Table */}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                  sellerList
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserListingRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        ACCOUNT_TYPES={ACCOUNT_TYPES}
                        handleEditUser={() => handleEditUser(row)}
                        setUpdateCount={setUpdateCount}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
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
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
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

function applyFilter({ inputData, comparator, filterValues }) {
  const { id, firstName, lastname, ebayUsername, invitationEmail, ebayEmail } = filterValues;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (id) {
    inputData = inputData.filter((user) => String(user.id).includes(id));
  }

  if (firstName) {
    inputData = inputData.filter(
      (user) => user.firstName.toLowerCase().indexOf(firstName.toLowerCase()) !== -1
    );
  }

  if (lastname) {
    inputData = inputData.filter(
      (user) => user.lastname.toLowerCase().indexOf(lastname.toLowerCase()) !== -1
    );
  }
  return inputData;
}

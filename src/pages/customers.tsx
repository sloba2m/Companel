import type { Customer } from 'src/types/customers';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { useGetCustomers } from 'src/actions/customers';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import {
  CustomerDrawer,
  TableWithDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Customers` };

export default function Page() {
  const [search, setSearch] = useState('');

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data: customersData, isLoading } = useGetCustomers({
    search,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const tableDrawer = useTableDrawer<Customer>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const columns: GridColDef<Customer>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 230,
      sortable: false,
    },
    {
      field: 'domain',
      headerName: 'Domain',
      width: 230,
      sortable: false,
      flex: 1,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        rows={customersData?.content ?? []}
        entity="Customers"
        drawerContent={<CustomerDrawer editData={editData} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        totalCount={customersData?.page.totalElements}
      />
    </>
  );
}

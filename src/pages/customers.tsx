import type { GridColDef } from '@mui/x-data-grid';
import type { Customer, CustomerPayload } from 'src/types/customers';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { usePagination } from 'src/hooks/use-pagination';
import { useTableDrawer } from 'src/hooks/use-table-drawer';

import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from 'src/actions/customers';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
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

  const { paginationModel, setPaginationModel } = usePagination();

  const { data: customersData, isLoading } = useGetCustomers({
    search,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const { mutate: createMutation } = useCreateCustomer();
  const { mutate: updateMutation } = useUpdateCustomer();
  const { mutate: deleteMutation } = useDeleteCustomer();

  const tableDrawer = useTableDrawer<Customer>(deleteMutation);
  const { handleEdit, handleDelete, editData, onYesNoToggle, yesNoOpen, handleDeleteConfirm } =
    tableDrawer;

  const columns: GridColDef<Customer>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'customCustomerId',
      headerName: 'Custom Customer ID',
      width: 160,
      sortable: false,
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

  const onSave = (data: CustomerPayload, id?: string) => {
    if (editData && id) updateMutation({ id, data });
    else createMutation(data);
    tableDrawer.onCloseDrawer();
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        rows={customersData?.content ?? []}
        entity="Customers"
        drawerContent={<CustomerDrawer editData={editData} onSave={onSave} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        totalCount={customersData?.page.totalElements ?? 0}
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

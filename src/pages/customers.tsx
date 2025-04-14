import type { GridColDef } from '@mui/x-data-grid';
import type { Customer, CustomerPayload } from 'src/types/customers';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

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
import { CustomerInfoDrawer } from 'src/components/table-with-drawer/customer-info-drawer';
import {
  CustomerDrawer,
  TableWithDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Customers` };

export default function Page() {
  const { t } = useTranslation();
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
  const {
    handleEdit,
    handleDelete,
    editData,
    onYesNoToggle,
    yesNoOpen,
    handleDeleteConfirm,
    viewData,
    handleView,
  } = tableDrawer;

  const columns: GridColDef<Customer>[] = [
    {
      field: 'name',
      headerName: t('customer.name'),
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'customCustomerId',
      headerName: t('customer.customCustomerId'),
      width: 160,
      sortable: false,
    },
    {
      field: 'phoneNumber',
      headerName: t('customer.phoneNumber'),
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: t('customer.email'),
      width: 230,
      sortable: false,
    },
    {
      field: 'domain',
      headerName: t('customer.domain'),
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
        entity={t('navigation.customers')}
        drawerContent={
          <>
            {editData && (
              <CustomerDrawer
                editData={editData}
                onSave={onSave}
                onClose={() => tableDrawer.onCloseDrawer()}
              />
            )}
            {viewData && (
              <CustomerInfoDrawer
                customer={viewData}
                onClose={() => tableDrawer.onCloseDrawer()}
                onEdit={handleEdit}
              />
            )}
          </>
        }
        onRowClick={(row) => handleView(row)}
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

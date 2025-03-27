import type { GridColDef } from '@mui/x-data-grid';
import type { Contact, ContactPayload } from 'src/types/contacts';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { usePagination } from 'src/hooks/use-pagination';
import { useTableDrawer } from 'src/hooks/use-table-drawer';

import {
  useGetContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from 'src/actions/contacts';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import {
  ContactDrawer,
  TableWithDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Contacts` };

export default function Page() {
  const [search, setSearch] = useState('');

  const { paginationModel, setPaginationModel } = usePagination();

  const { data: contactsData, isLoading } = useGetContacts({
    search,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const { mutate: createMutation } = useCreateContact();
  const { mutate: updateMutation } = useUpdateContact();
  const { mutate: deleteMutation } = useDeleteContact();

  const tableDrawer = useTableDrawer<Contact>(deleteMutation);
  const { handleEdit, handleDelete, editData, handleDeleteConfirm, onYesNoToggle, yesNoOpen } =
    tableDrawer;

  const columns: GridColDef<Contact>[] = [
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
      flex: 1,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  const onSave = (data: ContactPayload, id?: string) => {
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
        entity="Contacts"
        rows={contactsData?.content ?? []}
        drawerContent={<ContactDrawer editData={editData} onSave={onSave} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        totalCount={contactsData?.page.totalElements ?? 0}
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

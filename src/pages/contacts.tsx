import type { GridColDef } from '@mui/x-data-grid';
import type { Contact, ContactPayload } from 'src/types/contacts';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

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
import { ContactInfoDrawer } from 'src/components/table-with-drawer/contact-info-drawer';
import {
  ContactDrawer,
  TableWithDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Contacts` };

export default function Page() {
  const { t } = useTranslation();
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
  const {
    handleEdit,
    handleDelete,
    editData,
    handleDeleteConfirm,
    onYesNoToggle,
    yesNoOpen,
    handleView,
    viewData,
  } = tableDrawer;

  const columns: GridColDef<Contact>[] = [
    {
      field: 'name',
      headerName: t('contacts.name'),
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'phoneNumber',
      headerName: t('contacts.phoneNumber'),
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: t('contacts.email'),
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
        entity={t('navigation.contacts')}
        rows={contactsData?.content ?? []}
        drawerContent={
          <>
            {editData && (
              <ContactDrawer
                editData={editData}
                onSave={onSave}
                onClose={() => tableDrawer.onCloseDrawer()}
              />
            )}
            {viewData && (
              <ContactInfoDrawer contact={viewData} onClose={() => tableDrawer.onCloseDrawer()} />
            )}
          </>
        }
        onRowClick={(row) => handleView(row)}
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

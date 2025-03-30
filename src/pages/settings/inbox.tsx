import type { WithId } from 'src/hooks/use-table-drawer';
import type { Inbox, InboxPayload } from 'src/types/inbox';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { type GridColDef } from '@mui/x-data-grid';

import { usePagination } from 'src/hooks/use-pagination';
import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useGetInboxes, useCreateInbox, useUpdateInbox, useDeleteInbox } from 'src/actions/inbox';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { InboxDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Inbox settings - ${CONFIG.site.name}` };

type InboxWithId = Inbox & WithId;

export default function Page() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { paginationModel, setPaginationModel } = usePagination();

  const { data: inboxesData, isLoading } = useGetInboxes({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const { mutate: createMutation } = useCreateInbox();
  const { mutate: updateMutation } = useUpdateInbox();
  const { mutate: deleteMutation } = useDeleteInbox();

  const tableDrawer = useTableDrawer<InboxWithId>(deleteMutation);
  const { handleEdit, handleDelete, editData, handleDeleteConfirm, yesNoOpen, onYesNoToggle } =
    tableDrawer;

  const inboxesWithId: InboxWithId[] =
    inboxesData?.content.map((inbox) => ({
      ...inbox,
      id: inbox.externalId,
    })) ?? [];

  const filteredInboxes = inboxesWithId?.filter((inbox) =>
    inbox.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef<InboxWithId>[] = [
    {
      field: 'name',
      headerName: t('inbox.name'),
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'template',
      headerName: t('inbox.fields.emailTemplate'),
      width: 230,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: t('inbox.fields.createdAtLabel'),
      width: 230,
      sortable: false,
      renderCell: (params) => fDate(params.row.createdAt),
    },
    {
      field: 'updatedAt',
      headerName: t('inbox.fields.updatedAtLabel'),
      width: 230,
      sortable: false,
      renderCell: (params) => fDate(params.row.updatedAt),
      flex: 1,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  const onSave = (data: InboxPayload, id?: string) => {
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
        rows={filteredInboxes}
        entity={t('navigation.inbox')}
        drawerContent={<InboxDrawer editData={editData} onSave={onSave} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        totalCount={inboxesData?.page.totalElements ?? 0}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

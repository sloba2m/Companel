import type { Inbox, InboxPayload } from 'src/types/inbox';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { usePagination } from 'src/hooks/use-pagination';
import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useGetInboxes, useCreateInbox, useUpdateInbox } from 'src/actions/inbox';

import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { InboxDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Inbox settings - ${CONFIG.site.name}` };

export default function Page() {
  const [search, setSearch] = useState('');

  const { paginationModel, setPaginationModel } = usePagination();

  const { data: inboxesData, isLoading } = useGetInboxes({
    search,
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });

  const { mutate: createMutation } = useCreateInbox();
  const { mutate: updateMutation } = useUpdateInbox();

  const tableDrawer = useTableDrawer<Inbox>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const inboxesWithId =
    inboxesData?.content.map((inbox) => ({
      ...inbox,
      id: inbox.externalId,
    })) ?? [];

  const columns: GridColDef<Inbox>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'template',
      headerName: 'Template',
      width: 230,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 230,
      sortable: false,
      renderCell: (params) => fDate(params.row.createdAt),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 230,
      sortable: false,
      renderCell: (params) => fDate(params.row.updatedAt),
      flex: 1,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  const onSave = (data: InboxPayload, id?: string) => {
    if (editData && id) updateMutation({ id, data });
    createMutation(data);
    tableDrawer.onCloseDrawer();
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        rows={inboxesWithId}
        entity="Inbox"
        drawerContent={<InboxDrawer editData={editData} onSave={onSave} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        totalCount={inboxesData?.page.totalElements ?? 0}
        isInSubMenu
      />
    </>
  );
}

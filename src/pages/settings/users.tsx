import type { User, UserPayload } from 'src/types/users';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from 'src/actions/users';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { UsersDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

// ----------------------------------------------------------------------

const metadata = { title: `Users settings - ${CONFIG.site.name}` };

export default function Page() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data: usersData, isLoading } = useGetUsers();

  const { mutate: createMutation } = useCreateUser();
  const { mutate: updateMutation } = useUpdateUser();
  const { mutate: deleteMutation } = useDeleteUser();

  const tableDrawer = useTableDrawer<User>(deleteMutation);
  const { handleEdit, handleDelete, editData, handleDeleteConfirm, onYesNoToggle, yesNoOpen } =
    tableDrawer;

  const filteredUsers = usersData?.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const onSave = (data: UserPayload, id?: string) => {
    if (editData && id) updateMutation({ id, data });
    else createMutation(data);
    tableDrawer.onCloseDrawer();
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      width: 160,
      sortable: false,
      renderHeader: (param) => <Box sx={{ ml: 1 }}>{param.colDef.headerName}</Box>,
      renderCell: (param) => <Box sx={{ ml: 1 }}>{param.row.firstName}</Box>,
    },
    {
      field: 'lastName',
      headerName: t('user.lastName'),
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: t('user.email'),
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
        entity={t('navigation.users')}
        columns={columns}
        rows={filteredUsers ?? []}
        drawerContent={
          <UsersDrawer
            key={editData?.id}
            editData={editData}
            onSave={onSave}
            onClose={() => tableDrawer.onCloseDrawer()}
          />
        }
        onRowClick={() => console.log('row clicked')}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        totalCount={filteredUsers?.length ?? 0}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

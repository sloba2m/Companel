import type { User, UserPayload } from 'src/types/users';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import { useGetUsers, useCreateUser, useUpdateUser } from 'src/actions/users';

import { UsersDrawer, TableWithDrawer } from 'src/components/table-with-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';

// ----------------------------------------------------------------------

const metadata = { title: `Users settings - ${CONFIG.site.name}` };

export default function Page() {
  const [search, setSearch] = useState('');

  const { data: usersData, isLoading } = useGetUsers();

  const { mutate: createMutation } = useCreateUser();

  const { mutate: updateMutation } = useUpdateUser();

  const tableDrawer = useTableDrawer<User>();
  const { handleEdit, handleDelete, editData } = tableDrawer;

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
      headerName: 'First Name',
      width: 160,
      sortable: false,
      renderHeader: (param) => <Box sx={{ ml: 1 }}>{param.colDef.headerName}</Box>,
      renderCell: (param) => <Box sx={{ ml: 1 }}>{param.row.firstName}</Box>,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
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

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        entity="Users"
        columns={columns}
        rows={filteredUsers ?? []}
        drawerContent={<UsersDrawer key={editData?.id} editData={editData} onSave={onSave} />}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isLoading={isLoading}
        totalCount={filteredUsers?.length ?? 0}
        isInSubMenu
      />
    </>
  );
}

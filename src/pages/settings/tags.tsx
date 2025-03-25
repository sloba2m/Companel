import type { Tag } from 'src/types/tags';

import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import { useGetTags, useCreateTag, useUpdateTag, useDeleteTag } from 'src/actions/tags';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { TagsDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Tags settings - ${CONFIG.site.name}` };

export default function Page() {
  const { data: tagsData } = useGetTags();
  const { mutate: createMutation } = useCreateTag();
  const { mutate: updateMutation } = useUpdateTag();
  const { mutate: deleteMutation } = useDeleteTag();
  const tableDrawer = useTableDrawer<Tag>(deleteMutation);
  const { handleEdit, editData, handleDelete, handleDeleteConfirm, yesNoOpen, onYesNoToggle } =
    tableDrawer;

  const onSave = (name: string, id?: string) => {
    if (editData && id) updateMutation({ id, name });
    else createMutation(name);
    tableDrawer.onCloseDrawer();
  };

  const columns: GridColDef<Tag>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      sortable: false,
      flex: 1,
      ...firstColumnMargin,
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
        entity="Tags"
        rows={tagsData ?? []}
        drawerContent={<TagsDrawer editData={editData} onSave={onSave} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

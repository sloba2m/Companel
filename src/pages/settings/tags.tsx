import type { Tag } from 'src/types/tags';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import { useGetTags, useCreateTag, useUpdateTag, useDeleteTag } from 'src/actions/tags';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { TagInfoDrawer } from 'src/components/table-with-drawer/tag-info-drawer';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import { TagsDrawer, TableWithDrawer, firstColumnMargin } from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Tags settings - ${CONFIG.site.name}` };

export default function Page() {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');

  const { data: tagsData, isLoading } = useGetTags();
  const { mutate: createMutation } = useCreateTag();
  const { mutate: updateMutation } = useUpdateTag();
  const { mutate: deleteMutation } = useDeleteTag();
  const tableDrawer = useTableDrawer<Tag>(deleteMutation);
  const {
    handleEdit,
    editData,
    handleDelete,
    handleDeleteConfirm,
    yesNoOpen,
    onYesNoToggle,
    viewData,
    handleView,
  } = tableDrawer;

  const onSave = (name: string, id?: string) => {
    if (editData && id) updateMutation({ id, name });
    else createMutation(name);
    tableDrawer.onCloseDrawer();
  };

  const columns: GridColDef<Tag>[] = [
    {
      field: 'name',
      headerName: t('tags.fields.name'),
      width: 160,
      sortable: false,
      flex: 1,
      ...firstColumnMargin,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  const filteredTags = tagsData?.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        columns={columns}
        entity={t('navigation.tags')}
        rows={filteredTags ?? []}
        isLoading={isLoading}
        drawerContent={
          <>
            {editData && (
              <TagsDrawer
                editData={editData}
                onSave={onSave}
                onClose={() => tableDrawer.onCloseDrawer()}
              />
            )}
            {viewData && (
              <TagInfoDrawer
                key={viewData.id}
                tag={viewData}
                onClose={() => tableDrawer.onCloseDrawer()}
                onEdit={handleEdit}
              />
            )}
          </>
        }
        onRowClick={(row) => handleView(row)}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

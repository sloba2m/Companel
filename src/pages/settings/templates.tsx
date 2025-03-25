import type { Template, TemplatePayload } from 'src/types/templates';

import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';
import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import {
  useUploadLogo,
  useGetTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from 'src/actions/templates';

import { YesNoDialog } from 'src/components/Dialog/YesNoDialog';
import { getActionColumn } from 'src/components/table-with-drawer/utils/action-column';
import {
  TableWithDrawer,
  TemplatesDrawer,
  firstColumnMargin,
} from 'src/components/table-with-drawer';

// ----------------------------------------------------------------------

const metadata = { title: `Templates settings - ${CONFIG.site.name}` };

export default function Page() {
  const tableDrawer = useTableDrawer<Template>();
  const { handleEdit, editData } = tableDrawer;
  const { value: yesNoOpen, onToggle: onYesNoToggle } = useBoolean(false);

  const { data: templatesData } = useGetTemplates();
  const { mutate: createMutation } = useCreateTemplate();
  const { mutate: uploadLogoMutation } = useUploadLogo();
  const { mutate: updateMutation } = useUpdateTemplate();
  const { mutate: deleteMutation } = useDeleteTemplate();

  const idToDelete = useRef<string | null>(null);

  const handleDelete = (data: Template) => {
    idToDelete.current = data.id;
    onYesNoToggle();
  };

  const handleDeleteConfirm = () => {
    if (idToDelete.current) {
      deleteMutation(idToDelete.current);
      onYesNoToggle();
    }
  };

  const columns: GridColDef<Template>[] = [
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
      field: 'logo',
      headerName: 'Logo',
      width: 160,
      sortable: false,
      renderCell: (params) => <>{params.row.logoUrl ? 'Yes' : 'No'}</>,
      flex: 1,
    },
    getActionColumn(handleEdit, handleDelete),
  ];

  const onSave = (data: TemplatePayload, id?: string) => {
    if (editData && id)
      updateMutation(
        { id, data },
        {
          onSuccess: () => {
            if (data.logoFile) uploadLogoMutation({ id, file: data.logoFile });
          },
        }
      );
    else
      createMutation(data, {
        onSuccess: (res: Template) => {
          if (data.logoFile) uploadLogoMutation({ id: res.id, file: data.logoFile });
        },
      });
    tableDrawer.onCloseDrawer();
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TableWithDrawer
        entity="Templates"
        columns={columns}
        rows={templatesData ?? []}
        drawerContent={<TemplatesDrawer editData={editData} onSave={onSave} key={editData?.id} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

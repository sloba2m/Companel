import type { Template, TemplatePayload } from 'src/types/templates';

import { Helmet } from 'react-helmet-async';

import { type GridColDef } from '@mui/x-data-grid';

import { useTableDrawer } from 'src/hooks/use-table-drawer';

import { CONFIG } from 'src/config-global';
import { useUploadLogo, useGetTemplates, useCreateTemplate } from 'src/actions/templates';

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
  const { handleEdit, handleDelete, editData } = tableDrawer;

  const { data: templatesData } = useGetTemplates();
  const { mutate: createMutation } = useCreateTemplate();
  const { mutate: uploadLogoMutation } = useUploadLogo();

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
    console.log(data);
    // if (editData && id) updateMutation({ id, data });
    createMutation(data, {
      onSuccess: (res: Template) => {
        if (data.logoFile) uploadLogoMutation({ id: res.id, file: data.logoFile });
      },
    });
    // if (data.logoFile) uploadLogoMutation({ id: data.id, file: data.logoFile });
    // tableDrawer.onCloseDrawer();
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
        drawerContent={<TemplatesDrawer editData={editData} onSave={onSave} />}
        onSearch={() => console.log('test')}
        tableDrawer={tableDrawer}
        isInSubMenu
      />
    </>
  );
}

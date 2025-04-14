import type { Template, TemplatePayload } from 'src/types/templates';

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { type GridColDef } from '@mui/x-data-grid';

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
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data: templatesData } = useGetTemplates();
  const { mutate: createMutation } = useCreateTemplate();
  const { mutate: uploadLogoMutation } = useUploadLogo();
  const { mutate: updateMutation } = useUpdateTemplate();
  const { mutate: deleteMutation } = useDeleteTemplate();
  const tableDrawer = useTableDrawer<Template>(deleteMutation);
  const { handleEdit, editData, handleDelete, yesNoOpen, onYesNoToggle, handleDeleteConfirm } =
    tableDrawer;

  const filteredTemplates = templatesData?.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef<Template>[] = [
    {
      field: 'name',
      headerName: t('templates.name'),
      width: 160,
      sortable: false,
      ...firstColumnMargin,
    },
    {
      field: 'logo',
      headerName: t('templates.fields.logo'),
      width: 160,
      sortable: false,
      renderCell: (params) => <>{params.row.logoUrl ? t('confirm.yes') : t('confirm.no')}</>,
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
        entity={t('navigation.templates')}
        columns={columns}
        rows={filteredTemplates ?? []}
        drawerContent={
          <TemplatesDrawer
            editData={editData}
            onSave={onSave}
            key={editData?.id}
            onClose={() => tableDrawer.onCloseDrawer()}
          />
        }
        onRowClick={() => console.log('row clicked')}
        onSearch={(val) => setSearch(val)}
        tableDrawer={tableDrawer}
        isInSubMenu
      />

      <YesNoDialog onClose={onYesNoToggle} open={yesNoOpen} onYes={handleDeleteConfirm} />
    </>
  );
}

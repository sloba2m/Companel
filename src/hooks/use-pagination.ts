import type { GridPaginationModel } from '@mui/x-data-grid';

import { useState } from 'react';

export const usePagination = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  return { paginationModel, setPaginationModel };
};

import { useState } from 'react';

import { useBoolean } from './use-boolean';

export type UseTableDrawerReturn<T> = {
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  handleEdit: (data: T) => void;
  handleDelete: () => void;
  isOpenDrawer: boolean;
  editData: T | null;
};

export const useTableDrawer = <T>(): UseTableDrawerReturn<T> => {
  const { onFalse, onTrue, value } = useBoolean(false);
  const [editData, setEditData] = useState<T | null>(null);

  const onCloseDrawer = () => {
    onFalse();
    setEditData(null);
  };

  const handleEdit = (data: T) => {
    onTrue();
    setEditData(data);
  };

  const handleDelete = () => {
    console.log('Delete');
  };

  return {
    onCloseDrawer,
    onOpenDrawer: onTrue,
    handleEdit,
    handleDelete,
    isOpenDrawer: value,
    editData,
  };
};

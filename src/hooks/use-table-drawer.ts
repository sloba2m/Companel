import type { UseMutateFunction } from '@tanstack/react-query';

import { useRef, useState } from 'react';

import { useBoolean } from './use-boolean';

export type WithId = { id: string };

export type UseTableDrawerReturn<T extends WithId> = {
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  handleEdit: (data: T) => void;
  handleDelete: (data: T) => void;
  handleDeleteConfirm: () => void;
  yesNoOpen: boolean;
  onYesNoToggle: () => void;
  isOpenDrawer: boolean;
  editData: T | null;
  viewData: T | null;
  handleView: (data: T) => void;
};

export const useTableDrawer = <T extends WithId>(
  deleteMutation: UseMutateFunction<any, Error, string, unknown>
): UseTableDrawerReturn<T> => {
  const { onFalse, onTrue, value } = useBoolean(false);
  const [editData, setEditData] = useState<T | null>(null);
  const [viewData, setViewData] = useState<T | null>(null);

  const { value: yesNoOpen, onToggle: onYesNoToggle } = useBoolean(false);
  const idToDelete = useRef<string | null>(null);

  const handleDelete = (data: T) => {
    idToDelete.current = data.id;
    onYesNoToggle();
  };

  const handleDeleteConfirm = () => {
    if (idToDelete.current) {
      deleteMutation?.(idToDelete.current);
      onYesNoToggle();
    }
  };

  const onCloseDrawer = () => {
    onFalse();
    setEditData(null);
  };

  const handleEdit = (data: T) => {
    onTrue();
    setEditData(data);
  };

  const handleView = (data: T) => {
    onTrue();
    setViewData(data);
  };

  return {
    onCloseDrawer,
    onOpenDrawer: onTrue,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
    yesNoOpen,
    onYesNoToggle,
    isOpenDrawer: value,
    editData,
    viewData,
    handleView,
  };
};

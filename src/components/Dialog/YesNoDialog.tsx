import type { FC } from 'react';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
}

export const YesNoDialog: FC<DialogProps> = ({ onClose, onYes, open }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>{t('common.areYouSure')}</DialogTitle>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('confirm.no')}
        </Button>
        <Button variant="contained" color="primary" onClick={onYes} autoFocus>
          {t('confirm.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

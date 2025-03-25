import type { FC } from 'react';

import React from 'react';

import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
}

export const YesNoDialog: FC<DialogProps> = ({ onClose, onYes, open }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ textAlign: 'center' }}>Are you sure?</DialogTitle>

    <DialogActions>
      <Button variant="outlined" onClick={onClose}>
        No
      </Button>
      <Button variant="contained" color="primary" onClick={onYes} autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

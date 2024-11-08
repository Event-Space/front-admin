import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { IUser } from '../../../entities/types/IUser';

interface DeleteUserDialogProps {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onConfirm: (user: IUser) => void;
}

export default function DeleteUserDialog({
  open,
  user,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {user.firstname} {user.lastname}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(user);
            onClose();
          }}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

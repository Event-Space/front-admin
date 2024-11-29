import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteModalProps {
  openDeleteModal: boolean;
  handleDeleteModalClose: () => void;
  handleDeleteConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  openDeleteModal,
  handleDeleteModalClose,
  handleDeleteConfirm,
}) => {
  return (
    <Dialog open={openDeleteModal} onClose={handleDeleteModalClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this event?</DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface AddModalProps {
  openAddEventModal: boolean;
  handleAddEventModalClose: () => void;
  handleAddEventConfirm: () => void;
}

const AddModal: React.FC<AddModalProps> = ({
  openAddEventModal,
  handleAddEventModalClose,
  handleAddEventConfirm,
}) => {
  return (
    <Dialog open={openAddEventModal} onClose={handleAddEventModalClose}>
      <DialogTitle>Confirm Add Event</DialogTitle>
      <DialogContent>
        Are you sure you want to add an event for this day?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddEventModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddEventConfirm} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;

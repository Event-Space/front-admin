import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { ISpace } from '../../../entities/types/ISpace';

interface DeleteSpaceDialogProps {
  open: boolean;
  space: ISpace | null;
  onClose: () => void;
  onConfirm: (space: ISpace) => void;
}

export default function DeleteSpaceDialog({
  open,
  space,
  onClose,
  onConfirm,
}: DeleteSpaceDialogProps) {
  if (!space) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Space</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the space named {space.name} located
          at {space.address}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(space);
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

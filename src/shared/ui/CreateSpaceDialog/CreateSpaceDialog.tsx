import React, { ChangeEvent, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Input,
} from '@mui/material';
import { useUserStore } from '../../../app/store/useUserStore';
import useFetch from '../../network/useFetch';

interface CreateSpaceDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSpaceDialog({
  open,
  onClose,
}: CreateSpaceDialogProps) {
  const { user } = useUserStore();
  const { fetchData: createSpace } = useFetch(
    'https://space-event.kenuki.org/order-service/api/v1/space',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newSpace, setNewSpace] = useState({
    name: '',
    address: '',
    location: '',
    size: 0,
    maxCapacity: 0,
    baseRentalCost: 0,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file as File);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSpace(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('spaceRequest', JSON.stringify(newSpace));
    formData.append('file', selectedFile);

    createSpace({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
      },
      body: formData,
    }).then(() => {
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Space</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          name="name"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Address"
          name="address"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Location"
          name="location"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Size"
          name="size"
          type="number"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Max Capacity"
          name="maxCapacity"
          type="number"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Base Rental Cost"
          name="baseRentalCost"
          type="number"
          fullWidth
          onChange={handleInputChange}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <Typography sx={{ fontSize: '18px' }}>Image</Typography>
          <Input type="file" onChange={handleFileChange} disableUnderline />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

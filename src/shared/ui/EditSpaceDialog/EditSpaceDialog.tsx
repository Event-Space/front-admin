import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Input,
  InputLabel,
} from '@mui/material';
import useFetch from '../../network/useFetch';
import { useUserStore } from '../../../app/store/useUserStore';
import { ISpace } from '../../../entities/types/ISpace';

interface EditSpaceDialogProps {
  open: boolean;
  onClose: () => void;
  space: ISpace;
}

export default function EditSpaceDialog({
  open,
  onClose,
  space,
}: EditSpaceDialogProps) {
  const { user } = useUserStore();
  const [file, setFile] = useState<File | null>(null);
  const [updatedSpace, setUpdatedSpace] = useState<ISpace>({ ...space });
  const [changes, setChanges] = useState<{ [key: string]: any }>({});

  const apiUrl = file
    ? `https://space-event.kenuki.org/order-service/api/v1/space/updateWithFile/${space.id}`
    : `https://space-event.kenuki.org/order-service/api/v1/space/update/${space.id}`;

  const { fetchData: editSpace } = useFetch<ISpace>(apiUrl);

  useEffect(() => {
    const newChanges: { [key: string]: any } = {};
    if (space.name !== updatedSpace.name) newChanges.name = updatedSpace.name;
    if (space.address !== updatedSpace.address)
      newChanges.address = updatedSpace.address;
    if (space.location !== updatedSpace.location)
      newChanges.location = updatedSpace.location;
    if (space.size !== updatedSpace.size) newChanges.size = updatedSpace.size;
    if (space.maxCapacity !== updatedSpace.maxCapacity)
      newChanges.maxCapacity = updatedSpace.maxCapacity;
    if (space.baseRentalCost !== updatedSpace.baseRentalCost)
      newChanges.baseRentalCost = updatedSpace.baseRentalCost;
    setChanges(newChanges);
  }, [updatedSpace, space]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
  };

  const handleSave = () => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    if (Object.keys(changes).length > 0) {
      formData.append('spaceRequest', JSON.stringify(changes));
    } else {
      formData.append('spaceRequest', '{}');
    }

    editSpace({
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
      },
      body: formData,
    }).then(() => onClose());
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Space</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          value={updatedSpace.name}
          onChange={e =>
            setUpdatedSpace({ ...updatedSpace, name: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Address"
          fullWidth
          value={updatedSpace.address}
          onChange={e =>
            setUpdatedSpace({ ...updatedSpace, address: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Location"
          fullWidth
          value={updatedSpace.location}
          onChange={e =>
            setUpdatedSpace({ ...updatedSpace, location: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Size"
          fullWidth
          type="number"
          value={updatedSpace.size}
          onChange={e =>
            setUpdatedSpace({
              ...updatedSpace,
              size: parseInt(e.target.value, 10),
            })
          }
        />
        <TextField
          margin="dense"
          label="Max Capacity"
          fullWidth
          type="number"
          value={updatedSpace.maxCapacity}
          onChange={e =>
            setUpdatedSpace({
              ...updatedSpace,
              maxCapacity: parseInt(e.target.value, 10),
            })
          }
        />
        <TextField
          margin="dense"
          label="Base Rental Cost"
          fullWidth
          type="number"
          value={updatedSpace.baseRentalCost}
          onChange={e =>
            setUpdatedSpace({
              ...updatedSpace,
              baseRentalCost: parseFloat(e.target.value),
            })
          }
        />
        <InputLabel htmlFor="upload-file" sx={{ marginTop: '16px' }}>
          Upload File{' '}
          <Input
            id="upload-file"
            type="file"
            onChange={handleFileChange}
            disableUnderline
          />
        </InputLabel>
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

import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { IUser, UserRole } from '../../../entities/types/IUser';
import useFetch from '../../network/useFetch';
import { useUserStore } from '../../../app/store/useUserStore';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: IUser;
}

export default function EditUserDialog({
  open,
  onClose,
  user,
}: EditUserDialogProps) {
  const { user: userToken } = useUserStore();
  const { fetchData: editUser } = useFetch<IUser[]>(
    `https://space-event.kenuki.org/security-service/api/manager/users?userEmail=${user.email}`,
  );

  const [updatedUser, setUpdatedUser] = useState<IUser>({
    ...user,
    role: user.role || UserRole.User,
  });

  const handleSave = () => {
    editUser({
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${userToken?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: updatedUser.phoneNumber,
        firstName: updatedUser.firstname || '',
        lastName: updatedUser.lastname || '',
        role: updatedUser.role,
      }),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="First Name"
          fullWidth
          value={updatedUser.firstname}
          onChange={e =>
            setUpdatedUser({ ...updatedUser, firstname: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Last Name"
          fullWidth
          value={updatedUser.lastname}
          onChange={e =>
            setUpdatedUser({ ...updatedUser, lastname: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Phone Number"
          fullWidth
          type="number"
          value={updatedUser.phoneNumber}
          onChange={e =>
            setUpdatedUser({
              ...updatedUser,
              phoneNumber: Number(e.target.value),
            })
          }
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select
            value={updatedUser.role as UserRole}
            onChange={e =>
              setUpdatedUser({
                ...updatedUser,
                role: e.target.value as UserRole,
              })
            }
          >
            <MenuItem value={UserRole.Manager}>Manager</MenuItem>
            <MenuItem value={UserRole.User}>User</MenuItem>
          </Select>
        </FormControl>
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

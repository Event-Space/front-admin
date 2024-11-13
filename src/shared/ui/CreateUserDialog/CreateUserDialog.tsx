// CreateUserDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useUserStore } from '../../../app/store/useUserStore';
import useFetch from '../../network/useFetch';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateUserDialog({
  open,
  onClose,
}: CreateUserDialogProps) {
  const { user } = useUserStore();
  const { fetchData: createUser } = useFetch(
    'https://space-event.kenuki.org/security-service/api/manager/users',
  );
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    role: 'USER', // default role
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    createUser({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    }).then(() => {
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          name="email"
          type="email"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="First Name"
          name="firstName"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Last Name"
          name="lastName"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Phone"
          name="phone"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          fullWidth
          onChange={handleInputChange}
        />
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

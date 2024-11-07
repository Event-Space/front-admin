import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { IUser } from '../../../entities/types/IUser';

interface UsersTableProps {
  data: IUser[];
  onEditClick: (user: IUser) => void;
  onDeleteClick: (user: IUser) => void;
}

export default function UsersTable({
  data,
  onEditClick,
  onDeleteClick,
}: UsersTableProps) {
  return (
    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={user.email}>
              <TableCell sx={{ width: '20px' }}>{index + 1}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => onEditClick(user)} color="primary">
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onDeleteClick(user)}
                  color="error"
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

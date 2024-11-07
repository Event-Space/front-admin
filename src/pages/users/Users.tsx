import { useEffect, useState } from 'react';
import useFetch from '../../shared/network/useFetch';
import { IUser } from '../../entities/types/IUser';
import { useUserStore } from '../../app/store/useUserStore';
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Link,
  Typography,
  TextField,
} from '@mui/material';
import UsersTable from './components/UsersTable';
import EditUserDialog from './components/EditUserDialog';
import DeleteUserDialog from './components/DeleteUserDialog';
import CreateUserDialog from './components/CreateUserDialog';

export default function UsersPage() {
  const { user, loading: loadingUser } = useUserStore();
  const [data, setData] = useState<IUser[] | undefined>();
  const [filteredData, setFilteredData] = useState<IUser[] | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { loading: loadingData, fetchData } = useFetch<IUser[]>(
    'https://server.kenuki.org/api/manager/users',
  );

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { fetchData: deleteUser } = useFetch<IUser[]>(
    `https://server.kenuki.org/api/manager/users?userEmail=${selectedUser?.email}`,
  );

  const fetchUserData = () => {
    fetchData({
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response) {
        setData(response);
        setFilteredData(response); // Set initial filtered data
      }
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (data) {
      setFilteredData(
        data.filter(
          user =>
            user.email.toLowerCase().includes(query) ||
            user.firstname.toLowerCase().includes(query) ||
            user.lastname.toLowerCase().includes(query),
        ),
      );
    }
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleDeleteClick = (user: IUser) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setOpenEdit(false);
    fetchUserData();
  };

  const handleCloseCreateModal = () => {
    setOpenCreate(false);
    fetchUserData();
    setSelectedUser(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDelete(false);
    setSelectedUser(null);
    fetchUserData();
  };

  const handleCreateUser = () => {
    setOpenCreate(true);
    setSelectedUser(null);
  };

  const confirmDelete = () => {
    deleteUser({
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    fetchUserData();
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUserData();
  }, [setSelectedUser]);

  return (
    <section style={{ minHeight: '90vh' }}>
      <Box sx={{ padding: '20px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.primary">Users</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '24px', sm: '32px', md: '48px', lg: '64px' },
              fontWeight: '700',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Users
          </Typography>
          <Button variant="contained" onClick={handleCreateUser}>
            Create new user
          </Button>
        </Box>

        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search users"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '250px', fontSize: '18px', padding: '0' }}
          />
          <Typography>Total Users: {filteredData?.length}</Typography>
        </Box>

        {(loadingData || loadingUser) && <CircularProgress />}

        {!loadingData && filteredData && (
          <UsersTable
            data={filteredData}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        {selectedUser && (
          <EditUserDialog
            open={openEdit}
            onClose={handleCloseEditModal}
            user={selectedUser}
          />
        )}

        {selectedUser && (
          <DeleteUserDialog
            open={openDelete}
            onClose={handleCloseDeleteModal}
            user={selectedUser}
            onConfirm={confirmDelete}
          />
        )}

        <CreateUserDialog open={openCreate} onClose={handleCloseCreateModal} />
      </Box>
    </section>
  );
}

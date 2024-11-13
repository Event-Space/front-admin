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
import UsersTable from '../../shared/ui/UsersTable/UsersTable';
import EditUserDialog from '../../shared/ui/EditUserDialog/EditUserDialog';
import DeleteUserDialog from '../../shared/ui/DeleteUserDialog/DeleteUserDialog';
import { TablePagination } from '@mui/material';
import CreateUserDialog from '../../shared/ui/CreateUserDialog/CreateUserDialog';

export default function UsersPage() {
  const { user, loading: loadingUser } = useUserStore();
  const [data, setData] = useState<IUser[] | undefined>();
  const [filteredData, setFilteredData] = useState<IUser[] | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loading: loadingData, fetchData } = useFetch<IUser[]>(
    'https://space-event.kenuki.org/security-service/api/manager/users',
  );

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { fetchData: deleteUser } = useFetch<IUser[]>(
    `https://space-event.kenuki.org/security-service/api/manager/users?userEmail=${selectedUser?.email}`,
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
        setFilteredData(response);
      }
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setPage(0);

    if (data) {
      setFilteredData(
        data.filter(
          user =>
            (user.email?.toLowerCase() || '').includes(query) ||
            (user.firstname?.toLowerCase() || '').includes(query) ||
            (user.lastname?.toLowerCase() || '').includes(query),
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
    setSelectedUser(null);
    setOpenCreate(false);
    fetchUserData();
  };

  const handleCloseDeleteModal = () => {
    setSelectedUser(null);
    setOpenDelete(false);
    fetchUserData();
  };

  const handleCreateUser = () => {
    setOpenCreate(true);
    setSelectedUser(null);
  };

  const confirmDelete = () => {
    setSelectedUser(null);
    deleteUser({
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    fetchUserData();
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
          <>
            <UsersTable
              data={filteredData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              )}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
            <TablePagination
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
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

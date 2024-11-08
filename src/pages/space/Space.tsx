import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Button,
  TextField,
} from '@mui/material';
import useFetch from '../../shared/network/useFetch';
import { useUserStore } from '../../app/store/useUserStore';
import { SpaceTable } from '../../shared/ui/SpaceTable';
import { ISpace } from '../../entities/types/ISpace';
import { EditSpaceDialog } from '../../shared/ui/EditSpaceDialog';
import { DeleteSpaceDialog } from '../../shared/ui/DeleteSpaceDialog';
import { CreateSpaceDialog } from '../../shared/ui/CreateSpaceDialog';

export default function SpacePage() {
  const { user, loading: loadingUser } = useUserStore();
  const [data, setData] = useState<ISpace[] | undefined>();
  const [filteredData, setFilteredData] = useState<ISpace[] | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { loading: loadingData, fetchData } = useFetch<ISpace[]>(
    'https://zenuki.kz/api/v1/space',
  );

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { fetchData: deleteSpace } = useFetch<ISpace[]>(
    `https://zenuki.kz/api/v1/space/delete/${selectedSpace?.id}`,
  );

  const fetchSpaceData = () => {
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

    if (data) {
      setFilteredData(
        data.filter(space => (space.name?.toLowerCase() || '').includes(query)),
      );
    }
  };

  const handleEditClick = (space: ISpace) => {
    setSelectedSpace(space);
    setOpenEdit(true);
  };

  const handleDeleteClick = (space: ISpace) => {
    setSelectedSpace(space);
    setOpenDelete(true);
  };

  const handleCloseEditModal = () => {
    setSelectedSpace(null);
    setOpenEdit(false);
    fetchSpaceData();
  };

  const handleCloseCreateModal = () => {
    setSelectedSpace(null);
    setOpenCreate(false);
    fetchSpaceData();
  };

  const handleCloseDeleteModal = () => {
    setSelectedSpace(null);
    setOpenDelete(false);
    fetchSpaceData();
  };

  const handleCreateUser = () => {
    setOpenCreate(true);
    setSelectedSpace(null);
  };

  const confirmDelete = () => {
    setSelectedSpace(null);
    deleteSpace({
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    fetchSpaceData();
  };

  useEffect(() => {
    fetchSpaceData();
  }, [setSelectedSpace]);

  return (
    <section style={{ minHeight: '90vh' }}>
      <Box sx={{ padding: '20px' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.primary">Spaces</Typography>
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
            Spaces
          </Typography>
          <Button variant="contained" onClick={handleCreateUser}>
            Create new space
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
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: '250px', fontSize: '18px', padding: '0' }}
          />
          <Typography>Total Spaces: {filteredData?.length}</Typography>
        </Box>

        {(loadingData || loadingUser) && <CircularProgress />}

        {!loadingData && filteredData && (
          <SpaceTable
            data={filteredData}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        {selectedSpace && (
          <EditSpaceDialog
            open={openEdit}
            onClose={handleCloseEditModal}
            space={selectedSpace}
          />
        )}

        {selectedSpace && (
          <DeleteSpaceDialog
            open={openDelete}
            onClose={handleCloseDeleteModal}
            space={selectedSpace}
            onConfirm={confirmDelete}
          />
        )}

        <CreateSpaceDialog open={openCreate} onClose={handleCloseCreateModal} />
      </Box>
    </section>
  );
}

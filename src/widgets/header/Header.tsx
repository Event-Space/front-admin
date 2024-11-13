import { Box, Typography, IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { FullscreenButton } from '../../shared/ui';
import { useSidebar } from '../../app/store/useSidebar';
import useFetch from '../../shared/network/useFetch';
import { IUser } from '../../entities/types/IUser';
import { useUserStore } from '../../app/store/useUserStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const { user, loading } = useUserStore();
  const [userData, setUserData] = useState<IUser>();
  const { fetchData } = useFetch<IUser>(
    'https://space-event.kenuki.org/security-service/api/user/profile',
  );

  useEffect(() => {
    if (!loading) {
      fetchData({
        headers: {
          Authorization: `Bearer ${user?.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(response => {
        if (response) {
          setUserData(response);
        }
      });
      console.log(userData);
    }
  }, [loading]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box sx={{ display: 'flex' }}>
        <IconButton onClick={toggleSidebar}>
          <MenuOutlinedIcon />
        </IconButton>
        <FullscreenButton />
      </Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
        Manager Panel
      </Typography>
      <Typography sx={{ marginRight: '10px' }}>
        {userData?.email} | {userData?.role}
      </Typography>
    </Box>
  );
}

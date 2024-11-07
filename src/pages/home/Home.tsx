import { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Card,
  Button,
  CardActions,
} from '@mui/material';
import useFetch from '../../shared/network/useFetch';
import { useUserStore } from '../../app/store/useUserStore';
import PersonIcon from '@mui/icons-material/Person';

export default function HomePage() {
  const { user } = useUserStore();
  const { data, loading, fetchData } = useFetch<any[]>(
    'https://server.kenuki.org/api/manager/users-count',
  );

  useEffect(() => {
    fetchData({
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>

      <Typography
        sx={{
          fontSize: { xs: '24px', sm: '32px', md: '48px', lg: '64px' },
          fontWeight: '700',
          fontFamily: '"Montserrat", sans-serif',
          marginBottom: '30px',
        }}
      >
        Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <Card
            sx={{
              minWidth: 275,
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '15px',
              }}
            >
              <PersonIcon color="primary" sx={{ fontSize: '40px' }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold' }}
              >
                Users
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: '8px' }}
              >
                Total number of users: {data}
              </Typography>
              <CardActions sx={{ paddingLeft: '0', marginTop: '10px' }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  href="/users"
                >
                  View Details
                </Button>
              </CardActions>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
}

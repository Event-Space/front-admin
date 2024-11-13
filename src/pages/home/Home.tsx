import { useEffect, useState } from 'react';
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
import { ISpace } from '../../entities/types/ISpace';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { CalendarIcon } from '@mui/x-date-pickers';

export default function HomePage() {
  const { user } = useUserStore();
  const [spaceSize, setSpaceSize] = useState(0);
  const { data, loading, fetchData } = useFetch<any[]>(
    'https://space-event.kenuki.org/security-service/api/manager/users-count',
  );

  const { fetchData: fetchSpaces } = useFetch<ISpace[]>(
    'https://space-event.kenuki.org/order-service/api/v1/space',
  );

  useEffect(() => {
    fetchData({
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    fetchSpaces({
      headers: {
        Authorization: `Bearer ${user?.tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(res => {
      if (res) {
        setSpaceSize(res.length);
      }
    });
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
        <Link underline="hover" color="inherit" href="/"></Link>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
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
            <Card
              sx={{
                minWidth: 450,
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
                <SpaceDashboardIcon
                  color="primary"
                  sx={{ fontSize: '120px' }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 'bold' }}
                >
                  Spaces
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: '8px' }}
                >
                  Total number of spaces: {spaceSize}
                </Typography>
                <CardActions sx={{ paddingLeft: '0', marginTop: '10px' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    href="/spaces"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Box>
            </Card>
          </Box>
          <Card
            sx={{
              width: 765,
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
              <CalendarIcon color="primary" sx={{ fontSize: '150px' }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 'bold' }}
              >
                Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellendus minus, nesciunt nam odio est neque amet corporis
                laudantium dolore voluptatum praesentium, harum perferendis at!
              </Typography>
              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button
                  size="medium"
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

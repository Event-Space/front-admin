import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupervisedUserCircleOutlined } from '@mui/icons-material';
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
} from '@mui/material';
import useFetch from '../../shared/network/useFetch';
import { useUserStore } from '../../app/store/useUserStore';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { data, error, loading, fetchData } = useFetch<{
    accessToken: string;
    refreshToken: string;
  }>('https://server.kenuki.org/api/auth/login');

  const { login: contextLogin, user, loading: userLoading } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      contextLogin(login, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      navigate('/');
    }
  }, [data, contextLogin, navigate]);

  useEffect(() => {
    if (user && user.isAuthenticated) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchData({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUsername: login, password }),
    });
  };

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading || userLoading ? (
        <CircularProgress />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            padding: { xs: '0 30px', sm: '0px' },
            maxWidth: { sm: '420px', md: '460px', lg: '500px' },
          }}
        >
          <SupervisedUserCircleOutlined
            sx={{
              width: { xs: '64px', sm: '80px', md: '96px', lg: '120px' },
              height: { xs: '64px', sm: '80px', md: '96px', lg: '120px' },
              alignSelf: 'center',
              color: '#10107B',
              marginBottom: '20px',
            }}
          />
          <Typography
            sx={{
              color: '#10107B',
              fontSize: { xs: '24px', sm: '32px', md: '48px', lg: '64px' },
              fontWeight: '900',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Sign In
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            value={login}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="Remember Me"
            />
            <Link
              href="#"
              onClick={event => event.preventDefault()}
              sx={{ color: '#10107B', textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
              fontWeight: 'bold',
              backgroundColor: '#10107B',
            }}
          >
            Sign In
          </Button>
        </Box>
      )}
    </section>
  );
}

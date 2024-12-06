import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Input,
  InputLabel,
  Link,
  Modal,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useUserStore } from '../../app/store/useUserStore';
import { IUser } from '../../entities/types/IUser';
import useFetch from '../../shared/network/useFetch';

export default function Profile() {
  const location = useLocation();
  const path = location.pathname;
  const { user: userInfo, loading, login, refreshTokens } = useUserStore();
  const [user, setUserData] = useState<IUser>();
  const { fetchData } = useFetch<IUser>(
    'https://space-event.kenuki.org/security-service/api/user/profile',
  );
  const { fetchData: editUserData } = useFetch<any>(
    'https://space-event.kenuki.org/security-service/api/user/profile-update',
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      fetchData({
        headers: {
          Authorization: `Bearer ${userInfo?.tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }).then(response => {
        if (response) {
          setUserData(response);
        }
      });
    }
  }, [loading]);

  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>({ ...user });

  const handleClose = () => setOpen(false);

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSave = async () => {
    editUserData({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo?.tokens.accessToken}`,
      },
      body: JSON.stringify({
        phone: editUser.phoneNumber,
        lastName: editUser.lastName,
        firstName: editUser.firstName,
      }),
    }).then(res => {
      if (userInfo && res) {
        login(userInfo?.username, {
          accessToken: res.accessToken,
          refreshToken: userInfo?.tokens.refreshToken,
        });
      }
      window.location.reload();
      setOpen(false);
    });
  };

  return (
    <Box component="section" className={styles.profile}>
      <div className="container" style={{ padding: '0 20px' }}>
        <Box component="div" className={styles.profile__wrapper}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate('/')}
              >
                Dashboard
              </Link>
              <Typography sx={{ color: 'text.primary' }}>Profile</Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                Personal Info
              </Typography>
              <Button
                onClick={() => setOpen(true)}
                variant="outlined"
                color="primary"
                sx={{
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '30px',
                }}
              >
                Edit
              </Button>
            </Box>

            <Divider
              orientation="horizontal"
              flexItem
              sx={{
                background: '#10107b',
                marginBottom: '20px',
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {/* Email */}
              <InputLabel
                htmlFor="email"
                sx={{
                  fontSize: '16px',
                  color: '#555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'left', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                Email
                <Input
                  id="email"
                  sx={{
                    border: '1px solid #ccc',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    color: '#555',
                    '&.Mui-disabled': {
                      color: '#555',
                      borderColor: '#ccc',
                    },
                  }}
                  value={user?.email}
                  disabled
                  disableUnderline
                />
              </InputLabel>

              {/* First Name */}
              <InputLabel
                htmlFor="firstname"
                sx={{
                  fontSize: '16px',
                  color: '#555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'left', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                First Name
                <Input
                  id="firstname"
                  sx={{
                    border: '1px solid #ccc',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    color: '#555',
                    '&.Mui-disabled': {
                      color: '#555',
                      borderColor: '#ccc',
                    },
                  }}
                  value={user?.firstname}
                  disabled
                  disableUnderline
                />
              </InputLabel>

              {/* Last Name */}
              <InputLabel
                htmlFor="lastname"
                sx={{
                  fontSize: '16px',
                  color: '#555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'left', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                Last Name
                <Input
                  id="lastname"
                  sx={{
                    border: '1px solid #ccc',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    color: '#555',
                    '&.Mui-disabled': {
                      color: '#555',
                      borderColor: '#ccc',
                    },
                  }}
                  value={user?.lastname}
                  disabled
                  disableUnderline
                />
              </InputLabel>

              {/* Phone Number */}
              <InputLabel
                htmlFor="phoneNumber"
                sx={{
                  fontSize: '16px',
                  color: '#555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'left', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                Phone Number
                <Input
                  id="phoneNumber"
                  sx={{
                    border: '1px solid #ccc',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    color: '#555',
                    '&.Mui-disabled': {
                      color: '#555',
                      borderColor: '#ccc',
                    },
                  }}
                  value={user?.phoneNumber}
                  disabled
                  disableUnderline
                />
              </InputLabel>
            </Box>
          </Box>
        </Box>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Profile
          </Typography>
          <InputLabel>First Name</InputLabel>
          <Input
            name="firstName"
            value={editUser.firstname}
            onChange={handleChange}
            disableUnderline
            sx={{
              border: '1px solid black',
              padding: '5px 10px',
              borderRadius: '5px',
            }}
          />
          <InputLabel>Last Name</InputLabel>
          <Input
            name="lastName"
            value={editUser.lastname}
            onChange={handleChange}
            disableUnderline
            sx={{
              border: '1px solid black',
              padding: '5px 10px',
              borderRadius: '5px',
            }}
          />
          <InputLabel>Phone Number</InputLabel>
          <Input
            name="phoneNumber"
            value={editUser.phoneNumber}
            onChange={handleChange}
            disableUnderline
            sx={{
              border: '1px solid black',
              padding: '5px 10px',
              borderRadius: '5px',
            }}
          />
          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

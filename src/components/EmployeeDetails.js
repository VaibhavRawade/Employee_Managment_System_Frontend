import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Paper,
  Tooltip,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';
import useAuth from '../hooks/useAuth';
import { clearSession } from '../services/authService';
import ShieldIcon from '@mui/icons-material/Shield';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmailIcon from '@mui/icons-material/Email';

const Profile = () => {
  const navigate = useNavigate();
  const { authenticated: isLoggedIn, username: authUsername } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

const [employee, setEmployee] = useState(null);
  useEffect(() => {
    if (!isLoggedIn) setShowSnackbar(true);
  }, [isLoggedIn]);

  

useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const empId = sessionStorage.getItem("empId");
      console.log("Employee Id =", empId);

      const response = await fetch(
        `http://localhost:8082/api/employees/${empId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }

      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error("Failed to fetch employee", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployee();
}, []);




  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
          <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
            You must be logged in to view your profile.{' '}
            <span
              onClick={handleLoginRedirect}
              style={{
                color: '#3f51b5',
                textDecoration: 'underline',
                cursor: 'pointer',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => (e.target.style.color = '#f57c00')}
              onMouseLeave={e => (e.target.style.color = '#3f51b5')}
            >
              Login
            </span>
          </Alert>
        </Snackbar>
        <div style={{ height: 20 }}></div>
      </>
    );
  }

  if (loading) {
    return <LoadingOverlay message="Loading your profile…" />;
  }




  const profileData = {
  username: employee
    ? `${employee.firstName} ${employee.lastName}`
    : authUsername,
  age: employee?.age,
  department: employee?.department?.name,
  email: employee?.email,
};


  console.log(employee.imageName);

const avatarUrl = employee?.imageName
  ? `http://localhost:8082/images/${employee.imageName}`
  : '/OIP.jpg';



const email = profileData.email || '';

  const displayUsername = profileData.username.length > 22 ? `${profileData.username.slice(0, 20)}…` : profileData.username;
  const displayEmail = email.length > 34 ? `${email.slice(0, 32)}…` : email;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };


  const handleExportSnapshot = () => {
  const rows = [
    ['Employee ID', employee?.id],
    ['Name', profileData.username],
    ['Email', profileData.email],
    ['Department', profileData.department],
    ['Age', profileData.age],
    ['Generated At', new Date().toISOString()],
  ];

  const csv = ['Field,Value', ...rows.map(r => `"${r[0]}","${r[1]}"`)].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'employee-profile.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};



  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        paddingY: 6,
        px: { xs: 2, md: 4 },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Stack alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: 120, height: 120, border: '4px solid #1E3C72' }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    textAlign: 'center',
                  }}
                >
                  {displayUsername}
                </Typography>
                <Chip icon={<VerifiedUserIcon />} label="Authenticated" color="primary" variant="outlined" />
                <Tooltip title={email}>
                  <Chip
                    icon={<EmailIcon />}
                    label={displayEmail}
                    variant="outlined"
                    sx={{ maxWidth: '100%', '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 } }}
                  />
                </Tooltip>
                <Divider flexItem sx={{ my: 1 }} />
                <Button fullWidth variant="contained" startIcon={<LogoutIcon />} color="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 20px 55px rgba(15,23,42,0.12)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Your organization pulse
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderColor: '#1E3C72',
                    color: '#1E3C72',
                    '&:hover': { backgroundColor: '#1E3C72', color: '#fff', borderColor: '#1E3C72' },
                  }}
                  onClick={handleExportSnapshot}
                >
                  Export snapshot
                </Button>
              </Stack>
              <Divider sx={{ my: 2 }} />

                  

<Grid container spacing={2}>
  {[
    {
      label: 'Employee ID',
      value: employee?.id || '-',
      icon: <ShieldIcon color="primary" />,
    },
    {
      label: 'Department',
      value: employee?.department?.name || '-',
      icon: <AssessmentIcon color="primary" />,
    },
    {
      label: 'Age',
      value: employee?.age || '-',
      icon: <TimelineIcon color="primary" />,
    },
  ].map(item => (
    <Grid item xs={12} sm={4} key={item.label}>
      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7ff 100%)',
          boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {item.icon}
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {item.value}
          </Typography>
        </Stack>
        <Typography color="text.secondary">
          {item.label}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

            
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

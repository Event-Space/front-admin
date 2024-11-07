import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        padding: '20px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography>
        Copyright © 2024 - <span>Event Space</span>
      </Typography>
      <Typography>All rights reserved.</Typography>
    </Box>
  );
}

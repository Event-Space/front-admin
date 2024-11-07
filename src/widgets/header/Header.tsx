import { Box, Typography, IconButton } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { FullscreenButton } from '../../shared/ui';
import { useSidebar } from '../../app/store/useSidebar';

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="2"
    >
      <IconButton onClick={toggleSidebar}>
        <MenuOutlinedIcon />
      </IconButton>
      <Typography>Event Space</Typography>
      <FullscreenButton />
    </Box>
  );
}

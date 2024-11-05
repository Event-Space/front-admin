import { Box, IconButton, useTheme } from '@mui/material';
import { ColorModeContext } from '../../shared/theme/theme';
import { useContext } from 'react';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import FullscreenButton from '../../shared/ui/fullScreenButton/FullScreenButton';

export default function Header() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <Box display="flex" justifyContent="flex-end" p="2">
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <FullscreenButton />
      </Box>
    </Box>
  );
}

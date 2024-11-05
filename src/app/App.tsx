import { useState } from 'react';
import { ColorModeContext, useMode } from '../shared/theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import RootLayout from './layout/RootLayout';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';

export default function App() {
  const { theme, colorMode } = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RootLayout>
          <RouterProvider router={router} />
        </RootLayout>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

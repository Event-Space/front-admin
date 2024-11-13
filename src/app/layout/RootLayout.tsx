import { Outlet } from 'react-router-dom';
import { Footer, Header, SidebarW } from '../../widgets';
import { Box } from '@mui/material';

export default function RootLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarW />
      <Box sx={{ width: '100%' }}>
        <header className="header">
          <Header />
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </Box>
    </Box>
  );
}

import { Outlet } from 'react-router-dom';
import { Footer } from '../../widgets';

export default function RootLayout() {
  return (
    <div className="root-layout">
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

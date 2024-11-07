import { Outlet } from 'react-router-dom';
import { Footer, Header, SidebarW } from '../../widgets';

export default function RootLayout() {
  return (
    <div className="app">
      <SidebarW />
      <section className="app-content">
        <header className="header">
          <Header />
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </section>
    </div>
  );
}

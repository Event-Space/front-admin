import { Footer, Header, Sidebar } from '../../widgets';
import { FC, ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="root-layout">
      <Sidebar />
      <section>
        <header>
          <Header />
        </header>
        <main className="content">{children}</main>
        <footer>
          <Footer />
        </footer>
      </section>
    </div>
  );
};

export default RootLayout;

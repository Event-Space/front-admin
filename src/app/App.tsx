import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';
import { SidebarProvider } from './provider/SidebarProvider';
import '../shared/styles/index.css';

export default function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<>Loading...</>}>
        <RouterProvider router={router} />
      </Suspense>
    </SidebarProvider>
  );
}

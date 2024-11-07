import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';
import { SidebarProvider } from './provider/SidebarProvider';

export default function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<>Loading...</>}>
        <RouterProvider router={router} />
      </Suspense>
    </SidebarProvider>
  );
}

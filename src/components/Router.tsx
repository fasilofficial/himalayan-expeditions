import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ExpeditionsPage from '@/components/pages/ExpeditionsPage';
import ExpeditionDetailPage from '@/components/pages/ExpeditionDetailPage';
import GalleryPage from '@/components/pages/GalleryPage';
import AboutPage from '@/components/pages/AboutPage';
import ContactPage from '@/components/pages/ContactPage';
import AdminCmsPage from '@/components/pages/AdminCmsPage';
import { MemberProvider } from '@/integrations/members/providers';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'expeditions', element: <ExpeditionsPage /> },
      { path: 'expeditions/:id', element: <ExpeditionDetailPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'admin-cms', element: <AdminCmsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}

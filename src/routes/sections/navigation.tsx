import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { NavigationLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const InboxPage = lazy(() => import('src/pages/inbox'));
const ContactsPage = lazy(() => import('src/pages/contacts'));
const CustomersPage = lazy(() => import('src/pages/customers'));
const UsersSettingsPage = lazy(() => import('src/pages/settings/users'));
const InboxSettingsPage = lazy(() => import('src/pages/settings/inbox'));
const TemplatesSettingsPage = lazy(() => import('src/pages/settings/templates'));
const TagsSettingsPage = lazy(() => import('src/pages/settings/tags'));

// ----------------------------------------------------------------------

const layoutContent = (
  <NavigationLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </NavigationLayout>
);

export const navigationRoutes = [
  {
    path: '',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      {
        path: 'settings',
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          { path: 'users', element: <UsersSettingsPage /> },
          { path: 'inbox', element: <InboxSettingsPage /> },
          { path: 'templates', element: <TemplatesSettingsPage /> },
          { path: 'tags', element: <TagsSettingsPage /> },
        ],
      },
    ],
  },
];

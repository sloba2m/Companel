import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { NavigationLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

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
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];

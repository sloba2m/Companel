import { useState, useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import getKeycloak from 'src/utils/keycloakService';

import { useGetMe } from 'src/actions/account';

import { SplashScreen } from 'src/components/loading-screen';

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const keycloak = getKeycloak();
  useGetMe();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        if (!keycloak.authenticated) {
          const authenticated = await keycloak.init({
            onLoad: 'check-sso',
          });

          if (authenticated) setIsAuthenticated(true);
          else keycloak.login({ redirectUri: window.location.origin + pathname });
        } else setIsAuthenticated(true);
      } catch (error) {
        if (
          process.env.NODE_ENV === 'development' &&
          error.message === `A 'Keycloak' instance can only be initialized once.`
        ) {
          console.warn(`Strict mode problem: ${error.message}`);
        } else {
          console.error('Keycloak authentication failed:', error);
        }
      }
    };

    if (!isAuthenticated) initKeycloak();
  }, [pathname, isAuthenticated, keycloak]);

  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

import type { KeycloakInstance } from 'keycloak-js';

import Keycloak from 'keycloak-js';

let keycloakInstance: KeycloakInstance;

const getKeycloak = () => {
  if (!keycloakInstance) {
    keycloakInstance = new (Keycloak as any)({
      url: import.meta.env.VITE_KEYCLOAK_DOMAIN,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    });
  }
  return keycloakInstance;
};

export default getKeycloak;

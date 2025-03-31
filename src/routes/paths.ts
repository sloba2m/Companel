// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  INDEX: '',
  SETTINGS: '/settings',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  navigation: {
    root: ROOTS.INDEX,
    dashboard: `${ROOTS.INDEX}/dashboard`,
    inboxBase: `${ROOTS.INDEX}/inbox`,
    inbox: `${ROOTS.INDEX}/inbox?status=all&channel=all`,
    contacts: `${ROOTS.INDEX}/contacts`,
    customers: `${ROOTS.INDEX}/customers`,
    settings: {
      root: ROOTS.SETTINGS,
      users: `${ROOTS.SETTINGS}/users`,
      inbox: `${ROOTS.SETTINGS}/inbox`,
      templates: `${ROOTS.SETTINGS}/templates`,
      tags: `${ROOTS.SETTINGS}/tags`,
    },
  },
};

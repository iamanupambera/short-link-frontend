export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  links: {
    list: '/links',
    new: '/links/new',
    detail: (id: string | number) => `/links/${id}`,
    analytics: (id: string | number) => `/links/${id}/analytics`,
  },
  profile: '/profile',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
} as const;

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
    getMe: '/auth/get-me',
    updateDetails: '/auth/update-details',
    logout: '/auth/logout',
    changeProfilePicture: '/auth/change-profile-picture',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    resendVerificationMail: '/auth/resend-verification-mail',
  },
  links: {
    base: '/links',
    detail: (id: string | number) => `/links/${id}`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    link: (id: string | number) => `/analytics/${id}`,
  },
} as const;

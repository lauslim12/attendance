/**
 * All of the existent routes in the application.
 */
const routes = {
  // Public routes.
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',

  // Admin routes.
  admin: '/admin',
  attendances: '/admin/attendances',
  users: '/admin/users',

  // Utility routes.
  sitemap: '/sitemap.xml',
  robots: '/robots.txt',
  notFound: '/404',
  notAuthorized: '/401',
  forbidden: '/403',
} as const;

export default routes;

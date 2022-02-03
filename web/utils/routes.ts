/**
 * All of the existent routes in the application.
 */
const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  attendances: '/attendances',
  admin: '/admin',
  users: '/admin/users',
  sitemap: '/sitemap.xml',
  robots: '/robots.txt',
  notFound: '/404',
  notAuthorized: '/401',
  forbidden: '/403',
} as const;

export default routes;

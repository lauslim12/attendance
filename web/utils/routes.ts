/**
 * All of the existent routes in the application.
 */
const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  editProfile: '/profile/edit',
  attendances: '/attendances',
  admin: '/admin',
  users: '/admin/users',
  sitemap: '/sitemap.xml',
  robots: '/robots.txt',
} as const;

export default routes;

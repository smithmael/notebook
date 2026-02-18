// frontend/src/config/permissions.ts
export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', roles: ['ADMIN', 'OWNER', 'USER'] },
  { label: 'Browse Books', path: '/books', roles: ['ADMIN', 'OWNER', 'USER'] },
  { label: 'My Rentals', path: '/rentals', roles: ['USER'] },
  { label: 'Upload Book', path: '/owner/upload', roles: ['OWNER'] },
  { label: 'My Revenue', path: '/owner/revenue', roles: ['OWNER'] },
  { label: 'Manage Owners', path: '/admin/owners', roles: ['ADMIN'] },
  { label: 'Book Requests', path: '/admin/books', roles: ['ADMIN'] },
];
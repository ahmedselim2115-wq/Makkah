export const AVAILABLE_PERMISSIONS = [
  { key: 'dashboard.view', labelKey: 'perm_dashboard_view' },
  { key: 'dashboard.view_stats', labelKey: 'perm_dashboard_stats' },
  { key: 'products.create', labelKey: 'perm_products_create' },
  { key: 'products.edit', labelKey: 'perm_products_edit' },
  { key: 'products.delete', labelKey: 'perm_products_delete' },
  { key: 'categories.create', labelKey: 'perm_categories_create' },
  { key: 'categories.edit', labelKey: 'perm_categories_edit' },
  { key: 'categories.delete', labelKey: 'perm_categories_delete' },
  { key: 'showcase.manage', labelKey: 'perm_showcase_manage' },
  { key: 'orders.manage', labelKey: 'perm_orders_manage' },
  { key: 'ratings.manage', labelKey: 'perm_ratings_manage' },
  { key: 'whatsapp.manage', labelKey: 'perm_whatsapp_manage' },
  { key: 'users.manage', labelKey: 'perm_users_manage' },
  { key: 'settings.manage', labelKey: 'perm_settings_manage' },
] as const

export type PermissionKey = (typeof AVAILABLE_PERMISSIONS)[number]['key']
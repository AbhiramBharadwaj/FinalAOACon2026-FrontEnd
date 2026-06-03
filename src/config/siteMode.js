const envMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;

export const siteMode = {
  maintenance: envMaintenanceMode ? envMaintenanceMode === 'true' : false,
  title: 'Website Under Maintenance',
  message: 'We are making a few improvements right now. Please check back shortly.',
  contactEmail: 'support@aoacon2026.com',
};

// Export server functions
export { getOrganization, getUserOrganizations } from "./server";

// Export client object
export { clientOrganizations } from "./client";

// For backward compatibility
import { getOrganization, getUserOrganizations } from "./server";

export const serverOrganizations = {
  getOrganization,
  getUserOrganizations,
};

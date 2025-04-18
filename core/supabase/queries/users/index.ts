// Export types
export type { IUserProfile } from "./server";

// Export server functions
export { getUserProfile, updateUserProfile } from "./server";

// Export client object
export { clientUsers } from "./client";

// For backward compatibility
import { getUserProfile, updateUserProfile } from "./server";

export const serverUsers = {
    getUserProfile,
    updateUserProfile,
};

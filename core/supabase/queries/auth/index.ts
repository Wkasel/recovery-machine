// Import the functions we need
import { getSession, getUser, getUserById } from "./server";

// Re-export client auth queries
export { clientAuth } from "./client";

// Re-export server auth queries
export { getSession, getUser, getUserById };

// For backward compatibility with existing code
export const serverAuth = {
    getUser,
    getSession,
    getUserById,
};

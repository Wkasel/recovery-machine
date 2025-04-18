/**
 * Auth query keys
 */

export const authKeys = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
  profile: (userId: string) => ["auth", "profile", userId] as const,
};

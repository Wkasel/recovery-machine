"use client";

import { IUser } from "@/lib/types/auth";

/**
 * Client-safe auth utilities that don't directly import server actions
 */

export async function getUser(): Promise<IUser | null> {
  try {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      // Redirect to home page after sign out
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

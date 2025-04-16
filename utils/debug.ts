import { getSupabaseClient } from "@/services/supabase/clientFactory";
import { Logger } from "@/lib/logger/Logger";
import { CredentialResponse } from "google-one-tap";

interface DebugUtils {
  supabase: {
    getSession(): Promise<any>;
    getUser(): Promise<any>;
    dumpSessionInfo(): Promise<void>;
  };
  google: {
    getCredentials(): void;
    isSignedIn(): boolean;
    getUser(): void;
    signOut(): void;
  };
}

export async function initializeDebug() {
  if (typeof window === "undefined") return;
  if (!window.__env__?.NEXT_PUBLIC_SUPABASE_URL || !window.__env__?.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Logger.getInstance().error("Missing Supabase environment variables", {
      component: "DebugUtils",
    });
    return;
  }

  const supabase = await getSupabaseClient();

  window.__DEBUG__ = {
    supabase: {
      async getSession() {
        const result = await supabase.auth.getSession();
        Logger.getInstance().info("Current Session:", {
          component: "DebugUtils",
          data: result,
        });
        return result;
      },
      async getUser() {
        const result = await supabase.auth.getUser();
        Logger.getInstance().info("Current User:", {
          component: "DebugUtils",
          data: result,
        });
        return result;
      },
      async dumpSessionInfo() {
        Logger.getInstance().info("Supabase Auth Debug Info", {
          component: "DebugUtils",
        });
        const { data: sessionData } = await supabase.auth.getSession();
        Logger.getInstance().info("Session Data:", {
          component: "DebugUtils",
          data: sessionData,
        });
        const { data: userData } = await supabase.auth.getUser();
        Logger.getInstance().info("User Data:", {
          component: "DebugUtils",
          data: userData,
        });
      },
    },
    google: {
      getCredentials() {
        if (!window.google?.accounts?.id) {
          Logger.getInstance().error("Google Identity Services not initialized", {
            component: "DebugUtils",
          });
          return;
        }
        Logger.getInstance().info(
          "Google Client ID: " + window.__env__?.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          { component: "DebugUtils" }
        );
      },
      isSignedIn() {
        const credential = localStorage.getItem("googleCredential");
        Logger.getInstance().info("Has Google Credential: " + !!credential, {
          component: "DebugUtils",
        });
        return !!credential;
      },
      getUser() {
        const credential = localStorage.getItem("googleCredential");
        if (credential) {
          try {
            const decoded = JSON.parse(credential);
            Logger.getInstance().info("Google User:", {
              component: "DebugUtils",
              data: decoded,
            });
          } catch (e) {
            Logger.getInstance().error("Failed to parse Google credential:", {
              component: "DebugUtils",
              error: e,
            });
          }
        } else {
          Logger.getInstance().info("No Google user signed in", {
            component: "DebugUtils",
          });
        }
      },
      signOut() {
        localStorage.removeItem("googleCredential");
        Logger.getInstance().info("Cleared Google credentials", {
          component: "DebugUtils",
        });
      },
    },
  };

  Logger.getInstance().info(
    `\nDebug utilities initialized ✨\nAccess via window.__DEBUG__\n\nAvailable commands:\n- Supabase:\n  • window.__DEBUG__.supabase.getSession()\n  • window.__DEBUG__.supabase.getUser()\n  • window.__DEBUG__.supabase.dumpSessionInfo()\n\n- Google:\n  • window.__DEBUG__.google.getCredentials()\n  • window.__DEBUG__.google.isSignedIn()\n  • window.__DEBUG__.google.getUser()\n  • window.__DEBUG__.google.signOut()\n`,
    { component: "DebugUtils" }
  );
}

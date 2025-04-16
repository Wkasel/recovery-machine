// @ts-nocheck
console.log("Initializing debug utilities...");

function initializeDebug() {
  const getStorageKey = () => {
    if (!window.__env__?.NEXT_PUBLIC_SUPABASE_URL) return null;
    return (
      "sb-" + window.__env__.NEXT_PUBLIC_SUPABASE_URL.split("//")[1].split(".")[0] + "-auth-token"
    );
  };

  const decodeBase64 = (str) => {
    try {
      // Handle the special case where the string starts with 'base64-'
      const base64Str = str.startsWith("base64-") ? str.slice(7) : str;
      return decodeURIComponent(atob(base64Str));
    } catch (e) {
      return str;
    }
  };

  const getCookies = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key.startsWith("sb-")) {
        try {
          // Store both raw and decoded values
          acc[key] = {
            raw: value,
            decoded: decodeBase64(value),
          };
        } catch (e) {
          acc[key] = { raw: value, error: e.message };
        }
      }
      return acc;
    }, {});

    // Try to find and parse the main session cookie
    const mainKey = Object.keys(cookies).find(
      (k) =>
        k.endsWith("-auth-token") &&
        !k.endsWith(".0") &&
        !k.endsWith(".1") &&
        !k.includes("code-verifier")
    );

    if (mainKey && cookies[mainKey]) {
      try {
        cookies[mainKey].parsed = JSON.parse(cookies[mainKey].decoded);
      } catch (e) {
        console.error("Failed to parse session cookie:", e);
      }
    }

    return cookies;
  };

  window.__DEBUG__ = {
    supabase: {
      getSession() {
        console.group("Session Data Sources");

        // Check localStorage
        const key = getStorageKey();
        const localData = key ? localStorage.getItem(key) : null;
        console.log("localStorage:", key, localData ? JSON.parse(localData) : null);

        // Check cookies
        const cookies = getCookies();
        console.log("Cookies:", cookies);

        // Find the main session cookie
        const mainCookie = Object.entries(cookies).find(
          ([k, v]) =>
            k.endsWith("-auth-token") &&
            !k.endsWith(".0") &&
            !k.endsWith(".1") &&
            !k.includes("code-verifier")
        );

        console.log("Active Session:", mainCookie ? mainCookie[1].parsed : null);

        console.groupEnd();

        return {
          localStorage: localData ? JSON.parse(localData) : null,
          cookies,
          session: mainCookie ? mainCookie[1].parsed : null,
        };
      },
      getUser() {
        const { session } = this.getSession();
        return session?.user ?? null;
      },
      dumpSessionInfo() {
        console.group("Supabase Auth Debug Info");
        console.log("=".repeat(50));

        const { localStorage, cookies, session } = this.getSession();
        console.log("Active Session:", session);

        // Extract user from session
        const user = session?.user ?? null;
        console.log("User Data:", user);

        console.log("Storage Key:", getStorageKey());
        console.log("=".repeat(50));
        console.groupEnd();
      },
    },
    google: {
      getCredentials() {
        if (!window.google?.accounts?.id) {
          console.error("Google Identity Services not initialized");
          return;
        }
        console.log("Google Client ID:", window.__env__?.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
      },
      isSignedIn() {
        const credential = localStorage.getItem("googleCredential");
        console.log("Has Google Credential:", !!credential);
        return !!credential;
      },
      getUser() {
        const credential = localStorage.getItem("googleCredential");
        if (credential) {
          try {
            const decoded = JSON.parse(credential);
            console.log("Google User:", decoded);
          } catch (e) {
            console.error("Failed to parse Google credential:", e);
          }
        } else {
          console.log("No Google user signed in");
        }
      },
      signOut() {
        localStorage.removeItem("googleCredential");
        console.log("Cleared Google credentials");
      },
    },
  };

  console.log(`
Debug utilities initialized ✨
Access via window.__DEBUG__

Available commands:
- Supabase:
  • window.__DEBUG__.supabase.getSession()
  • window.__DEBUG__.supabase.getUser()
  • window.__DEBUG__.supabase.dumpSessionInfo()

- Google:
  • window.__DEBUG__.google.getCredentials()
  • window.__DEBUG__.google.isSignedIn()
  • window.__DEBUG__.google.getUser()
  • window.__DEBUG__.google.signOut()
`);
}

// Initialize when the script loads
initializeDebug();

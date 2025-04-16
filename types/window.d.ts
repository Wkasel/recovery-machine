declare global {
  interface Window {
    __DEBUG__?: {
      supabase: {
        getSession(): any;
        getUser(): any;
        dumpSessionInfo(): void;
      };
      google: {
        getCredentials(): void;
        isSignedIn(): boolean;
        getUser(): void;
        signOut(): void;
      };
    };
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
    __env__?: {
      NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
      NEXT_PUBLIC_SUPABASE_URL?: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
      [key: string]: string | undefined;
    };
  }
}

export {};

import { useState } from "react";
import { useAuth, useUser } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { HomeScreen } from "../screens/HomeScreen";

export function ClerkHome() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { startHostedAuth } = useHostedAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <HomeScreen
      auth={{
        keysConfigured: true,
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        busy,
        message,
        async onSignIn() {
          setBusy(true);
          setMessage(null);
          try {
            const result = await startHostedAuth({ mode: "sign-in" });
            if (!result.createdSessionId) {
              setMessage("Sign-in dismissed · no session. Soft HOLD.");
            }
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Clerk hosted sign-in failed closed.",
            );
          } finally {
            setBusy(false);
          }
        },
        async onSignOut() {
          setMessage(null);
          await signOut();
        },
      }}
    />
  );
}

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkHome } from "./src/auth/ClerkHome";
import { clerkAuthState } from "./src/auth/clerk";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  const { keysConfigured, publishableKey } = clerkAuthState();

  return (
    <SafeAreaProvider>
      {keysConfigured ? (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkHome />
        </ClerkProvider>
      ) : (
        <HomeScreen auth={{ keysConfigured: false }} />
      )}
    </SafeAreaProvider>
  );
}

import { ClerkProvider, ClerkLoaded, useUser } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Navbar from "../components/navbar";

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function LayoutWithNavbar() {
  const { isSignedIn, isLoaded } = useUser();
  return (
    <>
      <Slot />
      {isLoaded && isSignedIn && <Navbar />}
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkLoaded>
        <LayoutWithNavbar/>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

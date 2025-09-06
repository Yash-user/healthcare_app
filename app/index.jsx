import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import Login from "./login";
import Home from "./home";

export default function MyApp() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isSignedIn, isLoaded]);

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return null;
  }

  // Show login if user is not signed in
  if (!isSignedIn) {
    return <Login />;
  }

  return <Home />;
}

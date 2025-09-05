import { useRouter } from "expo-router";
import Login from "./login";

export default function MyApp() {
  const router = useRouter();

  return(
    <Login/>
  );
}
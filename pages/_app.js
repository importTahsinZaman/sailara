import "../styles/globals.css";
import { UserContext } from "../lib/context.js";
import { useUserData } from "../lib/hooks.js";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;

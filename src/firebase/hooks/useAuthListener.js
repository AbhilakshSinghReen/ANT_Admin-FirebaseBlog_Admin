import { useState, useEffect } from "react";
import { auth } from "../firebase";

export default function useAuthListener() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("authUser")));
  }, []);

  useEffect(() => {
    const authUserListener = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => authUserListener();
  }, [auth]);

  return { user };
}

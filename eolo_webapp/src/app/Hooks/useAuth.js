import { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/auth/authContext";
import { useRouter, usePathname } from "next/navigation";

const useAuth = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carga
  const [auth, setAuth] = useState(false); // Estado de autenticación

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setAuth(user?.isAuth);
    if (
      (pathname === "/analysis" ||
        pathname === "/analogues" ||
        pathname === "/report") &&
      !user.isAuth && !user.loading
    ) {
      router.push("/login");
    } else if (pathname === "/login" && user.isAuth && !loading) {
      router.push("/analogues");
    }
    setLoading(false);
  }, [user]);

  return { loading, auth, user };
};

export default useAuth;

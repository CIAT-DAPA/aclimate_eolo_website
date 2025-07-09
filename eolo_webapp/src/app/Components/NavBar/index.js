"use client";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./nav_bar.module.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AuthContext from "@/app/Context/auth/authContext";
import authTypes from "@/app/Context/auth/authTypes";
import { prefix } from "../basePath";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    dispatch({ type: authTypes.LOGOUT });
    router.push("/login");
  };

  const handleSubmitLogin = (e) => {
    router.push("/login");
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.nav_logo}>
        <Link className={styles.logo} href={"/"}>
          <Avatar src={`${prefix}/logo.png`} alt="navbar logo" />
          Eolo
        </Link>
      </div>
      <div className={styles.nav_menu}>
        <ul className={styles.nav_menu_ul}>
          {true ? (
            <>
              <li>
                <Link className={styles.link} href={"/analogues"}>
                  Análogos
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/analysis"}>
                  Análisis
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/report"}>
                  Reporte
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/external"}>
                  Herramientas
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/aboutus"}>
                  Acerca De
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/manual"}>
                  Manual
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
      <div className={styles.nav_acc}>
        {pathname !== "/login" && <div className={styles.vertical_line}></div>}
        {user.isAuth ? (
          <div className={styles.action_container}>

            <Button variant="contained" onClick={handleSubmit} style={{  marginLeft: "5%",backgroundColor: "#e37b13", width: "40%"}}>
              Salir
            </Button>
          </div>
        ) : pathname !== "/login" ? (
          <div className={styles.action_container}>
            <Button variant="contained" onClick={handleSubmitLogin} style={{marginLeft: "4%", width: "40%", backgroundColor: "#e37b13"}}>
              Login
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

"use client";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./nav_bar.module.css";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import AuthContext from "@/app/Context/auth/authContext";
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import authTypes from "@/app/Context/auth/authTypes";

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
          <Avatar src="/logo.png" alt="navbar logo" />
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
                <Link className={styles.link} href={"/visualizer"}>
                  Visualización
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/report"}>
                  Reporte
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
            <IconButton aria-label="user" color="primary">
              <PersonIcon />
            </IconButton>
            <Button variant="contained" onClick={handleSubmit}>
              Salir
            </Button>
          </div>
        ) : pathname !== "/login" ? (
          <div className={styles.action_container}>
            <Button variant="contained" onClick={handleSubmitLogin} style={{marginLeft: "4%", width: "40%"}}>
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

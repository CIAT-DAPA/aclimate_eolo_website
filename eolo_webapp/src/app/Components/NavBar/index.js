"use client"
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./nav_bar.module.css";
import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';
import Button from "@mui/material/Button"
import AuthContext from "@/app/Context/auth/authContext";
import authTypes from "@/app/Context/auth/authTypes";

const NavBar = () => {
  const router = useRouter()
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    dispatch({type: authTypes.LOGOUT})
    router.push('/login')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.nav_logo}>Eolo</div>
      <div className={styles.nav_menu}>
        <ul className={styles.nav_menu_ul}>
          <li>
            <Link className={styles.link} href={"/analogues"}>
              Analogos
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
        </ul>
      </div>
      <div className={styles.nav_acc}>
        <div className={styles.vertical_line}></div>
        <div className={styles.action_container}>
          <IconButton
            aria-label="user"
            color="primary"
          >
            <PersonIcon />
          </IconButton>
          <Button variant="contained" onClick={handleSubmit} >Salir</Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

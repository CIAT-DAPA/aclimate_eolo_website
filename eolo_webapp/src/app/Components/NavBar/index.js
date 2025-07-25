"use client";
import { useContext, useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    dispatch({ type: authTypes.LOGOUT });
    router.push("/login");
  };

  const handleSubmitLogin = (e) => {
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.nav_logo}>
        <Link className={styles.logo} href={"/"}>
          <Avatar src={`${prefix}/logo.png`} alt="navbar logo" />
          Eolo
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <div className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
        <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburger_open : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`${styles.nav_menu} ${isMobileMenuOpen ? styles.nav_menu_open : ''}`}>
        <ul className={styles.nav_menu_ul}>
          <li>
            <Link className={styles.link} href={"/analogues"} onClick={closeMobileMenu}>
              Análogos
            </Link>
          </li>
          {user.isAuth && (
            <>
              <li>
                <Link className={styles.link} href={"/analysis"} onClick={closeMobileMenu}>
                  Análisis
                </Link>
              </li>
              <li>
                <Link className={styles.link} href={"/report"} onClick={closeMobileMenu}>
                  Reporte
                </Link>
              </li>
            </>
          )}
          <li>
            <Link className={styles.link} href={"/external"} onClick={closeMobileMenu}>
              Herramientas
            </Link>
          </li>
          <li>
            <Link className={styles.link} href={"/aboutus"} onClick={closeMobileMenu}>
              Acerca De
            </Link>
          </li>
          <li>
            <Link className={styles.link} href={"/manual"} onClick={closeMobileMenu}>
              Manual
            </Link>
          </li>
          
          {/* Mobile auth buttons */}
          <li className={styles.mobile_auth_item}>
            {user.isAuth ? (
              <Button 
                variant="contained" 
                onClick={(e) => {handleSubmit(e); closeMobileMenu();}} 
                className={styles.mobile_auth_button}
                style={{backgroundColor: "#e37b13", color: "#fff"}}
              >
                Salir
              </Button>
            ) : pathname !== "/login" ? (
              <Button 
                variant="contained" 
                onClick={(e) => {handleSubmitLogin(e); closeMobileMenu();}} 
                className={styles.mobile_auth_button}
                style={{backgroundColor: "#e37b13", color: "#fff"}}
              >
                Login
              </Button>
            ) : null}
          </li>
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

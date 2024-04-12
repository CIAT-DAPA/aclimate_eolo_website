import Link from 'next/link'
import styles from "./nav_bar.module.css"

const NavBar = () => {
  return (
      <nav className={styles.nav}>
        <div className={styles.nav_logo}>
            Eolo
        </div>
        <div className={styles.nav_menu}>
            <ul className={styles.nav_menu_ul}>
                <li>
                    <Link className={styles.link} href={"/analogos"}>Analogos</Link>
                </li>
                <li>
                    <Link className={styles.link} href={"/visualizacion"}>Visualización</Link>
                </li>
                <li>
                    <Link className={styles.link} href={"/reporte"}>Reporte</Link>
                </li>
            </ul>
        </div>
        <div className={styles.nav_acc}>
            <div className={styles.vertical_line}></div>
            <div className={styles.action_container}>
              <div>Guenas</div>
              <button>Salir</button>
            </div>
            
        </div>
      </nav>
  )
}

export default NavBar

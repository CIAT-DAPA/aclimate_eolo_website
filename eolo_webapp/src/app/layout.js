import { Inter } from "next/font/google";
import NavBar from "@/app/Components/NavBar";
import Footer from "@/app/Components/Footer";
import "./globals.css";
import styles from "./analogues/page.module.css";
import Providers from "@/app/Components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eolo WebApp",
  description: "Herramienta de apoyo para la toma de decisiones climaticas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className={styles.princ_main}>
            <NavBar />
            {children}
            <Footer className={styles.footer} />
          </main>
        </Providers>
      </body>
    </html>
  );
}

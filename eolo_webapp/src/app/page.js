"use client";
import { useContext } from "react";
import AuthContext from "@/app/Context/auth/authContext";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
} from "@mui/material";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import styles from "./homepage.module.css";
import { prefix } from "./Components/basePath";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <Container maxWidth="xl" className={styles.container}>
      {/* Sección 1 */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        className={styles.section_1_container}
        style={{
          background: `linear-gradient(77deg, #000, hsla(0, 0%, 100%, .199)), url('${prefix}/homepage.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Grid item xs={12} md={6} className={styles.f_seccion_left}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {"Conoce Eolo"}
            </Typography>
            <Typography variant="p">
              {`¡Bienvenido a nuestra plataforma de revisión de pronósticos climáticos estacionales!

                Mejora tus pronósticos con análisis basados en años análogos, compara diferentes pronósticos y crea reportes climáticos detallados en minutos. 
                ¿Listo para llevar tus pronósticos al siguiente nivel? Únete a nosotros hoy mismo.
                `}
            </Typography>
          </Box>
          {user && user.isAuth && (
            <Button
              variant="contained"
              color="primary"
              className={styles.fseccion_button}
              onClick={(e) => router.push("/analogues")}
              style={{ backgroundColor: "#e37b13", alignSelf: "self-start" }}
            >
              Empezar
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Sección 3 */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        className={styles.last_part}
      >
        <Grid item xs={12} md={4}>
          <Card className={""}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={"100%"}
              p={2}
            >
              <Avatar className={styles.card_avatar}>
                <ThunderstormIcon />
              </Avatar>
            </Box>
            <CardContent className={styles.card_content_text}>
              <Typography variant="h5" component="h2" alignSelf={"center"}>
                Análogos
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={styles.card_text}
              >
                {`Descubre el poder de la predicción a través del tiempo con nuestra función de análisis basado en años análogos. Explora patrones climáticos pasados y encuentra similitudes con el presente para anticipar el futuro con mayor precisión.¡Da un paso adelante en tu comprensión del clima con nuestra herramienta de análisis basado en años análogos!`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={""}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={"100%"}
              p={2}
            >
              <Avatar className={styles.card_avatar}>
                <ThunderstormIcon />
              </Avatar>
            </Box>
            <CardContent className={styles.card_content_text}>
              <Typography variant="h5" component="h2" alignSelf={"center"}>
                Análisis
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={styles.card_text}
              >
                {`Compara, contrasta y toma decisiones informadas con nuestra función de análisis de pronósticos. Con nuestra herramienta, puedes visualizar fácilmente múltiples pronósticos estacionales lado a lado. Identifica tendencias, evalúa la consistencia entre diferentes modelos y mejora la confianza en tus decisiones climáticas. ¡Optimiza tu estrategia con nuestra herramienta de análisis de pronósticos!`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={""}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={"100%"}
              p={2}
            >
              <Avatar className={styles.card_avatar}>
                <ThunderstormIcon />
              </Avatar>
            </Box>
            <CardContent className={styles.card_content_text}>
              <Typography variant="h5" component="h2" alignSelf={"center"}>
                Reportes
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={styles.card_text}
              >
                {`Transforma tus datos en historias impactantes con nuestra función de creación de reportes climáticos. Desde resúmenes ejecutivos hasta análisis detallados, nuestra herramienta te permite generar informes y fácilmente comprensibles en cuestión de minutos. Con gráficos, mapas informativos y pronósticos a largo plazo, podrás comunicar de manera efectiva los eventos climáticos más relevantes. ¡Impulsa tu comunicación con nuestra potente herramienta de creación de reportes climáticos!`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;

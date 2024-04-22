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
  Avatar
} from "@mui/material";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import styles from "./homepage.module.css";

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
      >
        <Grid item xs={12} md={6} className={styles.f_seccion_left}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {"Conoce Eolo"}
            </Typography>
            <Typography variant="p">
              {
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sem nulla, dictum eget maximus vitae, interdum sed nibh. Sed nec imperdiet ipsum. Nunc rhoncus tincidunt arcu eget dictum. Nulla commodo, nulla eget pellentesque venenatis, lorem orci sagittis lectus, vitae maximus elit tellus eu tortor"
              }
            </Typography>
          </Box>
          {user && user.isAuth && (
            <Button
              variant="contained"
              color="primary"
              className={styles.fseccion_button}
              onClick={(e)=> router.push("/analogues")}
            >
              Empezar
            </Button>
          )}
        </Grid>
        <Grid item xs={12} md={6} className={styles.img_container}>
          <img
            src="https://d3h3bmeuj906e6.cloudfront.net/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-17-at-9.48.34-AM.jpeg.webp"
            alt="Homepage image"
            style={{ maxWidth: "80%", borderRadius: "6px" }}
          />
        </Grid>
      </Grid>

      {/* Sección 3 */}
      <Grid container spacing={4} justifyContent="center" className={""}>
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
            <CardContent>
              <Typography variant="h5" component="h2">
                Modulo de Análogos
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {
                  "Etiam sed eros vel orci feugiat aliquet nec in urna. Aenean eget rhoncus magna. Vestibulum ut aliquet nunc. Cras sagittis suscipit convallis"
                }
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
            <CardContent>
              <Typography variant="h5" component="h2">
                Modulo de Visualización
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {
                  "Etiam sed eros vel orci feugiat aliquet nec in urna. Aenean eget rhoncus magna. Vestibulum ut aliquet nunc. Cras sagittis suscipit convallis"
                }
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
            <CardContent>
              <Typography variant="h5" component="h2">
                Modulo de reportes
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {
                  "Etiam sed eros vel orci feugiat aliquet nec in urna. Aenean eget rhoncus magna. Vestibulum ut aliquet nunc. Cras sagittis suscipit convallis"
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;

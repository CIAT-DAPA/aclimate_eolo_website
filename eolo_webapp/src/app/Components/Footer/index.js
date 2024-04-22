import React from 'react';
import { AppBar, Toolbar, Typography, Grid, IconButton, Avatar } from "@mui/material/";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import styles from "./footer.module.css"


const Footer = () => {

  return (
      <Toolbar className={styles.toolbar}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} className={styles.column_container}>
          <Avatar src="/logo.png" alt="navbar logo" />
            <Typography variant="h5" color="inherit">
              Eolo
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} className={styles.column_container}>
            {/* Aquí va el contenido de la segunda columna */}
            <Typography variant="body1" color="inherit" align="center">
              © 2024 Eolo. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} className={styles.column_container}>
            {/* Aquí van los iconos de las redes sociales */}
            <IconButton color="inherit" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
  );
};

export default Footer;
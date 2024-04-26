import React from "react";
import { Toolbar, Typography, Grid, IconButton, Avatar } from "@mui/material/";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import styles from "./footer.module.css";
import { prefix } from "../basePath";

const Footer = () => {
  return (
    <Toolbar className={styles.toolbar}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} className={styles.column_container}>
          <Avatar src={`${prefix}/logo.png`} alt="navbar logo" />
          <Typography variant="h5" color="inherit">
            Eolo
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.column_container}>
          {/* Aquí va el contenido de la segunda columna */}
          <Typography variant="body1" color="inherit" align="center">
            © AClimate. Alliance Bioversity International & CIAT - All rights
            reserver
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.column_container}>
          <a target="_blank" href={"https://www.aclimate.org/"} className={styles.aclimate_link}>
            <Avatar color="inherit" aria-label="AClimate" className={styles.card_avatar}>
              <img
              className={styles.avatar_images}
                alt={"AClimate Web"}
                src={
                  "https://www.aclimate.org/static/media/Logo.4e27fd7d9947997ac1a2.png"
                }
              />
            </Avatar>
            <Typography variant="body1" color="inherit" align="center">
              AClimate
            </Typography>
          </a>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export default Footer;

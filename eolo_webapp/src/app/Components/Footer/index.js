import React from "react";
import { Typography, Avatar } from "@mui/material/";
import styles from "./footer.module.css";
import { prefix } from "../basePath";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.column_container}>
        <Avatar src={`${prefix}/logo.png`} alt="navbar logo" />
        <Typography variant="h5" color="inherit">
          Eolo
        </Typography>
      </div>
      <div className={styles.column_container}>
        <Typography variant="body1" color="inherit" align="center">
          © AClimate. Alliance Bioversity International & CIAT - All rights
          reserved
        </Typography>
      </div>
      <div className={styles.column_container}>
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
      </div>
    </div>
  );
};

export default Footer;

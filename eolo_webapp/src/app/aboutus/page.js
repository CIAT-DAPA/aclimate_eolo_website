import { Box, Typography } from "@mui/material";
import styles from "./aboutus.module.css";

const AboutUs = () => {
  return (
    <Box className={styles.main}>
      <Box>
        <Typography variant="h4">Sobre la herramienta</Typography>
        <Typography variant="body1" align="justify">
          {`EOLO es una herramienta diseñada para generar anomalías climáticas mediante la comparación de años análogos y datos históricos climáticos. Proporciona la capacidad de comparar diferentes pronósticos y generar reportes detallados del pronóstico seleccionado. EOLO permite a los usuarios analizar las variaciones climáticas y tomar decisiones informadas basadas en datos precisos y actualizados.`}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4">AgriLAC</Typography>
        <Typography variant="body1" align="justify">
          {`EOLO es el resultado del proyecto AgriLAC, una iniciativa que busca aumentar la resiliencia, sostenibilidad y competitividad de los sistemas agroalimentarios en América Latina y el Caribe. A través de AgriLAC, se ha desarrollado EOLO para brindar herramientas que mejoren la capacidad de respuesta a los cambios climáticos, facilitando el análisis y la comparación de pronósticos climáticos. Esto ayuda a los agricultores y a los responsables de políticas a planificar mejor sus actividades y a mitigar los riesgos asociados con el clima.`}
        </Typography>
        <a
          href="https://www.cgiar.org/initiative/agrilac-resiliente-espanol/"
          target="_blank"
          style={{textDecoration: "none"}}
        >
          <Typography variant="body1" align="justify">
            {`Conoce mas de AgriLAC aqui.`}
          </Typography>
        </a>
      </Box>
      <Box style={{ marginTop: "2%" }}>
        <Typography variant="h4">Socios</Typography>
        <Box className={styles.logos_container}>
          <a href="https://alliancebioversityciat.org/" target="_blank">
            <img
              className={styles.logos}
              src={`https://www.aclimate.org/images/alliance.png`}
            />
          </a>
          <a href="https://www.cimmyt.org/" target="_blank">
            <img
              className={styles.logos}
              src={`https://www.aclimate.org/images/cimmytImg.png`}
            />
          </a>
          <a href="http://cenaos.copeco.gob.hn/" target="_blank">
            <img
              className={styles.logos}
              src={`https://oceanexpert.org/uploads/institutes/22723/instituteLogo.jpg`}
            />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;

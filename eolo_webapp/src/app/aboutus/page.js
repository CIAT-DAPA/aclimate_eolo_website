import { Box, Typography } from "@mui/material";
import styles from "./aboutus.module.css";
import { prefix } from "../Components/basePath";

const AboutUs = () => {
  return (
    <Box className={styles.main}>
      <Box>
        <Typography variant="h4">Sobre la herramienta</Typography>
        <Typography variant="body1" align="justify">
          {`EOLO es una herramienta diseñada para apoyar la construcción de boletines climáticos.
Proporciona la capacidad de comparar diferentes pronósticos y generar reportes detallados del pronóstico
seleccionado a escala estacional. `}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4">AgriLAC</Typography>
        <Typography variant="body1" align="justify">
          {`EOLO es el resultado del proyecto AgriLAC, una iniciativa que busca aumentar la resiliencia, sostenibilidad y competitividad de los sistemas agroalimentarios en América Latina y el Caribe. A través de AgriLAC, se ha desarrollado EOLO para brindar herramientas al servicio meteorológico de Honduras (COPECO-CENAOS), considerando que las metodologías de pronóstico difieren en cada Servicio Meteorológico Nacional (SMN). EOLO mejora la capacidad de respuesta a la variabilidad climática natural, facilitando el análisis y la comparación de pronósticos estacionales, lo que contribuye a la adaptación climática.

Esto apoya el marco nacional de servicios climáticos, desde las instituciones generadoras de información hasta los distintos usuarios sectoriales. EOLO ayuda en la planificación y en el desarrollo de estrategias de adaptación y mitigación de los riesgos asociados a diversas amenazas climáticas, proporcionando un recurso vital para agricultores y responsables de políticas.`}
        </Typography>
        <a
          href="https://www.cgiar.org/initiative/agrilac-resiliente-espanol/"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Typography variant="body1" align="justify">
            {`Conoce mas de AgriLAC aqui.`}
          </Typography>
        </a>
      </Box>
      <Box style={{ marginTop: "2%" }}>
        <Typography variant="h4">Socios</Typography>
        <Box className={styles.logos_container}>
          <a
            href="https://alliancebioversityciat.org/"
            className={styles.a_logos}
            target="_blank"
          >
            <img
              className={styles.logos}
              src={`https://www.aclimate.org/images/alliance.png`}
            />
          </a>
          <a
            href="https://www.cimmyt.org/"
            className={styles.a_logos}
            style={{ margin: "0 40px" }}
            target="_blank"
          >
            <img
              className={styles.logos}
              src={`https://www.aclimate.org/images/cimmytImg.png`}
            />
          </a>
          <a
            href="http://cenaos.copeco.gob.hn/"
            className={styles.a_logos}
            style={{ margin: "0 40px" }}
            target="_blank"
          >
            <img
              className={styles.logos}
              src={`https://oceanexpert.org/uploads/institutes/22723/instituteLogo.jpg`}
            />
          </a>
          <a
            href="https://www.cgiar.org/initiative/agrilac-resiliente-espanol/"
            className={styles.a_logos}
            style={{ margin: "0 40px" }}
            target="_blank"
          >
            <img className={styles.logos} src={`${prefix}/agrilac_logo.jpg`} />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;

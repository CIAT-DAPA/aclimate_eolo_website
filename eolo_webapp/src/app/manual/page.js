import { Box, Typography } from "@mui/material";
import styles from "./manual.module.css";
import { prefix } from "../Components/basePath";

const AboutUs = () => {
  return (
    <Box className={styles.main}>
      <Box className={styles.container}>
        <Typography variant="h3">Manual de usuario</Typography>
      </Box>
      <Box className={styles.container}>
        <Typography variant="h4">Módulos de Eolo</Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`Eolo cuenta con 3 módulos principales:`}
        </Typography>
        <ul className={styles.list}>
          <li>Análogos</li>
          <li>Análisis</li>
          <li>Reporte</li>
        </ul>
        <Typography variant="body1" className={styles.text} align="justify">
          {`Para ingresar a estos módulos es necesario autenticarse por medio del login con el usuario y contraseña proporcionados por un administrador.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/loginReq.png`}
          alt="Login de Eolo"
        />
      </Box>

      <Box className={styles.container}>
        <Typography variant="h4">Módulo de Análogos</Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`El módulo de análogos es una herramienta que mejora la precisión de los pronósticos climáticos al identificar y analizar patrones climáticos pasados similares a los actuales. Sus funcionalidades principales incluyen:`}
        </Typography>
        <ul className={styles.list}>
          <li>
            <b>Promedio de Histórico Climático:</b> Calcula el promedio
            histórico de la precipitación desde el año 1981 al 2023 del mes
            seleccionado, para proporcionar una referencia de comportamientos
            históricos. Los resultados se visualizan en un mapa interactivo.
          </li>
          <li>
            <b>Consultar Históricos Climáticos:</b> Permite analizar datos
            históricos de precipitación observados para un mes y año
            específicos. Los datos se presentan en un mapa interactivo.
          </li>
          <li>
            <b>Anomalía Climática:</b> Utiliza el método de promedio de años
            análogos para evaluar desviaciones significativas en las condiciones
            climáticas respecto a la norma histórica. Emplea datos de CHIRPSv3
            beta y muestra anomalías normalizadas en un mapa interactivo.
          </li>
        </ul>
        <Typography variant="h5"><b>Guía de uso</b></Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`Para ingresar al módulo de Análogos debe estar autenticado por medio del login, una vez autenticado debe seguir estos pasos:`}
        </Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          1. Ingresar al módulo de Análogos, se puede ingresar por medio del
          enlace <a href="https://eolo.aclimate.org/analogues">Análogos</a> o
          por medio del menú interactivo de Eolo
        </Typography>
        <img
          className={styles.logos2}
          src={`${prefix}/AnaloguesMenu.png`}
          alt="How to enter to Analogues module"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`2.	Cuando se encuentre en el módulo, deberá seleccionar el mes el cual se desea comparar.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/Analogues.png`}
          alt="Analogues module"
        />
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesMonthSelection.png`}
          alt="Analogues module MonthSelectio"
        />
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesMonthSelection2.png`}
          alt="Analogues module MonthSelectio2"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`3.	Una vez seleccionado, se mostrará el mapa de promedio histórico para ese mes.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesClimatology.png`}
          alt="Analogues module Climatology"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`4.	Ahora deberá seleccionar el año que sea comparar en el visualizador de histórico climático`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesClimatology2.png`}
          alt="Analogues module Climatology 2"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`5.	Por último, deberá seleccionar los años análogos, con los cuales se generará el promedio y la anomalía normalizada`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesYears.png`}
          alt="Analogues module years selection"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`6.	Debe presionar el botón “CALCULAR” para generar el promedio y la anomalía normalizada`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnaloguesAnomalies.png`}
          alt="Analogues module anomalie"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`Todos estos mapas pueden descargarse tanto en formato .tif como en .png, por medio de los botones de la izquierda superior de cada mapa.`}
        </Typography>
        <Box style={{display:"flex"}}>
          <img
            className={styles.logos}
            src={`${prefix}/AnaloguesRaster.png`}
            alt="Analogues module download raster"
          />
          <img
            className={styles.logos}
            src={`${prefix}/AnaloguesPng.png`}
            alt="Analogues module download png"
          />
        </Box>
      </Box>
      <Box className={styles.container}>
        <Typography variant="h4">Módulo de Análisis</Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`El módulo de análisis permite comparar dos pronósticos, los cuales deben cargarse por medio de los botones de cada sección`}
        </Typography>
        <Typography variant="h5"><b>Guía de uso</b></Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`Para ingresar al módulo de Análisis debe estar autenticado por medio del login, una vez autenticado debe seguir estos pasos:`}
        </Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          1. Ingresar al módulo de Análisis, se puede ingresar por medio del
          enlace <a href="https://eolo.aclimate.org/analysis">Análisis</a> o por
          medio del menú interactivo de Eolo
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/Analysis.png`}
          alt="Analysis module"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`2.	Debe cargar un archivo raster (.tif) por medio de los botones 'CARGAR RASTER'`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisUploadRaster.png`}
          alt="Analysis upload raster"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`3.	Esto abrirá una ventana, en la cual deberá seleccionar el workspace vinculado al pronostico al cual pertenece el raster.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisWorkspace.png`}
          alt="Analysis workspace"
        />
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisWorkspace2.png`}
          alt="Analysis workspace 2"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`4.	Una vez seleccionado le permitirá seleccionar la capa a la cual pertenece el raster y las cuales se encuentran disponibles en el workspace seleccionado.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisLayer.png`}
          alt="Analysis layer"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`5.	Deberá cargargar un raster (.tif) el cual cumpla con el formato 'nombrearchivo_YYYYmm.tif', donde 'YYYY' representa el año y 'mm' representa el mes en formato numérico.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisInputFile.png`}
          alt="Analysis input file"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`6.	Una vez seleccionado podrá cargar el raster y visualizarlo en el módulo por medio del botón 'SUBIR AL GEOSERVER', deberá repetir estos pasos para el pronóstico numero 2`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/AnalysisGeoserver.png`}
          alt="Analysis geoserver"
        />
      </Box>
      <Box className={styles.container}>
        <Typography variant="h4">Módulo de Reporte</Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`El módulo de reportes facilita la generación de un PDF que incluye información detallada del pronóstico seleccionado. Este documento presenta gráficos, tablas y mapas que muestran los datos obtenidos tanto a nivel regional como específico para puntos de interés.`}
        </Typography>
        <Typography variant="h5"><b>Guía de uso</b></Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`Para ingresar al módulo de Reporte debe estar autenticado por medio del login, una vez autenticado debe seguir estos pasos:`}
        </Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          1. Ingresar al módulo de Reporte, se puede ingresar por medio del
          enlace <a href="https://eolo.aclimate.org/report">Reporte</a> o por
          medio del menú interactivo de Eolo
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/Report.png`}
          alt="Report module"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`2.	Antes de generar el reporte, deberá configurar el pronóstico que desea generar, primero debe seleccionar el tipo de pronóstico.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportForecastType.png`}
          alt="Report module forecast type"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`3.	Una vez seleccionado el tipo de pronóstico, deberá seleccionar el pronóstico el cual desea generar.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportForecast.png`}
          alt="Report module forecast"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`4.	Ahora deberá seleccionar el año al cual pertenece el pronóstico, esta lista de años solo mostrará los años disponibles que se hayan cargado previamente en el módulo de Análisis u otro medio al Geoserver.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportYear.png`}
          alt="Report module year"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`5.	Una vez seleccionado el año le permitirá seleccionar el mes disponible del año seleccionado.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportMonth.png`}
          alt="Report module month"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`6.	Para finalizar la configuración deberá cargar un archivo csv con los puntos de interés específicos.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportCsv.png`}
          alt="Report module csv"
        />
        <img
          className={styles.logos}
          src={`${prefix}/ReportCsv2.png`}
          alt="Report module csv 2"
        />
        <Typography variant="h6" align="justify">
          <b>Formato del csv</b>
        </Typography>
        <Typography variant="body1" className={styles.text} align="justify">
          {`El csv debe tener el siguiente formato, para realizar una carga exitosa.`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportCsvFormat.png`}
          alt="Report module csv format"
        />
        <ul className={styles.list}>
          <li>
            <b>Localidad:</b> Columna donde se encontrarán los nombres de las
            localidades a la cual corresponde la latitud y la longitud.
          </li>
          <li>
            <b>lat:</b> Columna que contiene la Latitud de la localidad.
          </li>
          <li>
            <b>lon:</b> Columna que contiene la Longitud de la localidad.
          </li>
        </ul>
        <Typography variant="body1" className={styles.text} align="justify">
          {`7.	Por último, deberá presionar el botón 'GENERAR PRONÓSTICO'`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportGenerate.png`}
          alt="Report module generate forecast"
        />
        <Typography variant="body1" className={styles.text} align="justify">
          {`8.	Esto generara el reporte del pronóstico seleccionado configurado. 
Tener en cuenta que el workspace de análogos no afectará el tipo de pronóstico que se seleccione.
Deberá seleccionar correctamente el tipo de pronóstico en caso de ser necesario.
Los pronostico estacionales deberán tener las 4 capas con su respectivo raster cargado para la fecha seleccionada, las capas son: 
`}
        </Typography>
        <ul className={styles.list}>
          <li>
            <b>Above:</b> Sobre lo normal
          </li>
          <li>
            <b>Below:</b> Bajo lo normal
          </li>
          <li>
            <b>Normal:</b> Normal
          </li>
          <li>
            <b>Dominant:</b> Dominante
          </li>
        </ul>
        <Typography variant="body1" className={styles.text} align="justify">
          {`También deberán tener cargado el pronóstico estacional de la temporada 1 y 2 en caso de ser trimestral, en caso de ser bimestral deberá tener disponible y cargadas las témporas 1, 2 y 3. 
Ejemplo:`}
        </Typography>
        <ul className={styles.list}>
          <li>
            <b>Trimestral:</b> Pronostico de Junio – Temporada Mayo/Junio/Julio
            y Temporada Agosto/Septiembre/Octubre
          </li>
          <li>
            <b>Bimestral:</b> Pronostico de Junio – Temporada Mayo/Junio
            Temporada Julio/Agosto, Temporada Septiembre/Octubre
          </li>
        </ul>
        <Typography variant="body1" className={styles.text} align="justify">
          {`9.	Para generar el PDF con los datos que se muestran en pantalla deberá presionar el botón de abajo 'DESCARGAR PDF'`}
        </Typography>
        <img
          className={styles.logos}
          src={`${prefix}/ReportPDF.png`}
          alt="Report module pdf"
        />
      </Box>
    </Box>
  );
};

export default AboutUs;

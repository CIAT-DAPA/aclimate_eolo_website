"use client";
import { Box, Typography, Divider } from "@mui/material";
import ResourceCard from "../Components/ResourceCard";

export default function ExternalResources() {
  return (
    <Box sx={{ p: 4, flex: 1  }}>
      {/* Sección 1: Información climática histórica */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#0d2137" }}>
        Información climática histórica
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
        <ResourceCard
          image="./fao.jpg"
          title="CHIRPS en FAO"
          description="Datos históricos de lluvia estimados (~5 km) por CHIRPS, disponible en el catálogo de FAO."
          link="https://data.apps.fao.org/catalog/dataset/5a1da03c-f980-4575-9420-123169f43a62/resource/d0115829-92b0-477d-aa34-2ed2fcd98e71"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección 2: Monitoreo y pronóstico de corto plazo */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#0d2137" }}>
        Información de monitoreo (tiempo real y pronóstico de 5 días)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
        <ResourceCard
          image="./windy.jpg"
          title="Windy (ECMWF, GFS, ICON)"
          description="Visualización del viento y condiciones meteorológicas en tiempo real con modelos globales."
          link="https://www.windy.com/?gfs,14.103,-87.214,5,p:cities"
        />
        <ResourceCard
          image="./CHIRPS-GEFS.png"
          title="CHIRPS-GEFS"
          description="Pronóstico global de precipitación a 5, 10 y 15 días por UC Santa Barbara."
          link="https://chc.ucsb.edu/data/chirps-gefs"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección 3: Pronóstico estacional */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#0d2137" }}>
        Información de pronóstico estacional (de 1 a 12 meses)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
        <ResourceCard
          image="./enso_iri.png"
          title="ENSO Quick Look"
          description="Pronóstico del fenómeno El Niño-Oscilación Sur por el IRI (Columbia University)."
          link="https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/?enso_tab=enso-sst_table"
        />
        <ResourceCard
          image="./iri_seasonal.png"
          title="IRI Forecasts"
          description="Pronóstico estacional multi-modelos de temperatura y precipitación."
          link="https://iri.columbia.edu/our-expertise/climate/forecasts/seasonal-climate-forecasts/"
        />
        <ResourceCard
          image="./nmme.png"
          title="NMME Forecasts"
          description="Pronóstico estacional basado en modelos norteamericanos (NMME)."
          link="https://www.cpc.ncep.noaa.gov/products/NMME/"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección 4: Ciclones tropicales */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#0d2137" }}>
        Monitoreo de ciclones tropicales
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
        <ResourceCard
          image="./nhc.png"
          title="National Hurricane Center"
          description="Información actualizada sobre ciclones tropicales en el Atlántico, Pacífico y el Caribe."
          link="https://www.nhc.noaa.gov/"
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Nota */}
      <Typography variant="body1" sx={{ fontStyle: "italic", color: "#444", textAlign: "center" }}>
        NOTA: Considere que estos enlaces son de apoyo y nunca pueden sustituir la información que proviene de las instituciones hondureñas: COPECO-CENAOS y SERNA-DRGH. De igual forma algunas de estas páginas están en inglés, favor usar herramientas de traducción.
      </Typography>
    </Box>
  );
}

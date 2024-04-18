// import Configuration from "@/app/config";
// import GeoTIFF, { fromArrayBuffer } from "geotiff";
// import { NextResponse } from "next/server";
// import axios from "axios";

// async function downloadRaster(url) {
//   const response = await fetch(url)
//   const data = await response.arrayBuffer();
//   const tiff = await fromArrayBuffer(data);
//   return tiff;
// }

// async function calculateAverage(rasters) {
//   const [firstTiff, ...restTiffs] = rasters;
//   const firstImage = await firstTiff.getImage();
//   const width = firstImage.getWidth();
//   const height = firstImage.getHeight();
//   const count = rasters.length;

//   const averageImage = firstImage
//   const averageData = new Float32Array(width * height);

//   for (let i = 0; i < height; i++) {
//     for (let j = 0; j < width; j++) {
//       let sum = 0;
//       for (let k = 0; k < count; k++) {
//         const image = await rasters[k].getImage();
//         const data = await image.readRasters({ window: [j, i, j + 1, i + 1] });
//         sum += data[0][0];
//       }
//       averageData[i * width + j] = sum / count;
//     }
//   }

//   await averageImage.writeRasters({ data: [averageData] });

//   return averageImage;
// }

// async function subtractRasters(raster1, raster2) {
//   const image1 = await raster1.getImage();
//   const image2 = await raster2.getImage();
//   const [data1] = await image1.readRasters();
//   const [data2] = await image2.readRasters();

//   const subtractedData = new Float32Array(data1.length);
//   for (let i = 0; i < data1.length; i++) {
//     if (data1[i] !== -9999 && data2[i] !== -9999) {
//       subtractedData[i] = data1[i] - data2[i];
//     } else {
//       subtractedData[i] = data1[i];
//     }
//   }

//   await image1.writeRasters({ data: [subtractedData] });

//   return image1;
// }

// export async function POST(req, res) {
//   const { selectedMonthC, multiSelectData } = await req.json();

//   const geoserverUrl = Configuration.get_geoserver_url();
//   const climatologyWorkspace = Configuration.get_climatology_worspace();
//   const historicalWorkspace = Configuration.get_historical_worspace();
//   const precStore = Configuration.get_prec_store();

//   const urlClimatology = `${geoserverUrl}${climatologyWorkspace}/ows?service=WCS&request=GetCoverage&version=2.0.1&coverageId=${precStore}&format=image/geotiff&subset=`;
//   const urlHistorical = `${geoserverUrl}${historicalWorkspace}/ows?service=WCS&request=GetCoverage&version=2.0.1&coverageId=${precStore}&format=image/geotiff&subset=`;

//   const rasters = await Promise.all(
//     multiSelectData.map(async (year) => {
//       const url = `${urlHistorical}Time("${year}-${selectedMonthC
//         .toString()
//         .padStart(2, "0")}-01T00:00:00.000Z")`;
//       return await downloadRaster(url);
//     })
//   );

//   const averageRaster = await calculateAverage(rasters);

//   const climatologyRaster = await downloadRaster(
//     `${urlClimatology}Time("2000-${selectedMonthC
//       .toString()
//       .padStart(2, "0")}-01T00:00:00.000Z")`
//   );

//   const resultRaster = await subtractRasters(averageRaster, climatologyRaster);

//   const wroteArrayBuffer = new NextResponse(resultRaster);
//   return wroteArrayBuffer
// }

// // export async function POST(req, res) {
// //   const { selectedMonthC, multiSelectData } = await req.json();

// //   const url_climatology = `${Configuration.get_geoserver_url()}${Configuration.get_climatology_worspace()}/ows?service=WCS&request=GetCoverage&version=2.0.1&coverageId=${Configuration.get_prec_store()}&format=image/geotiff&subset=`;
// //   const url_historical = `${Configuration.get_geoserver_url()}${Configuration.get_historical_worspace()}/ows?service=WCS&request=GetCoverage&version=2.0.1&coverageId=${Configuration.get_prec_store()}&format=image/geotiff&subset=`;
// //   const average = await tiffAverage(
// //     url_historical,
// //     multiSelectData,
// //     selectedMonthC
// //   );

// //   const response = await fetch(
// //     `${url_climatology}Time("2000-${selectedMonthC
// //       .toString()
// //       .padStart(2, "0")}-01T00:00:00.000Z")`
// //   );

// //   const data = await response.arrayBuffer();

// //   //Convertir los datos a un Float32Array
// //   const arrayBuffer = await fromArrayBuffer(data);
// //   const dataImage = await arrayBuffer.getImage();
// //   const dataTiff = await dataImage.readRasters();
// //   const { width, height } = dataTiff;
// //   if (dataTiff[0].length !== average.length) {
// //     console.log(
// //       "Los datos a restar no tienen la misma longitud que el promedio calculado."
// //     );
// //     return;
// //   }

// //   // Restar los valores en cada posición
// //   for (let i = 0; i < average.length; i++) {
// //     if (dataTiff[0][i] !== -9999 && average[i] !== -9999) {
// //       average[i] -= dataTiff[0][i];
// //     }
// //   }

// //   const values = average;
// //   const newTiff = new GeoTIFF({
// //     width: width,
// //     height: height,
// //     data: values, // Usa los datos procesados aquí
// //     imageLength: height,
// //     bitsPerSample: [32], // Bits por muestra, ajusta según tus datos
// //     sampleFormat: [3], // Formato de muestra, ajusta según tus datos
// //   });
// //   console.log(newTiff)
// //   //wroteArrayBuffer.headers.set('content-type', 'image/geotiff');
// //   return newTiff;
// // }

// // const tiffAverage = async (urlg, analoguesYears, month) => {
// //   const responses = await Promise.all(
// //     analoguesYears.map((year) =>
// //       fetch(
// //         `${urlg}Time("${year}-${month
// //           .toString()
// //           .padStart(2, "0")}-01T00:00:00.000Z")`,
// //         {
// //           //headers: {
// //           //  Authorization: `Basic ${btoa(`${geoserverUser}:${geoserverPassword}`)}`
// //           //}
// //         }
// //       ).then((response) => response.arrayBuffer())
// //     )
// //   );

// //   const allRasterArrays = [];

// //   for (const arrayBuffer of responses) {
// //     const tiff = await fromArrayBuffer(arrayBuffer);
// //     const image = await tiff.getImage();
// //     const data = await image.readRasters();
// //     allRasterArrays.push(data);
// //   }

// //   if (!allRasterArrays.length) {
// //     console.log("No se encontraron rasters para descargar.");
// //     return;
// //   }

// //   const sumArray = allRasterArrays.reduce((acc, currRasterObj) => {
// //     const curr = currRasterObj[0]; // Accede al Float32Array dentro del objeto
// //     for (let i = 0; i < acc.length; i++) {
// //       acc[i] += curr[i];
// //     }
// //     return acc;
// //   }, Array.from({ length: allRasterArrays[0][0].length }).fill(0)); // Asegúrate de utilizar la longitud del Float32Array

// //   // Calcular la cantidad total de años
// //   const totalYears = allRasterArrays.length;

// //   // Calcular el promedio de los valores en cada posición
// //   const averageArray = sumArray.map((val) => val / totalYears);

// //   return averageArray;
// // };

/** @type {import('next').NextConfig} */

let basePath = ""
let assetPrefix = ""

// if (process.env.NODE_ENV === 'production') {
//   basePath = "/aclimate_eolo_website"
//   assetPrefix = "/aclimate_eolo_website"
// }

const nextConfig = {
  basePath: basePath,
  assetPrefix: assetPrefix,
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;

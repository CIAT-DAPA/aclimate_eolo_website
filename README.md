# EOLO WebApp

EOLO is a tool designed to compare different types of forecasts. EOLO features modules for generating climate bulletins, comparing seasonal forecasts, and calculating anomalies. It enables meteorologists to assess different forecast models using the analogues years methodology and provides tools for creating climate reports. The system integrates data from sources like CHIRPS, AgERA5, and [AClimate](https://www.aclimate.org/) to support these processes.

## Features

- **Climate Bulletin Generation:** EOLO provides tools for creating detailed climate reports, consolidating information from various data sources.
- **Forecast Comparison:** Allows meteorologists to compare different seasonal forecast models using the analog years methodology.
- **Anomaly Generation:** Includes modules for calculating climate anomalies, highlighting significant variations in historical and projected data.

## Requirements

- Node.js >= 18.0
- npm >= 10.0

## Installation

To get started with the project, follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/CIAT-DAPA/aclimate_eolo_website
cd aclimate_eolo_website/eolo_webapp
```

2. Install dependencies:
   Make sure you have Node.js and npm installed. Then, run the following command to install the project dependencies

```sh
npm install
```

3. Run the development server:

```sh
npm run dev
```

## Deployment

Changes to the project are automatically deployed using GitHub Actions.

1. **Merge to Main:** When a pull request to the **main** branch is merged, the deployment process is triggered.

2. **Automatic Update:** The application is automatically updated and deployed to [EOLO](https://eolo.aclimate.org/).

## Documentation

For a detailed overview of the project, including system components and interactions, refer to the **Architecture Document**. This document provides insights into the design and structure of the project, helping you understand the overall system and its components.

const GEOSERVER_URL = "https://geo.aclimate.org/geoserver/";

//Workspaces
const NEXTGEN_WORSPACE = "fc_nextgen_hn";
const ANALOGUES_WORSPACE = "fc_analogues_hn";
const CENAOS_WORSPACE = "fc_cenaos_hn";
const ACLIMATE_WORSPACE = "fc_aclimate_hn";

const CLIMATOLOGY_DEP_WORKSPACE = "climate_historical_climatology";

const CLIMATOLOGY_WORSPACE = "climatology_hn";
const NEW_CLIMATOLOGY_WORSPACE = "climate_historical_climatology";
const HISTORICALC_WORSPACE = "historical_climate_hn";
const NEW_HISTORICALC_WORSPACE = "climate_historical_monthly";

const PREC_STORE = "climate_historical_climatology_hn_prec";
const PREC_MONTHLY_STORE = "climate_historical_monthly_hn_prec";
const TMAX_STORE = "TMAX";
const TMIN_STORE = "TMIN";

const BELOW_STORE = "below";
const NORMAL_STORE = "normal";
const ABOVE_STORE = "above";
const HIGPR_STORE = "highest_probability";

const DOMINANT_STORE = "highest_probability";

const ANOMALIES_STYLE = "style";

const API_URL_DEV = "http://127.0.0.1:5000/api/";

const API_URL_PROD = "https://geoapi.aclimate.org/api/";

const ACLIMATE_API_URL = "https://webapi.aclimate.org/api/";

const IGNORE_STORES = [
  "CA_Norte_Cabeceras",
  "style",
  "Limite_Departamental_de_Honduras",
  "admin_levels",
  "storename",
  "styles",
];

const SHAPEFILE_LAYER = "Limite_Departamental_de_Honduras";

const LAYER_FORMAT_CLIMATOLOGY = "climate_historical_climatology_hn_{dep}_prec";

class Configuration {
  get_geoserver_url() {
    return GEOSERVER_URL;
  }

  get_nextgen_worspace() {
    return NEXTGEN_WORSPACE;
  }
  get_analogues_worspace() {
    return ANALOGUES_WORSPACE;
  }
  get_cenaos_worspace() {
    return CENAOS_WORSPACE;
  }
  get_aclimate_worspace() {
    return ACLIMATE_WORSPACE;
  }
  get_climatology_worspace(newWorkspace = false) {
    if (newWorkspace) {
      return NEW_CLIMATOLOGY_WORSPACE;
    } else {
      return CLIMATOLOGY_WORSPACE;
    }
  }
  get_historical_worspace(newWorkspace = false) {
    if (newWorkspace) {
      return NEW_HISTORICALC_WORSPACE;
    } else {
      return HISTORICALC_WORSPACE;
    }
  }

  get_prec_monthly_store(){
    return PREC_MONTHLY_STORE
  }

  get_prec_store() {
    return PREC_STORE;
  }
  get_tmax_store() {
    return TMAX_STORE;
  }
  get_tmin_store() {
    return TMIN_STORE;
  }
  get_api_url() {
    return API_URL_PROD;
  }

  get_below_store() {
    return BELOW_STORE;
  }
  get_normal_store() {
    return NORMAL_STORE;
  }
  get_above_store() {
    return ABOVE_STORE;
  }
  get_hgp_store() {
    return HIGPR_STORE;
  }

  get_dominant_store() {
    return DOMINANT_STORE;
  }

  get_anomalies_style() {
    return ANOMALIES_STYLE;
  }

  get_aclimate_url() {
    return ACLIMATE_API_URL;
  }

  get_stores_to_ignore() {
    return IGNORE_STORES;
  }

  get_shapefile_layer_hn() {
    return SHAPEFILE_LAYER;
  }

  get_geoserver_url() {
    return GEOSERVER_URL;
  }

  get_woskpace_climatology_dep() {
    return CLIMATOLOGY_DEP_WORKSPACE;
  }

  get_layer_format() {
    return LAYER_FORMAT_CLIMATOLOGY;
  }
}

export default new Configuration();

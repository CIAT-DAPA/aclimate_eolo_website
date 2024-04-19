const GEOSERVER_URL = "https://geo.aclimate.org/geoserver/";

//Workspaces
const NEXTGEN_WORSPACE = "fc_nextgen_hn"
const ANALOGUES_WORSPACE = "fc_analogues_hn"
const CENAOS_WORSPACE = "fc_cenaos_hn"
const ACLIMATE_WORSPACE = "fc_aclimate_hn"

const CLIMATOLOGY_WORSPACE = "climatology_hn"
const HISTORICALC_WORSPACE = "historical_climate_hn"

const PREC_STORE = "PREC"
const TMAX_STORE = "TMAX"
const TMIN_STORE = "TMIN"

const BELOW_STORE = "below"
const NORMAL_STORE = "normal"
const ABOVE_STORE = "above"
const HIGPR_STORE = "highest_probability"

const API_URL_DEV = "http://127.0.0.1:5000/api/subtract_rasters"

const API_URL_PROD = "https://scalderon.pythonanywhere.com/api/subtract_rasters"


class Configuration {
    get_geoserver_url() {
        return GEOSERVER_URL;
    }

    get_nextgen_worspace(){
        return NEXTGEN_WORSPACE;
    }
    get_analogues_worspace(){
        return ANALOGUES_WORSPACE;
    }
    get_cenaos_worspace(){
        return CENAOS_WORSPACE;
    }
    get_aclimate_worspace(){
        return ACLIMATE_WORSPACE;
    }
    get_climatology_worspace(){
        return CLIMATOLOGY_WORSPACE;
    }
    get_historical_worspace(){
        return HISTORICALC_WORSPACE;
    }

    get_prec_store(){
        return PREC_STORE;
    }
    get_tmax_store(){
        return TMAX_STORE;
    }
    get_tmin_store(){
        return TMIN_STORE;
    }
    get_api_url(){
        return API_URL_PROD
    }

    get_below_store(){
        return BELOW_STORE
    }
    get_normal_store(){
        return NORMAL_STORE
    }
    get_above_store(){
        return ABOVE_STORE
    }
    get_hgp_store(){
        return HIGPR_STORE
    }

}

export default new Configuration();
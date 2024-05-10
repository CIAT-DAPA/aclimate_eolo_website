import { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Autocomplete,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import styles from "./modal.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Configuration from "@/app/config";
import AuthContext from "@/app/Context/auth/authContext";
import { toast } from "react-toastify";

const FileInputModal = ({ open, setCurrentLoading, handleClose, getDates, setStore, setMonth, setYear, setSelectForecast }) => {
  const { user } = useContext(AuthContext);
  const [selectStore, setSelectStore] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectFirstForecast, setSelectFirstForecast] = useState("");

  const [workspaces, setWorkspaces] = useState([
    { display: "NextGen", value: Configuration.get_nextgen_worspace() },
    { display: "AClimate", value: Configuration.get_aclimate_worspace() },
    {
      display: "Análogos Automatizado",
      value: Configuration.get_analogues_worspace(),
    },
    {
      display: "Análogos",
      value: Configuration.get_cenaos_worspace(),
    },
  ]);

  const handleSelectChangeW = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const notify = (text, type) => {
    if (type == "error") {
      toast.error(text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } else {
      toast(text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
  };

  const [stores, setStores] = useState([]);

  const handleSelectChange = (event, value) => setSelectStore(value);

  const getStores = async () => {
    setCurrentLoading(true)
    const username = user.user.user;
    const password = user.user.password;

    const url = `${Configuration.get_api_url()}get_geo_stores`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          passw: password,
          workspace: selectFirstForecast,
          geo_url: `${Configuration.get_geoserver_url()}rest/`,
        }),
      });

      if (!response.ok) {
        setCurrentLoading(false)
        notify("Error al obtener los stores del Geoserver", "error");
      }

      const data = await response.json();
      let body = data.body;
      const storesToIgnore = Configuration.get_stores_to_ignore();
      if (data.body.length > 0) {
        body = body.filter((item) => !storesToIgnore.includes(item));
      }
      setStores(body);
      setCurrentLoading(false)
    } catch (error) {
      setCurrentLoading(false)
      console.error("Error fetching GeoServer stores:", error);
    }
  };

  const uploadTiffToGeoServer = async () => {
    if (
      selectStore === "" ||
      selectedFile?.files?.length === 0 ||
      selectFirstForecast === ""
    ) {
      notify(
        "Debe seleccionar el workspace, la store y un archivo valido",
        "error"
      );
      return;
    }
    if (!selectedFile.name.endsWith(".tif")) {
      notify("El archivo seleccionado no es un archivo .tif.", "error");
      return;
    }
    setCurrentLoading(true);
    const url = `${Configuration.get_api_url()}import_geoserver`;

    const formData = new FormData();
    const username = user.user.user;
    const password = user.user.password;

    // Datos JSON
    const jsonData = {
      workspace: selectFirstForecast,
      user: username,
      passw: password,
      geo_url: `${Configuration.get_geoserver_url()}rest/`,
      store: selectStore,
    };
    formData.append("data", JSON.stringify(jsonData));

    formData.append("file", selectedFile);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setCurrentLoading(false);
        notify(`Error al guardar el raster ${data.error}`, "error");
        return;
      }
      await getStores();
      await getDates();
      setSelectForecast(selectFirstForecast)
      const split_date = selectedFile.name.split("_")[selectedFile.name.split("_").length -1].split(".")[0]
      selectedFile(null)
      setMonth(split_date.slice(-2))
      setYear(split_date.slice(0,4))
      setStore(selectStore)
      setCurrentLoading(false);
      notify(`El raster se guardo exitosamente`, "success");
    } catch (error) {
      setCurrentLoading(false);
      notify(`Error al guardar el raster`, "error");
    }
  };

  useEffect(() => {
    if (user && user.user && user.user.user && selectFirstForecast) {
      getStores();
    }
  }, [user,selectFirstForecast]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className={styles.modal_container}>
        <Box className={styles.accion_container}>
          <Typography
            variant="h5"
            id="modal-title"
            className={styles.modal_title}
          >
            Carga de rasters al Geoserver
          </Typography>
          <Typography variant="body1" id="modal-title">
            {`El archivo que elijas debe seguir el siguiente formato:
            'nombrearchivo_YYYYmm.tif', donde 'YYYY' representa el año y 'mm'
            representa el mes en formato numérico.`}
          </Typography>
          <Box className={styles.select_container}>
            <FormControl
              className={styles.info_inputs}
              sx={{ m: 1, minWidth: 120, width: "35%" }}
              size="small"
            >
              <InputLabel id="select_forecast1_hc">
                {"Seleccione el workspace"}
              </InputLabel>
              <Select
                labelId="select_forecast1_hc"
                input={
                  <OutlinedInput
                    label={"Seleccione el workspace"}
                    value={selectFirstForecast}
                    onChange={handleSelectChangeW(setSelectFirstForecast)}
                  />
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {workspaces.map((d) => (
                  <MenuItem key={d.value} value={d.value}>
                    {d.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 60, width: "40%" }} size="small">
              <Autocomplete
                id="autocomplete"
                value={selectStore}
                onChange={handleSelectChange}
                disabled={!selectFirstForecast}
                freeSolo
                autoSelect
                options={stores}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecciona o escriba una store"
                  />
                )}
              />
            </FormControl>
          </Box>
          <Typography variant="body1">{"Seleccione el raster"}</Typography>
          <Box
            border={1}
            borderRadius={2}
            borderColor="grey.400"
            p={2}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={styles.drag_drop}
          >
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".tif"
            />
            <Typography
              style={{ whiteSpace: "break-spaces", textAlign: "center" }}
              variant="h6"
            >{`Arrastre el archivo .tif \n o`}</Typography>

            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                style={{
                  backgroundColor: "#e37b13",
                  color: "#ffff",
                  borderRadius: "6px",
                }}
              >
                Seleccione el archivo
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2">
                Archivo seleccionado: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </Box>

        <Box className={styles.button_container}>
          <Button
            variant="contained"
            style={{
              width: "35%",
              backgroundColor: "#7c8b9d",
              color: "#ffff",
              height: "42px",
              borderRadius: "6px",
            }}
            sx={{ mt: 3 }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            sx={{ mt: 3 }}
            style={{
              width: "35%",
              backgroundColor: "#e37b13",
              color: "#ffff",
              height: "42px",
              borderRadius: "6px",
            }}
            onClick={uploadTiffToGeoServer}
          >
            Subir al geoserver
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FileInputModal;

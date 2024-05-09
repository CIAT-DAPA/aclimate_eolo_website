import { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Autocomplete,
} from "@mui/material";
import styles from "./modal.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Configuration from "@/app/config";
import AuthContext from "@/app/Context/auth/authContext";
import { toast } from "react-toastify";

const FileInputModal = ({ open, setCurrentLoading, handleClose, getDates }) => {
  const { user } = useContext(AuthContext);
  const [selectStore, setSelectStore] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
          workspace: Configuration.get_cenaos_worspace(),
          geo_url: `${Configuration.get_geoserver_url()}rest/`,
        }),
      });

      if (!response.ok) {
        notify("Error al obtener los stores del Geoserver", "error");
      }

      const data = await response.json();
      let body = data.body;
      const storesToIgnore = Configuration.get_stores_to_ignore();
      if (data.body.length > 0) {
        body = body.filter((item) => !storesToIgnore.includes(item));
      }
      setStores(body);
    } catch (error) {
      console.error("Error fetching GeoServer stores:", error);
    }
  };

  const uploadTiffToGeoServer = async () => {
    if (selectStore === "" || selectedFile?.files?.length === 0) {
      notify("Debe seleccionar la store y un archivo valido", "error");
      return;
    }
    if (!selectedFile.name.endsWith(".tif")) {
      notify("El archivo seleccionado no es un archivo .tif.", "error");
      return;
    }
    setCurrentLoading(true)
    const url = `${Configuration.get_api_url()}import_geoserver`;

    const formData = new FormData();
    const username = user.user.user;
    const password = user.user.password;

    // Datos JSON
    const jsonData = {
      workspace: Configuration.get_cenaos_worspace(),
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
        notify(`Error al guardar el raster ${data.error}`, "error");
        return;
      }
      await getStores()
      await getDates()
      setCurrentLoading(false)
      notify(`El raster se guardo exitosamente`, "success");
    } catch (error) {
      setCurrentLoading(false)
      notify(`Error al guardar el raster`, "error");
    }
  };

  useEffect(() => {
    if (user && user.user && user.user.user) {
      getStores();
    }
  }, [user]);

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
          <FormControl sx={{ m: 1, minWidth: 60, width: "40%" }} size="small">
            <Autocomplete
              id="autocomplete"
              value={selectStore}
              onChange={handleSelectChange}
              freeSolo
              autoSelect
              options={stores}
              renderInput={(params) => (
                <TextField {...params} label="Selecciona o escriba una store" />
              )}
            />
          </FormControl>
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

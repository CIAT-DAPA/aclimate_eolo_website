import { useState, useContext, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import styles from "./modal.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Configuration from "@/app/config";
import AuthContext from "@/app/Context/auth/authContext";
import { toast } from "react-toastify";

const FileInputModal = ({ open, handleOpen, handleClose }) => {
  const { user } = useContext(AuthContext);
  const [textInput, setTextInput] = useState("");
  const [selectStore, setSelectStore] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

  const handleSelectChange = (event) => setSelectStore(event.target.value);

  const getStores = async () => {
    const geoserverUrl = Configuration.get_geoserver_url();
    const username = user.user.user;
    const password = user.user.password;

    const basicAuth = btoa(`${username}:${password}`);
    const url = `${geoserverUrl}/rest/workspaces/${Configuration.get_cenaos_worspace()}/datastores.json`;

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (!response.ok) {
        console.log("try")
      }

      const data = await response.json();
      const dataStores = data.dataStores.dataStores.map((s) => s.name);
      setStores(dataStores);
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
    const geoserverUrl = Configuration.get_geoserver_url();
    const username = user.user.user;
    const password = user.user.password;

    const basicAuth = btoa(`${username}:${password}`);
    const uploadUrl = `${geoserverUrl}/rest/workspaces/${Configuration.get_cenaos_worspace()}/coveragestores/${selectStore}/file.geotiff`;

    const formData = new FormData();
    formData.append("file", tiffFile, tiffFile.name);

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
        body: formData,
      });

      if (!response.ok) {
        notify(`Error al guardar el raster`, "error");
      }

      notify(`El raster se guardo exitosamente`, "success");
    } catch (error) {
      notify(`Error al guardar el raster`, "error");
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className={styles.modal_container}>
        <Typography
          variant="h5"
          id="modal-title"
          className={styles.modal_title}
        >
          Carga de rasters al Geoserver
        </Typography>
        <Box className={styles.accion_container}>
          <FormControl sx={{ m: 1, minWidth: 60, width: "30%" }} size="small">
            <InputLabel id="select_month">{"Seleccione la store"}</InputLabel>
            <Select
              labelId="select_month"
              input={
                <OutlinedInput
                  label={"Seleccione la store"}
                  value={selectStore}
                  onChange={handleSelectChange}
                />
              }
            >
              {stores.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".tif"
            />
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
                Seleccionar el archivo
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

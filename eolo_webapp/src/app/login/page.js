"use client";
import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContext from "../Context/auth/authContext";
import authTypes from "../Context/auth/authTypes";
import { useRouter } from "next/navigation";
import Configuration from "@/app/config";
import useAuth from "../Hooks/useAuth";
import LoadingOverlay from "../Components/LoadingOverlay";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.aclimate.org/">
        AClimate
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { loading, auth } = useAuth();
  const [error, setError] = useState(false);
  const [currentLoading, setCurrentLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCurrentLoading(true)
    const data = new FormData(event.currentTarget);
    const user = data.get("user");
    const passw = data.get("password");

    const url = `${Configuration.get_aclimate_url()}Account/Login`;

    const params = {
      email: user,
      password: passw,
    };

    // Convertir el objeto a formato JSON
    const queryString = Object.keys(params)
      .map((key) => encodeURIComponent(params[key]))
      .join("/");
    const fullUrl = url + "/" + queryString;

    // Configurar las opciones de la solicitud
    const requestOptions = {
      method: "GET", // Método GET
      headers: {
        "Content-Type": "application/json", // Tipo de contenido (en este caso, JSON)
      },
    };

    const response = await fetch(fullUrl, requestOptions);
    setCurrentLoading(false)
    const payload = {
      user: {
        user: user,
        password: passw,
      },
    };
    if (response.ok) {
      setError(false)
      dispatch({ type: authTypes.LOGIN, payload });
      router.push("/analogues");
    } else {
      setError(true)
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Bienvenido
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="Usuario"
              name="user"
              autoComplete="user"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error && <Alert severity="warning">{"Usuario o contraseña incorrecto"}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#e37b13"}}
            >
              Ingresar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        {currentLoading && <LoadingOverlay />}
      </Container>
    </ThemeProvider>
  );
}

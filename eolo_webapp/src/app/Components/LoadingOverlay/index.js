import { CircularProgress, Backdrop } from "@mui/material/";
import styles from "./loading_overlay.module.css";

const LoadingOverlay = ({ loadingText }) => {
  return (
    <Backdrop className={styles.backdrop} open={true}>
      <CircularProgress color="inherit" />
      {loadingText && <div>{loadingText}</div>}
    </Backdrop>
  );
};

export default LoadingOverlay;

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = (height='100vh') => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height }}>
      <CircularProgress />
    </Box>
  );
};

export default Loading
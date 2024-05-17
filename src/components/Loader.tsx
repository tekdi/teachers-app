import { Backdrop, CircularProgress, Typography } from '@mui/material';
import React from 'react';

const Loader: React.FC<{ showBackdrop: boolean; loadingText: string }> = ({
  showBackdrop,
  loadingText = '',
}) => {
  const Spinner = () => {
    return (
      <>
        <CircularProgress color="inherit" />
        <br />
        <Typography variant="h2">{loadingText}...</Typography>
      </>
    );
  };

  return (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
        }}
        open={showBackdrop}
      >
        <Spinner />
      </Backdrop>
      {!open && <Spinner />}
    </>
  );
};

export default Loader;

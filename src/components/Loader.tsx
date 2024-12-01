import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "next-i18next";


const Loader: React.FC<{ showBackdrop: boolean; loadingText?: string }> = ({
  showBackdrop,
  loadingText
}) => {
  const { t } = useTranslation();

  const Spinner = () => {
    return (
      <>
        <CircularProgress color="inherit" />
        <br />
        <Typography variant="h2">{t(loadingText ?? "COMMON.LOADING")}...</Typography>
      </>
    );
  };

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={showBackdrop}
      >
        <Spinner />
      </Backdrop>
      {!showBackdrop && <Spinner />}
    </>
  );
};

export default Loader;

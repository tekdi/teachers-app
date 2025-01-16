import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";

const Loader: React.FC<{ showBackdrop: boolean; loadingText?: string }> = ({
  showBackdrop,
  loadingText,
}) => {
  const { t } = useTranslation();

  const spinnerContent = useMemo(
    () => (
      <>
        <CircularProgress color="inherit" />
        <br />
        <Typography variant="h2">{t(loadingText ?? "COMMON.LOADING")}...</Typography>
      </>
    ),
    [loadingText, t] // Dependencies: re-compute only when these change
  );

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
        {spinnerContent}
      </Backdrop>
      {!showBackdrop && <>{spinnerContent}</>}
    </>
  );
};

export default Loader;

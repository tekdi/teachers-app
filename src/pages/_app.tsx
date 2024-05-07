'use client';

import '@/styles/globals.css';

import * as React from 'react';

import { ThemeProvider, useTheme } from '@mui/material/styles';

import type { AppProps } from 'next/app';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import customTheme from '../styles/customStyles';
import darkTheme from '@/styles/darkStyle';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export function DarkTheme() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
      }}
    >
      {/* {theme.palette.mode} mode */}
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = React.useState('light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={mode === 'light' ? customTheme : darkTheme}>
        {/* <DarkTheme /> */}
        <Component {...pageProps} />;
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

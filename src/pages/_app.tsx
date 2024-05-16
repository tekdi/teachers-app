'use client';

import '@/styles/globals.css';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  useTheme,
} from '@mui/material/styles';
import * as React from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import customTheme from '../styles/customStyles';

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

function App({ Component, pageProps }: AppProps) {

  function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    return (
      <Button
        onClick={() => {
          setMode(mode === 'light' ? 'dark' : 'light');
        }}
      >
        {mode === 'light' ? 'Turn dark' : 'Turn light'}
      </Button>
    );
  }
  return (
    <CssVarsProvider theme={customTheme}>
      <ModeToggle />
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}

export default appWithTranslation(App);

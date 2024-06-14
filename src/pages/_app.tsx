'use client';

import '@/styles/globals.css';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  useTheme,
} from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { Poppins } from 'next/font/google';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import customTheme from '../styles/customStyles';
import { telemetryFactory } from '../utils/telemetry';
import { useRouter } from 'next/router';
import { initGA, logPageView } from '../utils/googleAnalytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fallback: ['sans-serif'],
  subsets: ['latin'],
});
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
  const router = useRouter();
  useEffect(() => {
    telemetryFactory.init();
  }, []);

  useEffect(() => {
    // Initialize GA only once
    if (!window.GA_INITIALIZED) {
      initGA(`${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`);
      window.GA_INITIALIZED = true;
    }

    const handleRouteChange = (url: string) => {
      const windowUrl = url;

      const cleanedUrl = windowUrl.replace(/^\//, '');

      const telemetryImpression = {
        context: {
          env: cleanedUrl,
          cdata: [],
        },
        edata: {
          id: cleanedUrl,
          type: 'VIEW',
          subtype: '',
          pageid: cleanedUrl,
          uid: localStorage.getItem('userId') || 'Anonymous',
        },
      };
      telemetryFactory.impression(telemetryImpression);

      logPageView(url);
      
    };

    // Log initial page load
    handleRouteChange(window.location.pathname);

    // Subscribe to route changes and log page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the subscription on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
    <>
      <style jsx global>{`
        html {
          font-family: ${poppins.style.fontFamily} !important;
        }
      `}</style>
      <CssVarsProvider theme={customTheme}>
        {/* <ModeToggle /> */}
        <Container maxWidth="md" style={{ padding: 0 }}>
          <Component {...pageProps} />
          <ToastContainer position="bottom-left" autoClose={3000} stacked={false} />
        </Container>
      </CssVarsProvider>
    </>
  );
}

export default appWithTranslation(App);

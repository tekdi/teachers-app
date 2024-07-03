'use client';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';

import * as React from 'react';

import { Button, Container } from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  useTheme,
} from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initGA, logPageView } from '../utils/googleAnalytics';

import type { AppProps } from 'next/app';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Head from 'next/head';
import IconButton from '@mui/material/IconButton';
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { appWithTranslation } from 'next-i18next';
import customTheme from '../styles/customTheme';
import { telemetryFactory } from '../utils/telemetry';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const queryClient = new QueryClient();
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
  const Login = router.pathname === '/login';
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
      <Head>
        <title>Pratham SCP Teachers app</title>
      </Head>
      <CssVarsProvider theme={customTheme}>
        {/* <ModeToggle /> */}
        <Box
          sx={{
            padding: '0',
            '@media (min-width: 900px)': {
              width: !Login ? '76.5%' : '100%',
              marginLeft: !Login ? '351px' : '0',
            },
            '@media (min-width: 1600px)': {
              width: '100%',
              marginLeft: !Login ? '351px' : '0',
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            stacked={false}
          />
        </Box>
      </CssVarsProvider>
    </>
  );
}

export default appWithTranslation(App);

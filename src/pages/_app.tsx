'use client';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import * as React from 'react';

import { Button } from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  useTheme,
} from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initGA, logPageView } from '../utils/googleAnalytics';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { UserConfig, appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { fullWidthPages } from '../../app.config';
import nextI18NextConfig from '../../next-i18next.config.js';
import customTheme from '../styles/customTheme';
import { telemetryFactory } from '../utils/telemetry';
import { Telemetry } from '@/utils/app.constant';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fallback: ['sans-serif'],
  subsets: ['latin'],
});

const emptyInitialI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
  },
};

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
  const [client] = React.useState(new QueryClient(
    {
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24, // 24 hours
          staleTime: 1000 * 60 * 60 * 24, // 24 hours
        },
      },
    }
  ))
  const router = useRouter();
  const isFullWidthPage = fullWidthPages.includes(router.pathname);
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
          type: Telemetry.VIEW,
          subtype: '',
          pageid: cleanedUrl,
          uri:''
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
              width: !isFullWidthPage ? 'calc(100% - 22rem)' : '100%',
              marginLeft: !isFullWidthPage ? '351px' : '0',
            },
            '@media (min-width: 2000px)': {
              width: '100%',
              marginLeft: !isFullWidthPage ? '351px' : '0',
            },
          }}
        >
          <QueryClientProvider client={client}>
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

export default appWithTranslation(App, emptyInitialI18NextConfig);

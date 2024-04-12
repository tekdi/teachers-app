import { ThemeProvider } from '@mui/material/styles';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import customTheme from '../styles/customStyles';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <Component {...pageProps} />;
    </ThemeProvider>
  );
}

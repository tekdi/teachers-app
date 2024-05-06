// import Head from 'next/head';
// import Image from 'next/image';
// import { Inter } from 'next/font/google';
// import styles from '@/styles/Home.module.css';
import LoginPage from './LoginPage';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';

// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  console.log(
    'process.env.NEXT_PUBLIC_ANALYTICS_ID',
    process.env.NEXT_PUBLIC_ANALYTICS_ID
  );
  return (
    <>
      <I18nextProvider i18n={i18n}>
      <LoginPage />
      </I18nextProvider>
    </>
  );
}

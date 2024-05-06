import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';
import Login from './Login';

// const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  console.log('hi');
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <Login />
      </I18nextProvider>
    </>
  );
}

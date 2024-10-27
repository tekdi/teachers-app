import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Draft = dynamic(() => import('editor/Draft'), { ssr: false });

const draft = () => {
  return <Draft />;
};

export default draft;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

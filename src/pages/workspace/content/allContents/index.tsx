import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Content = dynamic(() => import('editor/Content'), { ssr: false });

const content = () => {
  return <Content />;
};

export default content;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

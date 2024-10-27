import React from 'react';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// @ts-ignore
const UploadEditor = dynamic(() => import('editor/UploadEditor'), {
  ssr: false,
});

const Editor = () => {
  return <UploadEditor />;
};

export default Editor;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

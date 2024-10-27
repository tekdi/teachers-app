import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Create = dynamic(() => import('editor/Create'), { ssr: false });

const create = () => {
  return <Create />;
};

export default create;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Review = dynamic(() => import('editor/Review'), { ssr: false });

const submitted = () => {
  return <Review />;
};

export default submitted;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

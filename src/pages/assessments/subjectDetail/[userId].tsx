import Header from '@/components/Header';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function SubjectDetail() {
  return (
    <>
      <Header />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default SubjectDetail;

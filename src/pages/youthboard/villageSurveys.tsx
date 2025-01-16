import withRole from '@/components/withRole';
import React from 'react';
import { TENANT_DATA } from '../../../app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const villageSurveys = () => {
  return <div>villageSurveys</div>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default withRole(TENANT_DATA.YOUTHNET)(villageSurveys);

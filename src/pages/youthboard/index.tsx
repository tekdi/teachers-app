import React, { useState } from 'react';
import withRole from '@/components/withRole';
import { Box } from '@mui/material';
import Header from '@/components/Header';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../../../app.config';

const index = () => {
  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default withRole(TENANT_DATA.YOUTHNET)(index);

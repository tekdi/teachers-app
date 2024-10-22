import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next';

const QuestionnaireApp = dynamic(
  () => import('@/components/QuestionnaireApp'),
  {
    ssr: false,
    // loading: () => <p>Loading Questionnaire App...</p>,
  }
);

const ObservationQuestions: React.FC = () => {
  const router = useRouter();

  return (
    <Box>
      <Header />

      <QuestionnaireApp />
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default ObservationQuestions;

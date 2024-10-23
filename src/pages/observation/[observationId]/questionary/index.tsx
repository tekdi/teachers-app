import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next';
import { fetchQuestion } from '@/services/ObservationServices';

const ObservationComponent = dynamic(
  () => import('@/components/ObservationComponent'),
  {
    ssr: false,
    // loading: () => <p>Loading Questionnaire App...</p>,
  }
);

const ObservationQuestions: React.FC = () => {
  const router = useRouter();
  const { Id } = router.query;
  const { cohortId } = router.query;
  const [questionResponse, setQuestionResponseResponse] =
  useState<any>(null);
  useEffect(() => {
    const fetchQuestionsList = async () => {
      try {
       const observationId=Id;
        const entityId=cohortId;  
        if(observationId && Id)
        {
          const response=await fetchQuestion({observationId,entityId})
          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment, // Spread all properties from assessment
              endDate: "2026-07-13T23:59:59.000Z",

            }
          };
       
          setQuestionResponseResponse(
            combinedData
          )
          console.log("setQuestionResponseResponse", combinedData)
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };
    fetchQuestionsList();
  }, [Id, cohortId]);

  return (
    <Box>
      <Header />

      <ObservationComponent observationQuestions={questionResponse} />
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

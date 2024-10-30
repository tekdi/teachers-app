import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import { useEffect, useState } from 'react';
import { Box, useTheme , Typography} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next';
import { fetchQuestion } from '@/services/ObservationServices';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

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
  const theme = useTheme<any>();

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
  const handleBackEvent = () => {
  //  window.history.back();
  router.push(
    `${localStorage.getItem('observationPath')}`
  );
  };
  return (
    <Box>
      <Header />
      <Box
          sx={{
            display: 'flex',
            direction: 'row',
            gap: '24px',
            mt:"15px",
            marginLeft:"10px"
            
          }}
          width={'100%'}
          onClick={handleBackEvent}

        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
            }}
          />
        </Box>
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

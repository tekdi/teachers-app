import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Divider, Typography } from '@mui/material';
import { logEvent } from '@/utils/googleAnalytics';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { getAssessmentQuestion } from '@/services/UpdateAssesmentService';

// Define types for the assessment question data
interface AssessmentQuestion {
  question: string;
  score: number;
}

function SubjectDetail() {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [assessmentQuestions, setAssessmentQuestions] = useState<
    AssessmentQuestion[]
  >([]);

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  useEffect(() => {
    const fetchAssessmentQuestions = async () => {
      const res = await getAssessmentQuestion(); // Assume this returns a promise
      setAssessmentQuestions(res);
    };

    fetchAssessmentQuestions();
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'flex-start',
          color: '#4D4639',
          padding: '15px 20px 0px',
        }}
        width={'100%'}
        onClick={handleBackEvent}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{ color: theme.palette.warning.A200, marginTop: '14px' }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', margin: '0.8rem' }}
        >
          <Typography textAlign={'left'} fontSize={'22px'}>
            userName {/* Replace with dynamic username */}
          </Typography>
          <Typography
            color={'#4D4639'}
            textAlign={'left'}
            fontWeight={'500'}
            fontSize={'11px'}
          >
            Subject
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          m: 2,
          padding: '16px',
          background: '#F8EFE7',
          border: '1px solid #D0C5B4',
          borderRadius: '16px',
        }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', pb: '10px' }}
        >
          <Box sx={{ color: '#7C766F', fontSize: '12px', fontWeight: '500' }}>
            Submitted On : 2 Feb, 2024
          </Box>
          <Box sx={{ fontSize: '14px', fontWeight: '500', color: '#1F1B13' }}>
            210/250
          </Box>
        </Box>
        <Divider />
        <Box sx={{ mt: 1, fontSize: '12px', color: '#7C766F' }}>
          42 out of 50 correct answers
        </Box>

        {assessmentQuestions.map((questionItem, index) => (
          <Box key={index}>
            <Box
              sx={{
                mt: 1.5,
                fontSize: '14px',
                fontWeight: '400',
                color: '#1F1B13',
              }}
            >
              {questionItem.question}
            </Box>
            <Box
              sx={{
                mt: 0.8,
                fontSize: '16px',
                fontWeight: '500',
                color: '#1A8825',
              }}
            >
              {questionItem.score}
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const paths = [
    { params: { userId: '1' } },
    { params: { userId: '2' } },
    { params: { userId: '3' } },
  ];

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
  locale,
}: {
  params: any;
  locale: string;
}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default SubjectDetail;

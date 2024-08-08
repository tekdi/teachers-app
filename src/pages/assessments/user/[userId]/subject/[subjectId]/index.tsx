import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { getAssessmentQuestion } from '@/services/UpdateAssesmentService';
import Header from '@/components/Header';
import { logEvent } from '@/utils/googleAnalytics';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Pagination } from '@/utils/app.constant';

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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAssessmentQuestions = async () => {
      const res = await getAssessmentQuestion();
      setAssessmentQuestions(res.slice(0, Pagination.MAX_ITEMS));
    };
    fetchAssessmentQuestions();
  }, []);

  const handlePageChange = (
    _event: React.MouseEvent<HTMLElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const paginatedQuestions = assessmentQuestions.slice(
    (currentPage - 1) * Pagination.ITEMS_PER_PAGE,
    currentPage * Pagination.ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(
    assessmentQuestions.length / Pagination.ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'flex-start',
          color: theme.palette.warning['A200'],
          padding: '15px 20px 0px',
        }}
        width={'100%'}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{ color: theme.palette.warning['A200'], marginTop: '14px' }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', margin: '0.8rem' }}
        >
          <Typography textAlign={'left'} fontSize={'22px'}>
            userName {/* Replace with dynamic username */}
          </Typography>
          <Typography
            color={theme.palette.warning['A200']}
            textAlign={'left'}
            fontWeight={'500'}
            fontSize={'11px'}
          >
            {t('PROFILE.SUBJECT')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          m: 2,
          padding: '4px 16px 16px',
          background: theme.palette.warning['800'],
          border: `1px solid ${theme.palette.warning['A100']}`,
          borderRadius: '16px',
        }}
      >
        {/* Assessment questions */}
        {paginatedQuestions.map((questionItem, index) => (
          <Box key={index}>
            <Box
              sx={{
                mt: 1.5,
                fontSize: '14px',
                fontWeight: '400',
                color: theme.palette.warning['300'],
              }}
            >
              {questionItem.question}
            </Box>
            <Box
              sx={{
                mt: 0.8,
                fontSize: '16px',
                fontWeight: '500',
                color: theme.palette.success.main,
              }}
            >
              {questionItem.score}
            </Box>
          </Box>
        ))}

        {/* Pagination UI */}
      </Box>
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            my: 2,
            px: '20px',
            '@media (max-width: 500px)': {
              justifyContent: 'space-between',
            },
          }}
        >
          <IconButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(null, currentPage - 1)}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: '20px', color: '#1F1B13' }} />
          </IconButton>
          <Typography sx={{ mx: 2, fontSize: '14px', fontWeight: '500' }}>
            {`${(currentPage - 1) * Pagination.ITEMS_PER_PAGE + 1}-${Math.min(
              currentPage * Pagination.ITEMS_PER_PAGE,
              assessmentQuestions.length
            )} of ${assessmentQuestions.length}`}
          </Typography>
          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(null, currentPage + 1)}
          >
            <ArrowForwardIosIcon sx={{ fontSize: '20px', color: '#1F1B13' }} />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default SubjectDetail;

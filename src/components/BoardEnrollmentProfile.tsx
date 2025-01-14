import Header from '@/components/Header';
import { Box, Button, Divider, Typography } from '@mui/material';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useDirection } from '../hooks/useDirection';
import { logEvent } from '@/utils/googleAnalytics';
import { BoardEnrollmentProfileProps } from '@/utils/Interfaces';

const BoardEnrollmentProfile: React.FC<BoardEnrollmentProfileProps> = ({
  learnerName,
  centerName,
  board,
  subjects,
  registrationNum,
  feesPaidStatus,
  setActiveStep = () => {},
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Board enrolment page',
      label: 'Back Button Clicked',
    });
  };

    const handleEditClick = () => {
    setActiveStep(0);
  };
  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          color: theme.palette.warning['A200'],
          padding: '15px 16px 5px',
        }}
        width={'100%'}
      >
        <KeyboardBackspaceOutlinedIcon
          onClick={handleBackEvent}
          cursor={'pointer'}
          sx={{
            color: theme.palette.warning['A200'],
            marginTop: '18px',
            transform: isRTL ? ' rotate(180deg)' : 'unset',
          }}
        />
        <Box my={'1rem'} ml={'0.5rem'}>
          <Typography
            color={theme.palette.warning['A200']}
            textAlign={'left'}
            fontSize={'22px'}
            fontWeight={400}
          >
            {learnerName}
          </Typography>
          <Typography
            color={theme.palette.warning['A200']}
            textAlign={'left'}
            fontSize={'11px'}
            fontWeight={500}
          >
            {centerName}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          border: '1px solid #D0C5B4',
          mx: '16px',
          p: '16px',
          borderRadius: '16px',
          maxWidth: '60%',
          '@media (max-width: 900px)': {
            maxWidth: '100%',
          },
        }}
      >
        <Box sx={{ color: '#969088', fontSize: '12px', fontWeight: '600' }}>
          {t('BOARD_ENROLMENT.BOARD')}
        </Box>
        <Box
          sx={{ color: '#4D4639', fontWeight: '400', fontSize: '16px', mt: 1 }}
        >
          {board}
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '12px', fontWeight: '600' }}>
            {t('BOARD_ENROLMENT.SUBJECTS_ENROLLED')}
          </Box>
          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mt: 1 }}>
            {subjects.map((subject) => (
              <Box
                key={subject?.identifier}
                sx={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #DADADA',
                  color: '#4D4639',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {subject.name}
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '12px', fontWeight: '600' }}>
            {t('BOARD_ENROLMENT.BOARD_ENROLLMENT_NUMBER')}
          </Box>
          <Box
            sx={{
              color: '#4D4639',
              fontWeight: '400',
              fontSize: '16px',
              mt: 1,
            }}
          >
            {registrationNum}
          </Box>
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '12px', fontWeight: '600' }}>
            {t('BOARD_ENROLMENT.EXAM_REGISTRATION_FEES_PAID')}
          </Box>
          <Box
            sx={{
              color: '#4D4639',
              fontWeight: '400',
              fontSize: '16px',
              mt: 1,
            }}
          >
            {feesPaidStatus.toLocaleUpperCase()}
          </Box>
        </Box>
        <Box mt={2}>
          <Divider />
        </Box>

        <Box display={'flex'} justifyContent={'flex-start'} my={1}>
          <Button
            sx={{
              width: '296px',
              height: '40px',
              fontSize: '14px',
              fontWeight: '500',
              mt: '15px',
            }}
            variant="contained"
            color="primary"
            onClick={handleEditClick}
          >
            {t('BOARD_ENROLMENT.EDIT')}
          </Button>
        </Box>
      </Box>
    </>
  );
};
// export async function getStaticProps({ locale }: any) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }

export default BoardEnrollmentProfile;

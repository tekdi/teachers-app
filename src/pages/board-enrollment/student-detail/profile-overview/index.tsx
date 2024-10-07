import Header from '@/components/Header';
import { Box, Button, Divider, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useDirection } from '../../../../hooks/useDirection';
import { logEvent } from '@/utils/googleAnalytics';

const ProfileEnrolment = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Board enrolment page',
      label: 'Back Button Clicked',
    });
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
            Student Name {/*will come from Api */}
          </Typography>
          <Typography
            color={theme.palette.warning['A200']}
            textAlign={'left'}
            fontSize={'11px'}
            fontWeight={500}
          >
            Khapari Dharmu (Chimur, Chandrapur) {/*will come from Api */}
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
        }}
      >
        <Box sx={{ color: '#969088', fontSize: '16px', fontWeight: '600' }}>
          Board
        </Box>
        <Box
          sx={{ color: '#4D4639', fontWeight: '400', fontSize: '16px', mt: 1 }}
        >
          ICSE
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '12px', fontWeight: '600' }}>
            Subjects Enrolled
          </Box>
          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', mt: 1 }}>
            <Box
              sx={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                color: '#4D4639',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Hindi
            </Box>
            <Box
              sx={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                color: '#4D4639',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Science
            </Box>
            <Box
              sx={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                color: '#4D4639',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Social Science
            </Box>
            <Box
              sx={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                color: '#4D4639',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Life Skills
            </Box>
          </Box>
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '16px', fontWeight: '600' }}>
            Board Enrolment Number
          </Box>
          <Box
            sx={{
              color: '#4D4639',
              fontWeight: '400',
              fontSize: '16px',
              mt: 1,
            }}
          >
            100245673
          </Box>
        </Box>
        <Box mt={2}>
          <Box sx={{ color: '#969088', fontSize: '16px', fontWeight: '600' }}>
            Date of Registration
          </Box>
          <Box
            sx={{
              color: '#4D4639',
              fontWeight: '400',
              fontSize: '16px',
              mt: 1,
            }}
          >
            24 Aug, 2024
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
          >
            Edit
          </Button>
        </Box>
      </Box>
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ProfileEnrolment;

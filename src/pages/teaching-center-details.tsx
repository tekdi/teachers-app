import { Button, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import LearnersList from '@/components/LearnersList';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const TeachingCenterDetails = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackEvent = () => {
    window.history.back();
  };

  const { t } = useTranslation();

  const theme = useTheme<any>();

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            // alignItems: 'center',
            color: '#4D4639',
            padding: '15px 17px 5px',
          }}
          width={'100%'}
          onClick={handleBackEvent}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{ color: theme.palette.warning['A200'], marginTop: '15px' }}
          />
          <Box m={'1rem 1rem 0.5rem'}>
            <Typography textAlign={'left'} fontSize={'22px'}>
              Khapari Dharmu
            </Typography>
            <Box>
              <Typography textAlign={'left'} fontSize={'11px'} fontWeight={500}>
                Chimur, Chandrapur
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: '1px solid #EBE1D4',

            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('COMMON.LEARNER_LIST')} />
        </Tabs>
      </Box>
      <Box>
        {value === 1 && (
          <>
            <Box mt={3} px={'18px'}>
              <Button
                sx={{
                  border: '1px solid #1E1B16',
                  borderRadius: '100px',
                  height: '40px',
                  width: '126px',
                }}
                className="text-1E"
                endIcon={<AddIcon />}
              >
                {t('COMMON.ADD_NEW')}
              </Button>
            </Box>
            <Box
              px={'18px'}
              mt={2}
              sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
            >
              <Box
                sx={{ color: theme.palette.secondary.main }}
                className="fs-14 fw-500"
              >
                {t('COMMON.REVIEW_ATTENDANCE')}
              </Box>
              <ArrowForwardIcon
                sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
              />
            </Box>
            <Box>
              <LearnersList />
            </Box>
          </>
        )}
      </Box>
    </>
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

export default TeachingCenterDetails;

import CoursePlannerCards from '@/components/CoursePlannerCards';
import Header from '@/components/Header';
import { logEvent } from '@/utils/googleAnalytics';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import useCourseStore from '@/store/coursePlannerStore';
import CourseAccordion from '@/components/CourseAccordion';
import { useDirection } from '../hooks/useDirection';
import { ResourcesType } from '@/utils/app.constant';

const TopicDetailView = () => {
  const [value, setValue] = React.useState(1);
  const theme = useTheme<any>();
  const { t, i18n } = useTranslation();
  const { dir, isRTL } = useDirection();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const store = useCourseStore();

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  return (
    <Box>
      <Box>
        <Header />
      </Box>
      <Box sx={{ px: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            color: theme.palette.warning['A200'],
            padding: '15px 0px 5px',
            gap: '15px',
          }}
          width={'100%'}
        >
          <KeyboardBackspaceOutlinedIcon
            onClick={handleBackEvent}
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
          <Box>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  fontSize: '16px',
                  color: theme.palette.warning['300'],
                }}
              >
                {store.resources.name}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: `1px solid ${theme.palette.primary.contrastText}`,

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
            <Tab value={1} label={t('COMMON.LEARNERS')} />
            <Tab value={2} label={t('COMMON.FACILITATORS')} />
          </Tabs>
        </Box>

        {value === 1 && (
          <Box>
            <CourseAccordion
              title={t('CENTER_SESSION.LEARNER_PREREQUISITES')}
              type={ResourcesType.PREREQUSITE}
              resources={store.resources.learningResources}
            />
            <CourseAccordion
              title={t('CENTER_SESSION.LEARNER_POSTREQUISITES')}
              type={ResourcesType.POSTREQUSITE}
              resources={store.resources.learningResources}
            />
          </Box>
        )}

        {value === 2 && (
          <Box>
            <CoursePlannerCards
              resources={store.resources.learningResources}
              type={ResourcesType.NONE}
            />
          </Box>
        )}
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

export default TopicDetailView;

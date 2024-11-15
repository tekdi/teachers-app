import CourseAccordion from '@/components/CourseAccordion';
import Header from '@/components/Header';
import useCourseStore from '@/store/coursePlannerStore';
import { ResourcesType } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  Box,
  Tab,
  Tabs
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDirection } from '../hooks/useDirection';

const TopicDetailView = () => {
  const [value, setValue] = React.useState(1);
  const [expanded, setExpanded] = useState('panel1'); // Start with the first panel open
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const store = useCourseStore();


  useEffect(() => {
    console.log("store", store.resources);
    const type = ResourcesType.POSTREQUSITE;
    const filteredResources = getLearningResources(type);
    console.log("filteredResources", filteredResources);
  }, []);


  const getLearningResources = (type: string) => {
    if (store?.resources?.length) {
      return store?.resources?.filter((resource: any) => {
        return (type === ResourcesType.NONE && !resource.type) || resource.type === type
      });
    }
  }

  const toggleAccordion = (panel: string) => (event: React.SyntheticEvent, expanded: boolean) => {
    // Toggle between the selected panel and 'panel1' to keep the first panel open by default
    setExpanded(expanded ? panel : 'panel1');
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackEvent = () => {
    // window.history.back();
    router.push(`/course-planner-detail`);
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  const handlePlayers = () => {
    sessionStorage.setItem('previousPage', window.location.href);
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
            <Tab value={1} label={t('COMMON.FACILITATORS')} />
            <Tab value={2} label={t('COMMON.LEARNERS')} />
          </Tabs>
        </Box>

        {value === 1 && (
          <Box>
            <CourseAccordion
              expanded={true}
              title={t('CENTER_SESSION.PREREQUISITES')}
              type={ResourcesType.NONE}
              resources={getLearningResources(ResourcesType.NONE)}
            />
            {/* <CoursePlannerCards
              title={t('CENTER_SESSION.PREREQUISITES')}
              resources={store.resources.learningResources}
              type={ResourcesType.NONE}
            /> */}
          </Box>
        )}

        {value === 2 && (
          <Box onClick={handlePlayers}>
            <CourseAccordion expanded={expanded === 'panel1'} onChange={toggleAccordion('panel1')}
              title={t('CENTER_SESSION.PREREQUISITES')}
              type={ResourcesType.PREREQUSITE}
              resources={getLearningResources(ResourcesType.PREREQUSITE)}
            />
            <CourseAccordion expanded={expanded === 'panel2'} onChange={toggleAccordion('panel2')}
              title={t('CENTER_SESSION.POST_REQUISITES')}
              type={ResourcesType.POSTREQUSITE}
              resources={getLearningResources(ResourcesType.POSTREQUSITE)}
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

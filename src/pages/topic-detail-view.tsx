import CourseAccordion from '@/components/CourseAccordion';
import Header from '@/components/Header';
import useCourseStore from '@/store/coursePlannerStore';
import { ResourcesType, Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import { telemetryFactory } from '@/utils/telemetry';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import React, { useState } from 'react';
import { RequisiteType } from '../../app.config';
import { useDirection } from '../hooks/useDirection';

const TopicDetailView = () => {
  const [value, setValue] = React.useState(1);
  const [expanded, setExpanded] = useState<string[]>(['panel1', 'panel2']); // Default both panels expanded
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const store = useCourseStore();

  const getLearningResources = (type: string) => {
    if (store?.resources?.length) {
      return store?.resources?.filter((resource: any) => {
        return (
          (type === ResourcesType.NONE && !resource.type) ||
          resource.type === type
        );
      });
    }
    return [];
  };

  const toggleAccordion = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded((prevExpanded) =>
      isExpanded
        ? [...prevExpanded, panel] // Add panel to expanded list
        : prevExpanded.filter((item) => item !== panel) // Remove panel from expanded list
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split("/")[0];
    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id:
          newValue === 1 ? 'change-tab-to-facilitator' : 'change-tab-to-learner',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    setValue(newValue);
  };

  const handleBackEvent = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const classId = localStorage.getItem('classId');
      router.push(`curriculum-planner/center/${classId}`);
    }
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
                {store?.selectedResource}
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
              expanded={expanded.includes('panel1')}
              onChange={toggleAccordion('panel1')}
              title={t('CENTER_SESSION.PREREQUISITES')}
              type={RequisiteType.FACILITATOR_REQUISITE}
              resources={getLearningResources(
                RequisiteType.FACILITATOR_REQUISITE
              )}
            />
          </Box>
        )}

        {value === 2 && (
          <Box onClick={handlePlayers}>
            <CourseAccordion
              expanded={expanded.includes('panel1')}
              onChange={toggleAccordion('panel1')}
              title={t('CENTER_SESSION.PREREQUISITES')}
              type={ResourcesType.PREREQUSITE}
              resources={getLearningResources(ResourcesType.PREREQUSITE)}
            />
            <CourseAccordion
              expanded={expanded.includes('panel2')}
              onChange={toggleAccordion('panel2')}
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
    },
  };
}

export default TopicDetailView;

import NoDataFound from '@/components/common/NoDataFound';
import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import Surveys from '@/components/youthNet/Surveys';
import { surveysData } from '@/components/youthNet/tempConfigs';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Survey = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();

  const [value, setValue] = useState<number>(1);
  // const [searchInput, setSearchInput] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleCampSurvey = (villageNameStringNew: string, title: string) => {
    router.push(`/youthboard/campDetails/${villageNameStringNew}${title}`);
  };

  const handleAddVolunteers = () => {
    router.push('/youthboard/volunteerList');
  };



  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('SURVEYS.SURVEYS')} />
      </Box>
      <Box sx={{ width: '100%' }}>
        {value && (
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit" // Use "inherit" to apply custom color
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: (theme) => `1px solid #EBE1D4`,

              '& .MuiTab-root': {
                color: theme.palette.warning['A200'],
                padding: '0 20px',
                flexGrow: 1,
              },
              '& .Mui-selected': {
                color: theme.palette.warning['A200'],
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
            <Tab value={1} label={t('SURVEYS.ACTIVE_SURVEYS')} />
            <Tab value={2} label={t('SURVEYS.PREVIOUS_SURVEYS')} />
          </Tabs>
        )}


      </Box>

      <Box>
        {value === 1 && (
          <Box padding={"15px"} sx={{
            background: '#FBF4E4',
          }}>
            <Grid container spacing={2}>
              {surveysData && surveysData.length > 0 ? (
                surveysData?.map((survey, index) => (
                  <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                    <Surveys
                      title={survey.title}
                      date={survey.date}
                      villages={survey.details.villages}
                      status={survey.details.status}
                      actionRequired={survey.details.actionRequired}
                      minHeight="98px"
                      onClick={handleAddVolunteers}
                    />
                  </Grid>
                ))
              ) : (
                <NoDataFound />
              )}
            </Grid>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ mt: 4, p: 2, background: '#FBF4E4' }}>
            {/* <GenericForm fields={formFields} /> */}
            {/* <ExamplePage/> */}
            {/* <VillageSelector/> */}
          </Box>
        )}
      </Box>


    </>

  )
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default Survey
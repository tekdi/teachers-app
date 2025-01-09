import React, { useEffect, useState } from 'react';
import withRole from '@/components/withRole';
import { Box, Grid, Modal, Typography } from '@mui/material';
import Header from '@/components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../../../app.config';
import { fetchSurveyData } from '@/services/youthNet/SurveyYouthService';
import SimpleModal from '@/components/SimpleModal';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { SURVEY_DATA } from '@/components/youthNet/tempConfigs';
import BackHeader from '@/components/youthNet/BackHeader';
import MonthlyRegistrationsChart from '@/components/youthNet/MonthlyRegistrationsChart';
import RegistrationStatistics from '@/components/youthNet/RegistrationStatistics';

const index = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSurveyAvailable, setIsSurveyAvailable] = useState<boolean>(false);
  const [surveymodalOpen, setSurveyModalOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const getSurveyData = async () => {
      const surveyAvailable = await fetchSurveyData();
      setIsSurveyAvailable(surveyAvailable);
      setModalOpen(surveyAvailable);
    };

    getSurveyData();
  }, []);

  const handleModalClose = () => setModalOpen(false);

  const handleAddVolunteers = () => {
    router.push('youthboard/volunteerList');
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('DASHBOARD.DASHBOARD')} />
      </Box>
      <Box ml={2}>
        <Typography>
          {t('YOUTHNET_DASHBOARD.VILLAGES_MANAGED_BY_YOU', {
            totalVillageCount: SURVEY_DATA.FIFTY_TWO,
          })}
        </Typography>
      </Box>
      <Box p={2}>
        <RegistrationStatistics title={'7 New Registrations Today'} />
      </Box>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <RegistrationStatistics cardTitle={'Above 18 y/o'} statistic={4} />
          </Grid>
          <Grid item xs={4}>
            <RegistrationStatistics cardTitle={'Below 18 y/o'} statistic={3} />
          </Grid>
          <Grid item xs={4}>
            <RegistrationStatistics cardTitle={'From'} statistic={12} />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <MonthlyRegistrationsChart />
      </Box>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <RegistrationStatistics
              avatar={true}
              statistic={4}
              subtile={'Youth'}
            />
          </Grid>
          <Grid item xs={6}>
            <RegistrationStatistics
              avatar={true}
              statistic={4}
              subtile={'Volunteer'}
            />
          </Grid>
        </Grid>
      </Box>
      <SimpleModal
        modalTitle={t('YOUTHNET_SURVEY.NEW_SURVEY')}
        primaryText={t('YOUTHNET_SURVEY.ASSIGN_VOLUNTEERS_NOW')}
        secondaryText={t('YOUTHNET_SURVEY.REMIND_ME_LATER')}
        secondaryActionHandler={handleModalClose}
        primaryActionHandler={handleAddVolunteers}
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            sx={{
              color: 'black',
              fontWeight: 500,
              textAlign: 'center',
              mb: 1,
            }}
          >
            {t('YOUTHNET_SURVEY.NEW_SURVEY_HAS_BEEN_ADDED', {
              surveyName: SURVEY_DATA.CREATIVITY_MAHOTSAV,
              villageCount: SURVEY_DATA.TWELVE,
            })}
          </Typography>
          <Typography
            sx={{
              color: 'black',
              textAlign: 'center',
            }}
          >
            {t('YOUTHNET_SURVEY.ASSIGN_VOLUNTEERS_TO_ENSURE')}
          </Typography>
        </Box>
      </SimpleModal>
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

export default withRole(TENANT_DATA.YOUTHNET)(index);

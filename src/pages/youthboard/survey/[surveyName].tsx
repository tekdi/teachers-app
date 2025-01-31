import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { surveyData, VILLAGE_DATA } from '@/components/youthNet/tempConfigs';
import VillageDetailCard from '@/components/youthNet/VillageDetailCard';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import withRole from '@/components/withRole';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../../../../app.config';
import Surveys from '@/components/youthNet/Surveys';
import { useTheme } from '@mui/material/styles';

const survey = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const { surveyName } = router.query;
  const villageNameStringNew = Array.isArray(surveyName)
    ? surveyName[0]
    : surveyName || '';

  console.log(villageNameStringNew);

  const handleBack = () => {
    router.back();
  };

  const handleCampSurvey = (villageNameStringNew: string, title: string) => {
    router.push(`/youthboard/campDetails/${villageNameStringNew}${title}`);
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box>
        <BackHeader
          headingOne={t('YOUTHNET_SURVEY.SURVEY')}
          headingTwo={villageNameStringNew}
          showBackButton={true}
          onBackClick={handleBack}
        />
      </Box>
      <Box
        sx={{ background: theme.palette.action.selected }}
        display="flex"
        flexDirection="column"
        gap={2}
        p={2}
      >
        {surveyData.map((survey, index) => (
          <Surveys
            key={index}
            title={survey.title}
            date={survey.date}
            onClick={() => handleCampSurvey(villageNameStringNew, survey.title)}
          />
        ))}
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withRole(TENANT_DATA.YOUTHNET)(survey);

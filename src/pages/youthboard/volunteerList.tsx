import React from 'react';
import withRole from '@/components/withRole';
import { Box, Grid } from '@mui/material';
import Header from '@/components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../../../app.config';
import BackHeader from '@/components/youthNet/BackHeader';
import { SURVEY_DATA } from '@/components/youthNet/tempConfigs';
import { useRouter } from 'next/router';
import { volunteerData } from '@/components/youthNet/tempConfigs';
import VolunteerListCard from '@/components/youthNet/VolunteerListCard';
import NoDataFound from '@/components/common/NoDataFound';

const volunteerList = () => {
  const router = useRouter();

  const { surveyName } = router.query;
  const villageNameStringNew = Array.isArray(surveyName)
    ? surveyName[0]
    : surveyName || '';

  console.log(villageNameStringNew);

  const handleBack = () => {
    router.back();
  };

  const handleCardAction = (villageNameStringNew: string, title: string) => {
    router.push(`/youthboard/village-camp-survyey/${villageNameStringNew}${title}`);
  };
  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <BackHeader
        headingOne={SURVEY_DATA.CREATIVITY_MAHOTSAV}
        headingTwo={SURVEY_DATA.TWELVE}
        showBackButton={true}
        onBackClick={handleBack}
      />
      <Box sx={{ mt: 4, p: 2, background: '#FBF4E4' }}>
        <Grid container spacing={2}>
         
       
        {volunteerData?.length > 0 ? (
          volunteerData?.map((data) => (
             <Grid item xs={12} sm={12} md={6} lg={4}>
            <VolunteerListCard
              key={data?.id}
              title={data?.title}
              entries={data?.entries}
              volunteerCount={data?.volunteerCount}
              actionLabel={data?.actionLabel}
                onActionClick={() => handleCardAction(villageNameStringNew , data?.title)}
            />
            </Grid>
          ))
        ) : (
          <NoDataFound />
        )}
         </Grid>
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

export default withRole(TENANT_DATA.YOUTHNET)(volunteerList);

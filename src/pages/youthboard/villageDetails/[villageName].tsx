import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import withRole from '@/components/withRole';
import { TENANT_DATA } from '../../../../app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { SURVEY_DATA, VILLAGE_DATA } from '@/components/youthNet/tempConfigs';
import VillageDetailCard from '@/components/youthNet/VillageDetailCard';
import Frame1 from '../../../assets/images/SurveyFrame1.png';
import Frame2 from '../../../assets/images/SurveyFrame2.png';

const VillageDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { villageName } = router.query; // Extract the slug from the URL
  const villageNameString = Array.isArray(villageName)
    ? villageName[0]
    : villageName || '';
  const handleBack = () => {
    router.back();
  };

  const handleYouthVolunteers = () => {
    console.log('handleYouthVolunteers');
  };

  const handleSurveys = () => {
    router.push(`/youthboard/survey/${villageNameString}`);
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box>
        <BackHeader
          headingOne={villageNameString}
          headingTwo={VILLAGE_DATA.TWENTY_SIX}
          headingThree={VILLAGE_DATA.ZERO}
          showBackButton={true}
          onBackClick={handleBack}
        />
      </Box>
      <Box
        ml={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
          {VILLAGE_DATA.VILLAGE_ID}
        </Typography>
        <Typography pl={5} sx={{ fontSize: '12px' }}>
          {VILLAGE_DATA.ID}
        </Typography>
      </Box>
      <Box>
        <VillageDetailCard
          imageSrc={Frame1}
          title={VILLAGE_DATA.YOUTH_VOL}
          onClick={handleYouthVolunteers}
        />
      </Box>
      <Box>
        <VillageDetailCard
          imageSrc={Frame2}
          title={VILLAGE_DATA.THREE}
          subtitle={VILLAGE_DATA.SURVEYS_CONDUCTED}
          onClick={handleSurveys}
        />
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

export default withRole(TENANT_DATA.YOUTHNET)(VillageDetails);

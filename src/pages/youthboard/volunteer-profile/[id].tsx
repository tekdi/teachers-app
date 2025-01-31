import withRole from '@/components/withRole';
import React, { useEffect, useState } from 'react';
import { TENANT_DATA } from '../../../../app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { Box, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { UserList } from '@/components/youthNet/UserCard';
import Profile from '@/components/youthNet/Profile';
import { useTheme } from '@mui/material/styles';
import { VILLAGE_DATA } from '@/components/youthNet/tempConfigs';
import VillageDetailCard from '@/components/youthNet/VillageDetailCard';
import Frame2 from '../../../assets/images/SurveyFrame2.png';

const VolunteerDetails = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  const [studentName, setStudentName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (Array.isArray(id)) {
      setStudentName(id[0]);
    } else {
      setStudentName(id);
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box ml={2} display={'flex'} flexDirection={'row'}>
        <Box sx={{ width: 30 }}>
          <BackHeader showBackButton={true} onBackClick={handleBack} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <UserList
            layout="list"
            users={[
              {
                name: studentName || '',
                village: 'Shivare (Bhor, Pune, Maharashtra)',
                showMore: true,
                showAvtar: true,
              },
            ]}
          />
        </Box>
      </Box>
      <Box
        sx={{
          padding: '0px 16px 0px 16px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.palette.info.black,
          }}
        >
          {t('YOUTHNET_PROFILE.VOLUNTEERING_DETAILS')}
        </Typography>
      </Box>
      <Box>
        <VillageDetailCard
          imageSrc={Frame2}
          title={VILLAGE_DATA.THREE}
          subtitle={VILLAGE_DATA.SURVEYS_CONDUCTED}
        />
      </Box>
      <Box
        sx={{
          background: theme.palette.info.gradient,
          padding: '24px 16px 24px 16px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.palette.info.black,
          }}
        >
          {t('YOUTHNET_PROFILE.PROFILE_DETAILS')}
        </Typography>
        <Button
          variant="outlined"
          endIcon={<EditIcon />}
          sx={{
            width: '100%',
            borderRadius: '100px',
            border: `1px solid ${theme.palette.warning['A200']}`,
            color: theme.palette.warning['A200'],
            padding: '8px 24px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            marginTop: '20px',
          }}
        >
          Edit
        </Button>
        <Profile
          fullName={studentName || ''}
          emailId={''}
          state="Maharashtra"
          district="Pune"
          block="Bhor"
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

export default withRole(TENANT_DATA.YOUTHNET)(VolunteerDetails);

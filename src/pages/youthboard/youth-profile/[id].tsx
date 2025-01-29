import withRole from '@/components/withRole';
import React, { useEffect, useState } from 'react';
import { TENANT_DATA } from '../../../../app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import BackHeader from '@/components/youthNet/BackHeader';
import { Box, Typography } from '@mui/material';
import { UserList } from '@/components/youthNet/UserCard';
import Profile from '@/components/youthNet/Profile';
import { useTheme } from '@mui/material/styles';

const YouthDetails = () => {
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
        <Profile fullName={studentName || ''} emailId={''} />
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

export default withRole(TENANT_DATA.YOUTHNET)(YouthDetails);

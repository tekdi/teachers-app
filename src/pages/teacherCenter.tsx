import { Box, Button } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Header from '@/components/Header';
import Image from 'next/image';
import building from '../assets/images/apartment.png';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const teacherCenter = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  return (
    <>
      <Header />
      <Box sx={{ padding: '0 18px' }}>
        <Box
          textAlign={'left'}
          fontSize={'22px'}
          p={'18px 0'}
          color={theme?.palette?.warning['300']}
        >
          {t('DASHBOARD.MY_TEACHING_CENTERS')}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button
            sx={{
              border: '1px solid #1E1B16',
              borderRadius: '100px',
              height: '40px',
              width: '91px',
            }}
            className="text-1E"
            endIcon={<AddIcon />}
          >
            {t('COMMON.ADD')}
          </Button>
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <ErrorOutlineIcon style={{ fontSize: '15px' }} />

            <Box className="fs-12 fw-500 ">{t('COMMON.ADD_CENTER')}</Box>
          </Box>
        </Box>
        <Box
          className="linerGradient"
          sx={{ borderRadius: '16px' }}
          mt={2}
          p={2}
        >
          <Box
            onClick={() => {
              router.push(`/teacherCenterDetail`); // Check route
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Box>Khapari Dharmu, Chimur, Chandrapur</Box>
            {/* will come from API */}
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                background: '#fff',
                height: '56px',
                borderRadius: '8px',
              }}
              mt={1}
            >
              <Box
                sx={{
                  width: '56px',
                  display: 'flex',
                  background: '#FFDEA1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
              >
                <Image src={building} alt="apartment" />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 10px',
                }}
              >
                <Box>Khapari Dharmu</Box>
                {/* will come from API */}

                <ChevronRightIcon />
              </Box>
            </Box>
          </Box>

          <Box mt={3}>
            <Box sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}>
              Bhiwapur, Nagpur (Remote)
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                background: '#fff',
                height: '56px',
                borderRadius: '8px',
              }}
              mt={1}
            >
              <Box
                sx={{
                  width: '56px',
                  display: 'flex',
                  background: '#FFDEA1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
              >
                <Image src={building} alt="apartment" />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 10px',
                }}
              >
                <Box
                  sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
                >
                  Bhivapur
                </Box>

                <ChevronRightIcon />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
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

export default teacherCenter;

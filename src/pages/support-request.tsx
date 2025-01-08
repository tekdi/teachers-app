import Header from '@/components/Header';
import JotFormEmbed from '@/components/JotFormEmbed';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SupportRequest = () => {
  const { t } = useTranslation();
  const queryParams = {
    fullName: 'JohnDoe',
    username: 'JohnD',
    userid: 'JohnDoe123',
    email: 'JohnDoe@gmail.com',
  };

  return (
    <>
      <Header />
      <Box ml={'1rem'}>
        <Typography mt={4} variant="h2" color="black">
          {t('COMMON.WE_ARE_HERE_TO_HELP')}
        </Typography>
        <Typography mt={4} variant="h5" marginY={'0.2rem'}>
          {t('COMMON.SUBMIT_YOUR_REQUEST_FOR_ISSUES')}
        </Typography>
      </Box>
      <JotFormEmbed formId="250065095006449" queryParams={queryParams} />
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

export default SupportRequest;

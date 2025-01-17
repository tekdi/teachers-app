import Header from '@/components/Header';
import JotFormEmbed from '@/components/JotFormEmbed';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { jotFormId } from '../../app.config';
import { useDirection } from '@/hooks/useDirection';
import { getUserFullName, toPascalCase } from '@/utils/Helper';

type QueryParams = {
  fullName: string;
  userName: string;
  userId: string;
  email: string;
  deviceInfo?: string;
};

const SupportRequest = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const { isRTL } = useDirection();
  const [queryParams, setQueryParams] = useState<QueryParams>({
    fullName: '',
    userName: '',
    userId: '',
    email: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const name = toPascalCase(getUserFullName()) || '';
      const loginUserName = localStorage.getItem('userIdName') || '';
      const userid = localStorage.getItem('userId') || '';
      const email = localStorage.getItem('userEmail') || '';

      const {
        userAgent,
        language,
        platform,
        cookieEnabled,
        onLine,
        hardwareConcurrency,
      } = navigator;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const screenOrientation = screen.orientation?.type || 'Unknown';
      const referrer = document.referrer || 'Direct Access';

      // Detect device type
      const deviceType = /Mobile|Android|iPhone|iPad/i.test(userAgent)
        ? 'Mobile'
        : /Tablet/i.test(userAgent)
          ? 'Tablet'
          : 'Desktop';

      // Extract browser name and version
      const browserMatch =
        userAgent.match(
          /(firefox|msie|trident|chrome|safari|edge|opr|edg(?=\/))\/?\s*(\d+)/i
        ) || [];
      const browser = browserMatch[1] || 'Unknown';
      const browserVersion = browserMatch[2] || 'Unknown';

      // Access deviceMemory safely
      const deviceMemory = (navigator as any).deviceMemory || 'Unknown';

      // Format the device-related data into a string
      const deviceInfo = `
        Browser: ${browser} ${browserVersion}
        OS: ${platform}
        Screen Resolution: ${screenResolution}
        Language: ${language}
        Cookies Enabled: ${cookieEnabled}
        Online Status: ${onLine ? 'Online' : 'Offline'}
        Device Type: ${deviceType}
        Hardware Concurrency: ${hardwareConcurrency || 'Unknown'}
        Device Memory: ${deviceMemory}
        Time Zone: ${timeZone}
        Screen Orientation: ${screenOrientation}
        Viewport Size: ${viewportSize}
        Referrer: ${referrer}
      `.trim();

      setQueryParams({
        fullName: name,
        userName: loginUserName,
        userId: userid,
        email,
        deviceInfo,
      });
    }
  }, []);

  return (
    <>
      <Header />
      <Box display={'flex'}>
        <Box
          onClick={() => {
            window.history.back();
          }}
          ml={'1rem'}
          mb={0}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
        </Box>
        <Box ml={'1rem'}>
          <Typography mt={0} variant="h2" color="black">
            {t('COMMON.WE_ARE_HERE_TO_HELP')}
          </Typography>
          <Typography mt={4} variant="h5" marginY={'0.2rem'}>
            {t('COMMON.SUBMIT_YOUR_REQUEST_FOR_ISSUES')}
          </Typography>
        </Box>
      </Box>
      <JotFormEmbed formId={jotFormId} queryParams={queryParams} />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default SupportRequest;

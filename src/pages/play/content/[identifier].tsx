import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  fetchContent,
  getHierarchy,
  getQumlData,
} from '@/services/PlayerService';
import { Box, IconButton, Typography } from '@mui/material';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'next-i18next';
import { PlayerConfig } from '@/utils/Interfaces';
import { MIME_TYPE } from '../../../../app.config';
import { V1PlayerConfig, V2PlayerConfig } from '@/data/player-config';
import { MIMEType } from 'util';

// @ts-ignore
const SunbirdPlayers = dynamic(() => import('editor/SunbirdPlayers'), {
  ssr: false,
});

// const playerConfig: PlayerConfig = {
//   context: {
//     mode: 'play',
//     partner: [],
//     pdata: {
//       id: 'dev.sunbird.portal',
//       ver: '5.2.0',
//       pid: 'sunbird-portal',
//     },
//     contentId: 'do_21374910251798528014586',
//     sid: '6d1898db-d783-4f83-8b92-4a36636e0d2f',
//     uid: 'fb6b2e58-0f14-4d4f-90e4-bae092e7a235',
//     timeDiff: -0.089,
//     channel: '01269878797503692810',
//     tags: ['01269878797503692810'],
//     did: '3ca74a4c5fbce6b7b7f5cd12cebb1682',
//     contextRollup: { l1: '01269878797503692810' },
//     objectRollup: {},
//     userData: { firstName: 'Guest', lastName: '' },

//     //telemetry
//     host: 'https://telemetry.prathamdigital.org',
//     endpoint: '/v1/telemetry',
//   },
//   config: {
//     showEndPage: false,
//     endPage: [{ template: 'assessment', contentType: ['SelfAssess'] }],
//     showStartPage: true,
//     host: '',
//     overlay: { showUser: false },
//     splash: {
//       text: '',
//       icon: '',
//       bgImage: 'assets/icons/splacebackground_1.png',
//       webLink: '',
//     },
//     apislug: '',
//     repos: ['/sunbird-plugins/renderer'],
//     plugins: [
//       { id: 'org.sunbird.iframeEvent', ver: 1, type: 'plugin' },
//       { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
//     ],
//     sideMenu: {
//       showShare: false,
//       showDownload: true,
//       showExit: true,
//       showPrint: false,
//       showReplay: true,
//     },
//   },
// };

let playerConfig: PlayerConfig;

interface SunbirdPlayerProps {
  playerConfig: PlayerConfig;
}

const players: React.FC<SunbirdPlayerProps> = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (identifier) {
          console.log('identifier on players page:', identifier);
          const data = await fetchContent(identifier);
          console.log('data', data);
          if (data.mimeType === MIME_TYPE.QUESTION_SET_MIME_TYPE) {
            playerConfig = V2PlayerConfig;
            const Q1 = await getHierarchy(identifier);
            console.log('Q1', Q1?.questionset);
            const Q2 = await getQumlData(identifier);
            console.log('Q2', Q2?.questionset);
            const metadata = { ...Q1?.questionset, ...Q2?.questionset };
            playerConfig.metadata = metadata;
            console.log('playerConfig', playerConfig);
          } else if (MIME_TYPE.INTERACTIVE_MIME_TYPE.includes(data?.mimeType)) {
            playerConfig = V1PlayerConfig;
            playerConfig.metadata = data;
            playerConfig.context['contentId'] = identifier;
          } else {
            playerConfig = V2PlayerConfig;
            playerConfig.metadata = data;
            playerConfig.context['contentId'] = identifier;
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    loadContent();
  }, [identifier]);

  return (
    <Box>
      <Box>
        <Header />
        <Box
          sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}
          onClick={() => router.back()}
        >
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{t('COMMON.BACK')}</Typography>
        </Box>
        {loading && (
          <Box
            width={'100%'}
            id="check"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            mt={'5rem'}
          >
            <Loader showBackdrop={false} />
          </Box>
        )}
      </Box>
      <Box marginTop={'1rem'} px={'14px'}>
        <Typography
          color={'#024f9d'}
          sx={{ padding: '0 0 4px 4px', fontWeight: 'bold' }}
        >
          {playerConfig?.metadata?.name}
        </Typography>
        {!loading ? <SunbirdPlayers player-config={playerConfig} /> : null}
      </Box>
    </Box>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ locale, params }: any) {
  const { identifier } = params;
  return {
    props: {
      noLayout: true,
      identifier,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default players;

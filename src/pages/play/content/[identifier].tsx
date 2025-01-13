import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { V1PlayerConfig, V2PlayerConfig } from '@/data/player-config';
import {
  fetchContent,
  getHierarchy,
  getQumlData,
} from '@/services/PlayerService';
import { PlayerConfig } from '@/utils/Interfaces';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MIME_TYPE } from '../../../../app.config';

// @ts-ignore
const SunbirdPlayers = dynamic(() => import('editor/SunbirdPlayers'), {
  ssr: false,
});

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
          const data = await fetchContent(identifier);
          if (data.mimeType === MIME_TYPE.QUESTION_SET_MIME_TYPE) {
            playerConfig = V2PlayerConfig;
            const Q1 = await getHierarchy(identifier);
            const Q2 = await getQumlData(identifier);
            const metadata = { ...Q1?.questionset, ...Q2?.questionset };
            playerConfig.metadata = metadata;
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

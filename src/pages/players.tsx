import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { fetchContent } from '@/services/PlayerService';

// @ts-ignore
const SunbirdPlayers = dynamic(() => import('editor/SunbirdPlayers'), {
  ssr: false,
});

const playerConfig = {
  context: {
    mode: 'play',
    partner: [],
    pdata: {
      id: 'dev.sunbird.portal',
      ver: '5.2.0',
      pid: 'sunbird-portal',
    },
    contentId: 'do_21374910251798528014586',
    sid: '6d1898db-d783-4f83-8b92-4a36636e0d2f',
    uid: 'fb6b2e58-0f14-4d4f-90e4-bae092e7a235',
    timeDiff: -0.089,
    channel: '01269878797503692810',
    tags: ['01269878797503692810'],
    did: '3ca74a4c5fbce6b7b7f5cd12cebb1682',
    contextRollup: { l1: '01269878797503692810' },
    objectRollup: {},
    userData: { firstName: 'Guest', lastName: '' },

    //telemetry
    host: 'https://telemetry.prathamdigital.org',
    endpoint: '/v1/telemetry',
  },
  config: {
    showEndPage: false,
    endPage: [{ template: 'assessment', contentType: ['SelfAssess'] }],
    showStartPage: true,
    host: '',
    overlay: { showUser: false },
    splash: {
      text: '',
      icon: '',
      bgImage: 'assets/icons/splacebackground_1.png',
      webLink: '',
    },
    apislug: '',
    repos: ['/sunbird-plugins/renderer'],
    plugins: [
      { id: 'org.sunbird.iframeEvent', ver: 1, type: 'plugin' },
      { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
    ],
    sideMenu: {
      showShare: true,
      showDownload: true,
      showExit: true,
      showPrint: true,
      showReplay: true,
    },
  },
  metadata: {},
  data: {},
};

interface SunbirdPlayerProps {
  playerConfig: any;
}

const players: React.FC<SunbirdPlayerProps> = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [metadata, setMetadata] = useState<any>();
  // playerConfig.metadata = pdfMetadata;

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (identifier) {
          console.log('identifier on players page:', identifier);
          const data = await fetchContent(identifier);
          setMetadata(data);
          console.log('data', data);
          playerConfig.metadata = data;
          // You can pass identifier to SunbirdPlayers if needed
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadContent();
  }, [identifier]);

  return metadata ? <SunbirdPlayers player-config={playerConfig} /> : null;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default players;

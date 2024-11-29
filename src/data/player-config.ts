import { getDeviceId } from '@/utils/Helper';
import { PlayerConfig } from '@/utils/Interfaces';
let userName = '';
if (typeof window !== 'undefined' && window.localStorage) {
  userName = localStorage.getItem('userName') || '';
}

const DeviceId = getDeviceId().then((deviceId) => {
  return deviceId;
});

export const V2PlayerConfig: PlayerConfig = {
  context: {
    mode: 'play',
    partner: [],
    pdata: {
      id: 'pratham.admin.portal',
      ver: '1.0.0',
      pid: 'admin-portal',
    },
    contentId: '',
    sid: '',
    uid: '',
    timeDiff: -0.089,
    channel: process.env.NEXT_PUBLIC_CHANNEL_ID || '',
    tags: [process.env.NEXT_PUBLIC_CHANNEL_ID || ''],
    did: DeviceId,
    contextRollup: { l1: process.env.NEXT_PUBLIC_CHANNEL_ID || '' },
    objectRollup: {},
    userData: { firstName: userName, lastName: '' },
    host: '',
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
      showShare: false,
      showDownload: true,
      showExit: true,
      showPrint: false,
      showReplay: true,
    },
  },
  data: {},
};

export const V1PlayerConfig: PlayerConfig = {
  config: {
    whiteListUrl: [],
    showEndPage: true,
    endPage: [
      {
        template: 'assessment',
        contentType: ['SelfAssess'],
      },
    ],
    showStartPage: true,
    host: '',
    overlay: {
      enableUserSwitcher: true,
      showOverlay: true,
      showNext: true,
      showPrevious: true,
      showSubmit: false,
      showReload: false,
      showUser: false,
      showExit: true,
      menu: {
        showTeachersInstruction: false,
      },
    },
    splash: {
      text: '',
      icon: '',
      bgImage: 'assets/icons/splacebackground_1.png',
      webLink: '',
    },
    apislug: '',
    repos: ['/sunbird-plugins/renderer'],
    plugins: [
      {
        id: 'org.sunbird.iframeEvent',
        ver: 1,
        type: 'plugin',
      },
      {
        id: 'org.sunbird.player.endpage',
        ver: 1.1,
        type: 'plugin',
      },
    ],
    sideMenu: {
      showShare: true,
      showDownload: true,
      showExit: true,
    },
    enableTelemetryValidation: false,
  },
  context: {
    mode: 'play',
    // partner: [],
    pdata: {
      id: 'pratham.admin.portal',
      ver: '1.0.0',
      pid: 'admin-portal',
    },
    contentId: '',
    sid: '',
    uid: '',
    timeDiff: -1.129,
    contextRollup: {},
    channel: process.env.NEXT_PUBLIC_CHANNEL_ID || '',
    did: '',
    dims: [],
    tags: [process.env.NEXT_PUBLIC_CHANNEL_ID || ''],
    app: [process.env.NEXT_PUBLIC_CHANNEL_ID || ''],
    cdata: [],
    userData: {
      firstName: userName,
      lastName: '',
    },
  },
  data: {},
};

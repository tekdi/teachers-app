import { PlayerConfig } from "@/utils/Interfaces";

export const V2PlayerConfig: PlayerConfig = {
  context: {
    mode: "play",
    partner: [],
    pdata: {
      id: "pratham.admin.portal",
      ver: "1.0.0",
      pid: "admin-portal",
    },
    contentId: "do_12345",
    sid: "",
    uid: "",
    timeDiff: -0.089,
    channel: "test-k12-channel",
    tags: ["test-k12-channel"],
    did: "",
    contextRollup: { l1: "test-k12-channel" },
    objectRollup: {},
    userData: { firstName: "Guest", lastName: "User" },
    host: "https://telemetry.prathamdigital.org",
    endpoint: "/v1/telemetry",
  },
  config: {
    showEndPage: false,
    endPage: [{ template: "assessment", contentType: ["SelfAssess"] }],
    showStartPage: true,
    host: "",
    overlay: { showUser: false },
    splash: {
      text: "",
      icon: "",
      bgImage: "assets/icons/splacebackground_1.png",
      webLink: "",
    },
    apislug: "",
    repos: ["/sunbird-plugins/renderer"],
    plugins: [
      { id: "org.sunbird.iframeEvent", ver: 1, type: "plugin" },
      { id: "org.sunbird.player.endpage", ver: 1.1, type: "plugin" },
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
        template: "assessment",
        contentType: ["SelfAssess"],
      },
    ],
    showStartPage: true,
    host: "",
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
      text: "",
      icon: "",
      bgImage: "assets/icons/splacebackground_1.png",
      webLink: "",
    },
    apislug: "",
    repos: ["/sunbird-plugins/renderer"],
    plugins: [
      {
        id: "org.sunbird.iframeEvent",
        ver: 1,
        type: "plugin",
      },
      {
        id: "org.sunbird.player.endpage",
        ver: 1.1,
        type: "plugin",
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
    mode: "play",
    // partner: [],
    pdata: {
      id: "pratham.admin.portal",
      ver: "1.0.0",
      pid: "admin-portal",
    },
    contentId: "do_12345",
    sid: "",
    uid: "",
    timeDiff: -1.129,
    contextRollup: {},
    channel: "test-k12-channel",
    did: "",
    dims: [],
    tags: ["test-k12-channel"],
    app: ["test-k12-channel"],
    cdata: [],
    userData: {
      firstName: "Guest",
      lastName: "User",
    },
  },
  data: {}
};

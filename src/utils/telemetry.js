import { generateUUID } from './Helper';

let CsTelemetryModule;
let EkTelemetry;
let jQuery;

if (typeof window !== 'undefined') {
  CsTelemetryModule = require('@project-sunbird/client-services/telemetry').CsTelemetryModule;
  EkTelemetry = require('@project-sunbird/telemetry-sdk');
  jQuery = require('jquery');
  window.jQuery = jQuery;
}

const telemetryConfig = {
  apislug: '',
  pdata: {
    id: 'pratham.portal',
    pid: '0.0.1',
    ver: 'pratham.portal'
  },
  env: 'pratham.portal',
  channel: '',
  did: 'did',
  authtoken: '',
  studentid: 'student-id',
  uid: (typeof window !== 'undefined' && localStorage.getItem('id')) || 'id',
  sid: 'session-id',
  batchsize: 1,
  mode: '',
  host: 'https://qa.prathamteacherapp.tekdinext.com', //TODO: Change this host and endpoint properly
  endpoint: '/telemetry/v1/telemetry',
  tags: []
};

export const telemetryFactory = {
  init: () => {
    if (typeof window !== 'undefined') {
      console.log('EkTelemetry', EkTelemetry);
      if (!CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.init({});
        CsTelemetryModule.instance.telemetryService.initTelemetry({
          config: telemetryConfig,
          userOrgDetails: {}
        });
      }
    }
  },

  interact: (interactEventInput) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(interactEventInput);
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
          options: eventData.options,
          edata: eventData.edata
        });
      }
    }
  },

  impression: (impressionEventInput) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(impressionEventInput);
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
          options: eventData.options,
          edata: eventData.edata
        });
      }
    }
  },

  assess: (assessEventInput) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(assessEventInput);
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry({
          options: eventData.options,
          edata: eventData.edata
        });
      }
    }
  },

  response: (responseEventInput) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(responseEventInput);
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry({
          options: eventData.options,
          edata: eventData.edata
        });
      }
    }
  },

  interrupt: (interactEventInput) => {
    if (typeof window !== 'undefined') {
      const eventData = getEventData(interactEventInput);
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseInterruptTelemetry({
          options: eventData.options,
          edata: eventData.edata
        });
      }
    }
  },

  start: ({ appName, ...edata }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('id') || 'testID' },
        actor: {
          id: localStorage.getItem('id') || 'testID',
          type: 'Teacher'
        },
        context: {
          type: appName ? appName : 'Standalone'
        },
        edata
      };
    }
  },

  end: ({ appName, ...edata }) => {
    if (typeof window !== 'undefined') {
      return {
        type: edata?.type,
        eid: generateUUID(),
        $set: { id: localStorage.getItem('id') },
        actor: {
          id: localStorage.getItem('id'),
          type: 'Teacher'
        },
        context: {
          type: appName ? appName : 'Standalone'
        },
        edata
      };
    }
  }
};

function getEventData(eventInput) {
  const timestamp = Date.now();
  const event = {
    edata: eventInput.edata,
    options: {
      context: getEventContext(eventInput),
      object: getEventObject(eventInput),
      tags: []
    },
    ets: timestamp
  };
  return event;
}

function getEventObject(eventInput) {
  if (eventInput.object) {
    const eventObjectData = {
      id: eventInput.object.id || '',
      type: eventInput.object.type || '',
      ver: eventInput.object.ver || '',
      rollup: eventInput.object.rollup || {}
    };
    return eventObjectData;
  } else {
    return {};
  }
}

function getEventContext(eventInput) {
  const eventContextData = {
    channel: eventInput.edata.channel || telemetryConfig.channel,
    pdata: eventInput.context.pdata || telemetryConfig.pdata,
    env: eventInput.context.env || telemetryConfig.env,
    sid: eventInput.sid || telemetryConfig.sid,
    uid: (typeof window !== 'undefined' && localStorage.getItem('id')) || telemetryConfig.uid, //user id
    cdata: eventInput.context.cdata || []
  };
  if (telemetryConfig.sid) {
    eventContextData.cdata.push({
      id: telemetryConfig.sid,
      type: 'UserSession'
    });
  }
  eventContextData.cdata.push({
    id: 'uuid',
    type: 'Device'
  });
  return eventContextData;
}

function getRollUpData(data = []) {
  const rollUp = {};
  data.forEach((element, index) => (rollUp['l' + (index + 1)] = element));
  return rollUp;
}

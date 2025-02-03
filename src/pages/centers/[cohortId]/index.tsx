import {
  formatSelectedDate,
  getAfterDate,
  getBeforeDate,
  getMonthName,
  getTodayDate,
  shortDateFormat,
  sortSessions,
  sortSessionsByTime,
  toPascalCase,
} from '@/utils/Helper';
import {
  Button,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { ComponentType, useEffect, useState } from 'react';

import AddLearnerModal from '@/components/AddLeanerModal';
import CenterSessionModal from '@/components/CenterSessionModal';
import CohortFacilitatorList from '@/components/CohortFacilitatorList';
import CohortLearnerList from '@/components/CohortLearnerList';
import Header from '@/components/Header';

import WeekCalender from '@/components/WeekCalender';
import DeleteCenterModal from '@/components/center/DeleteCenterModal';
import RenameCenterModal from '@/components/center/RenameCenterModal';
import { getCohortDetails } from '@/services/CohortServices';
import { getEventList } from '@/services/EventService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { CustomField } from '@/utils/Interfaces';
import { Role, Telemetry, sessionType } from '@/utils/app.constant';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Session } from '../../../utils/Interfaces';

import manageUserStore from '@/store/manageUserStore';
import withAccessControl from '@/utils/hoc/withAccessControl';
import {
  accessControl,
  eventDaysLimit,
  modifyAttendanceLimit,
} from '../../../../app.config';
import { useDirection } from '../../../hooks/useDirection';

import useEventDates from '@/hooks/useEventDates';
import useNotification from '@/hooks/useNotification';
import {
  getMyCohortFacilitatorList,
  getMyCohortMemberList,
} from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { telemetryFactory } from '@/utils/telemetry';
import dynamic from 'next/dynamic';
import { setTimeout } from 'timers';
import { isEliminatedFromBuild } from '../../../../featureEliminationUtil';

let SessionCardFooter: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCardFooter', 'component')) {
  SessionCardFooter = dynamic(() => import('@/components/SessionCardFooter'), {
    ssr: false,
  });
}
let SessionCard: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCard', 'component')) {
  SessionCard = dynamic(() => import('@/components/SessionCard'), {
    ssr: false,
  });
}

let DeleteSession: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('DeleteSession', 'component')) {
  DeleteSession = dynamic(() => import('@/components/DeleteSession'), {
    ssr: false,
  });
}

let PlannedSession: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('PlannedSession', 'component')) {
  PlannedSession = dynamic(() => import('@/components/PlannedSession'), {
    ssr: false,
  });
}

let Schedule: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('Schedule', 'component')) {
  Schedule = dynamic(() => import('@/components/Schedule'), {
    ssr: false,
  });
}

const CohortPage = () => {
  const userStore = useStore();
  const isActiveYear = userStore.isActiveYearSelected;
  const router = useRouter();

  const [value, setValue] = React.useState(() => {
    return isEliminatedFromBuild('Events', 'feature') || !isActiveYear
      ? 2
      : router.query.tab
        ? Number(router.query.tab)
        : 1;
  });
  const [showDetails, setShowDetails] = React.useState(false);
  const [classId, setClassId] = React.useState('');
  const { cohortId }: any = router.query;
  const { t, i18n } = useTranslation();
  const { dir, isRTL } = useDirection();
  const [role, setRole] = React.useState<any>('');

  // const store = manageUserStore();
  const setDistrictCode = manageUserStore(
    (state: { setDistrictCode: any }) => state.setDistrictCode
  );
  const setDistrictId = manageUserStore(
    (state: { setDistrictId: any }) => state.setDistrictId
  );
  const setStateCode = manageUserStore(
    (state: { setStateCode: any }) => state.setStateCode
  );
  const setStateId = manageUserStore(
    (state: { setStateId: any }) => state.setStateId
  );
  const setBlockCode = manageUserStore(
    (state: { setBlockCode: any }) => state.setBlockCode
  );
  const setBlockId = manageUserStore(
    (state: { setBlockId: any }) => state.setBlockId
  );

   const { tab} = router.query;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme<any>();
  const [selectedDate, setSelectedDate] =
    React.useState<string>(getTodayDate());

  const [cohortDetails, setCohortDetails] = React.useState<any>({});
  const [reloadState, setReloadState] = React.useState<boolean>(false);
  const [sessions, setSessions] = React.useState<Session[]>();
  const [extraSessions, setExtraSessions] = React.useState<Session[]>();
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState<any>(null);
  const [openRenameCenterModal, setOpenRenameCenterModal] =
    React.useState(false);
  const [openDeleteCenterModal, setOpenDeleteCenterModal] =
    React.useState(false);
  const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
  const [openSchedule, setOpenSchedule] = React.useState(false);
  const [disableNextButton, setDisableNextButton] = React.useState(true);

  const [eventDeleted, setEventDeleted] = React.useState(false);
  const [eventUpdated, setEventUpdated] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [cohortName, setCohortName] = React.useState<string>();
  const [cohortType, setCohortType] = React.useState<string>();
  const [medium, setMedium] = React.useState<string>();
  const [grade, setGrade] = React.useState<string>();
  const [board, setBoard] = React.useState<string>();
  const [state, setState] = React.useState<string>();
  const [clickedBox, setClickedBox] = useState<string | null>(null);
  const [isLearnerAdded, setIsLearnerAdded] = useState(false);
  const [createEvent, setCreateEvent] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [onEditEvent, setOnEditEvent] = useState(false);
  const [sortedSessions, setSortedSessions] = useState<any>([]);
  const [initialSlideIndex, setInitialSlideIndex] = useState<any>();
  const [cohortFacilitatorListCount, setCohortFacilitatorListCount] = useState<any>();
  const cohortFacilitatorsCount = useStore(
    (state: { cohortFacilitatorsCount: any }) => state.cohortFacilitatorsCount
  );
  const [cohortLearnerListCount, setCohortLearnerListCount] = useState<any>();
  const cohortLearnerCount = useStore(
    (state: { cohortLearnerCount: any }) => state.cohortLearnerCount
  );
  const handleClick = (selection: string) => {
    setDisableNextButton(false);
    setClickedBox(selection);
  };

  const removeModal = () => {
    setDeleteModal(true);
  };

  const handleCentermodel = () => {
    setOpenSchedule(true);
  };

  const { getNotification } = useNotification();

  const handleSchedule = async () => {
    setCreateEvent((prev) => !prev);

    setTimeout(() => {
      setCreateEvent((prev) => !prev);
    });
  };

  const handleCloseSchedule = () => {
    setEventCreated((prev) => !prev);
    handleClose();
  };

  useEffect(() => {
    if (eventCreated) {
      setOpen(false);
      setCreateEvent(false);
    }
  }, [eventCreated, createEvent]);

  // useEffect(() => {
  //   setCohortFacilitatorListCount(cohortFacilitatorsCount);
  //   setCohortLearnerListCount(cohortLearnerCount);
  // }, [cohortFacilitatorsCount, cohortLearnerCount]);

  const handleOpen = () => {
    setOpen(true);
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'click-on-schedule-sessions',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenSchedule(false);
    setDeleteModal(false);
    setClickedBox(null);
    setDisableNextButton(true);
  };
  const setRemoveCohortId = reassignLearnerStore(
    (state) => state.setRemoveCohortId
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const role = localStorage.getItem('role');
      setRole(role);
    }
  }, []);

  useEffect(() => {
    const getCohortData = async () => {
      const response = await getCohortDetails(cohortId);

      let cohortData = null;

      if (response?.cohortData?.length) {
        cohortData = response?.cohortData[0];
        setRemoveCohortId(cohortData?.cohortId);

        if (cohortData?.customField?.length) {
          const district = cohortData.customField.find(
            (item: CustomField) => item.label === 'DISTRICTS'
          );
          const districtCode = district?.code || '';
          const districtId = district?.fieldId || '';
          const state = cohortData.customField.find(
            (item: CustomField) => item.label === 'STATES'
          );
          setState(state?.value);
          const stateCode = state?.code || '';
          const stateId = state?.fieldId || '';

          const blockField = cohortData?.customField.find(
            (field: any) => field.label === 'BLOCKS'
          );

          const address = `${toPascalCase(district?.value)}, ${toPascalCase(state?.value)}`;
          cohortData.address = address || '';

          const typeOfCohort = cohortData.customField.find(
            (item: CustomField) => item.label === 'TYPE_OF_COHORT'
          );
          setCohortType(typeOfCohort?.value);

          const medium = cohortData.customField.find(
            (item: CustomField) => item.label === 'MEDIUM'
          );
          setMedium(medium?.value);

          const grade = cohortData.customField.find(
            (item: CustomField) => item.label === 'GRADE'
          );
          setGrade(grade?.value);

          const board = cohortData.customField.find(
            (item: CustomField) => item.label === 'BOARD'
          );
          setBoard(board?.value);
        }
        setCohortDetails(cohortData);
        setCohortName(cohortData?.name);
      }
    };

    if (cohortId) {
      getCohortData();
    }
  }, [cohortId]);

  useEffect(() => {
    const getCohortMemberList = async () => {
      if (cohortId) {
        try {
          const page = 0;
          const filters = { cohortId: cohortId };
          const facilitatorResponse = await getMyCohortFacilitatorList({
            filters,
          });
          if (facilitatorResponse?.result?.userDetails) {
            setCohortFacilitatorListCount(
              facilitatorResponse?.result?.userDetails.length
            );
          } else setCohortFacilitatorListCount(0);
        } catch (error) {
          setCohortFacilitatorListCount(0);
        }
        try {
          const filters = { cohortId: cohortId };

          const learnerResponse = await getMyCohortMemberList({
            filters,
          });
          if (learnerResponse?.result?.userDetails) {
            setCohortLearnerListCount(
              learnerResponse?.result?.userDetails.length
            );
          } else {
            setCohortLearnerListCount(0);
          }
        } catch (error) {
          setCohortLearnerListCount(0);
        }
      }
    };
    getCohortMemberList();
  }, [cohortId, reloadState]);
  useEffect(() => {
    const getSessionsData = async () => {
      try {
        const afterDate = getAfterDate(selectedDate);
        const beforeDate = getBeforeDate(selectedDate);
        const limit = 0;
        const offset = 0;
        const filters = {
          date: {
            after: afterDate,
            before: beforeDate,
          },
          cohortId: cohortId,
          status: ['live'],
        };
        const response = await getEventList({ limit, offset, filters });
        const sessionArray: any[] = [];
        if (response?.events?.length > 0) {
          response.events.forEach((event: any) => {
            if (event?.metadata?.type === sessionType.PLANNED) {
              sessionArray.push(event);
            }
          });
        }
        const eventList = sortSessions(sessionArray);
        setSessions(eventList);
        setEventUpdated(false);
        setEventDeleted(false);
      } catch (error) {
        setSessions([]);
      }
    };

    getSessionsData();
  }, [selectedDate, eventCreated, eventDeleted, eventUpdated]);

  const eventDates = useEventDates(
    cohortId,
    'cohortId',
    modifyAttendanceLimit,
    selectedDate,
    eventUpdated,
    eventDeleted,
    eventCreated
  );

  useEffect(() => {
    const getExtraSessionsData = async () => {
      try {
        const date = new Date();
        const startDate = shortDateFormat(new Date());
        const lastDate = new Date(
          date.setDate(date.getDate() + modifyAttendanceLimit)
        );
        const endDate = shortDateFormat(lastDate);
        const afterDate = getAfterDate(startDate);
        const beforeDate = getBeforeDate(endDate);
        const limit = 0;
        const offset = 0;
        const filters = {
          startDate: {
            after: afterDate,
          },
          endDate: {
            before: beforeDate,
          },
          cohortId: cohortId,
          status: ['live'],
        };
        const response = await getEventList({ limit, offset, filters });
        const extraSessionArray: any[] = [];
        if (response?.events?.length > 0) {
          response.events.forEach((event: any) => {
            if (event?.metadata?.type === sessionType.EXTRA) {
              extraSessionArray.push(event);
            }
          });
        }
        setExtraSessions(extraSessionArray);
      } catch (error) {
        setExtraSessions([]);
      }
    };
    setEventUpdated(false);
    setEventDeleted(false);
    getExtraSessionsData();
  }, [eventCreated, eventDeleted, eventUpdated]);

  useEffect(() => {
    if (extraSessions) {
      const { sessionList, index } = sortSessionsByTime(extraSessions);
      const eventList = sortSessions(sessionList);
      setSortedSessions(eventList);

      if (index > 0) {
        setInitialSlideIndex(index);
      } else {
        setInitialSlideIndex(0);
      }
    }
  }, [extraSessions]);
  useEffect(() => {
    if (router.isReady) {
      const queryParamValue = router.query.tab ? Number(router.query.tab) : 1;

      if ([1, 2, 3].includes(queryParamValue)) setValue(queryParamValue);
      else setValue(1);
    }
  }, [router.isReady, router.query.tab]);
  useEffect(() => {
    if (router.isReady) {
      const updatedQuery = { ...router.query, tab: value };

      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [value]);
  const handleEventDeleted = () => {
    setEventDeleted(true);
  };

  const handleEventUpdated = () => {
    setEventUpdated(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id:
          newValue === 1
            ? 'change-tab-to-center-session'
            : newValue === 2
              ? 'change-tab-to-learners-list'
              : 'change-tab-to-facilitators-list',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleBackEvent = () => {
    router.push('/centers');
    //   window.history.back();
  };

  const showDetailsHandle = (dayStr: string) => {
    setSelectedDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameCenterClose = (name: string) => {
    if (name) {
      setCohortName(name);
      const cohortInfo: any = { ...cohortDetails };
      cohortInfo.name = name;
      setCohortDetails(cohortInfo);
    }
    setOpenRenameCenterModal(false);
  };

  const handleDeleteCenterClose = () => {
    setOpenDeleteCenterModal(false);
  };

  const handleOpenAddLearnerModal = () => {
    setOpenAddLearnerModal(true);

    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'click-on-add-new-learner',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
  };

  const viewAttendanceHistory = () => {
    if (classId !== 'all') {
      router.push(`${cohortId}/events/${getMonthName()?.toLowerCase()}`);
      ReactGA.event('month-name-clicked', { selectedCohortID: classId });
    }
  };

  const handleLearnerAdded = () => {
    setIsLearnerAdded(true);
    setReloadState(!reloadState);
  };

  const handleEditEvent = () => {
    setOnEditEvent(true);
  };
  const [swiperKey, setSwiperKey] = useState(0);

  useEffect(() => {
    setSwiperKey((prevKey) => prevKey + 1);
  }, [i18n.language]);

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#4D4639',
            padding: '15px 17px 5px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={handleBackEvent}
          >
            <KeyboardBackspaceOutlinedIcon
              sx={{
                color: theme.palette.warning['A200'],
                marginTop: '18px',
                transform: isRTL ? ' rotate(180deg)' : 'unset',
              }}
            />
            <Box m={'1rem 1rem 0.5rem 0.5rem'} display={'column'} gap={'5px'}>
              <Typography textAlign={'left'} fontSize={'22px'}>
                {toPascalCase(cohortDetails?.name)}
              </Typography>
              {cohortDetails?.centerType && (
                <Typography textAlign={'left'} fontSize={'22px'}>
                  {cohortDetails?.centerType}
                </Typography>
              )}
              <Box>
                <Typography
                  textAlign={'left'}
                  fontSize={'11px'}
                  fontWeight={500}
                >
                  {cohortDetails?.address}
                </Typography>
              </Box>
            </Box>
          </Box>
          {role === Role.TEAM_LEADER && isActiveYear && (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ color: theme.palette.warning['A200'] }}
            >
              <MoreVertIcon sx={{ cursor: 'pointer' }} />
            </IconButton>
          )}
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setOpenRenameCenterModal(true);
                handleMenuClose();

                const windowUrl = window.location.pathname;
                const cleanedUrl = windowUrl.replace(/^\//, '');
                const telemetryInteract = {
                  context: {
                    env: 'teaching-center',
                    cdata: [],
                  },
                  edata: {
                    id: 'click-on-rename-center',
                    type: Telemetry.CLICK,
                    subtype: '',
                    pageid: cleanedUrl,
                  },
                };
                telemetryFactory.interact(telemetryInteract);
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.RENAME_CENTER')}
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                setOpenDeleteCenterModal(true);
                handleMenuClose();

                const windowUrl = window.location.pathname;
                const cleanedUrl = windowUrl.replace(/^\//, '');
                const telemetryInteract = {
                  context: {
                    env: 'teaching-center',
                    cdata: [],
                  },
                  edata: {
                    id: 'click-on-delete-center-option',
                    type: Telemetry.CLICK,
                    subtype: '',
                    pageid: cleanedUrl,
                  },
                };
                telemetryFactory.interact(telemetryInteract);
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.REQUEST_TO_DELETE')}
            </MenuItem> */}
          </Menu>

          {openRenameCenterModal && (
            <RenameCenterModal
              open={openRenameCenterModal}
              handleClose={handleRenameCenterClose}
              reloadState={reloadState}
              setReloadState={setReloadState}
              name={cohortDetails?.name}
            />
          )}
          <DeleteCenterModal
            open={openDeleteCenterModal}
            handleClose={handleDeleteCenterClose}
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: '1px solid #EBE1D4',

            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          {!isEliminatedFromBuild('Events', 'feature') && isActiveYear && (
            <Tab value={1} label={t('COMMON.CENTER_SESSIONS')} />
          )}

          <Tab value={2} label={t('COMMON.LEARNER_LIST')+ 
    (cohortLearnerListCount!==undefined ?"("+ cohortLearnerListCount+")": "")} />
          {role === Role.TEAM_LEADER && (
            <Tab 
  value={3} 
  label={
    t('COMMON.FACILITATOR_LIST') + 
    (cohortFacilitatorListCount!==undefined ? "("+cohortFacilitatorListCount+")": "")
  } 
/>
          )}
        </Tabs>
      </Box>
      {!isEliminatedFromBuild('SessionCardFooter', 'component') &&
        SessionCardFooter &&
        SessionCard && (
          <>
            {value === 1 && (
              <>
                <Box mt={3} px="18px">
                  <Button
                    sx={{
                      border: `1px solid ${theme.palette.error.contrastText}`,
                      borderRadius: '100px',
                      height: '40px',
                      px: '16px',
                      color: theme.palette.error.contrastText,
                    }}
                    onClick={handleOpen}
                    className="text-1E"
                    endIcon={<AddIcon />}
                  >
                    {t('COMMON.SCHEDULE_NEW')}
                  </Button>
                </Box>

                <CenterSessionModal
                  open={open}
                  handleClose={handleClose}
                  title={
                    deleteModal
                      ? t('CENTER_SESSION.DELETE_SESSION')
                      : openSchedule
                        ? clickedBox === 'EXTRA_SESSION'
                          ? 'Extra Session'
                          : t('CENTER_SESSION.PLANNED_SESSION')
                        : t('CENTER_SESSION.SCHEDULE')
                  }
                  primary={
                    deleteModal
                      ? t('COMMON.OK')
                      : openSchedule
                        ? t('CENTER_SESSION.SCHEDULE')
                        : onEditEvent
                          ? t('CENTER_SESSION.UPDATE')
                          : t('GUIDE_TOUR.NEXT')
                  }
                  secondary={deleteModal ? t('COMMON.CANCEL') : undefined}
                  handlePrimaryModel={
                    deleteModal
                      ? undefined
                      : openSchedule
                        ? handleSchedule
                        : onEditEvent
                          ? handleEditEvent
                          : handleCentermodel
                  }
                  handleEditModal={handleEditEvent}
                  disable={onEditEvent ? false : disableNextButton}
                >
                  {deleteModal
                    ? DeleteSession && <DeleteSession />
                    : openSchedule
                      ? PlannedSession && (
                          <PlannedSession
                            clickedBox={clickedBox}
                            removeModal={removeModal}
                            scheduleEvent={createEvent}
                            cohortName={cohortName}
                            cohortType={cohortType}
                            cohortId={cohortId}
                            onCloseModal={handleCloseSchedule}
                            StateName={state}
                            board={board}
                            medium={medium}
                            grade={grade}
                          />
                        )
                      : Schedule && (
                          <>
                            {!clickedBox && (
                              <Typography sx={{ m: 2 }}>
                                {t('CENTER_SESSION.SELECT_SESSION')}
                              </Typography>
                            )}
                            <Schedule
                              clickedBox={clickedBox}
                              handleClick={handleClick}
                            />
                          </>
                        )}
                </CenterSessionModal>

                <Box mt={3} px="18px">
                  <Box
                    className="fs-14 fw-500"
                    sx={{ color: theme.palette.warning['300'] }}
                  >
                    {t('COMMON.UPCOMING_EXTRA_SESSION', {
                      days: eventDaysLimit,
                    })}
                  </Box>
                  <Box mt={3} sx={{ position: 'relative' }}>
                    {initialSlideIndex >= 0 && (
                      <Swiper
                        key={swiperKey} // This will force Swiper to remount when the key changes
                        initialSlide={initialSlideIndex}
                        pagination={{
                          type: 'fraction',
                        }}
                        breakpoints={{
                          600: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                          },
                          900: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          1200: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                          },
                          2000: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                          },
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                      >
                        {sortedSessions?.map((item: any, index: any) => (
                          <SwiperSlide
                            style={{ paddingBottom: '38px' }}
                            key={index}
                          >
                            {SessionCard && (
                              <SessionCard
                                data={item}
                                isEventDeleted={handleEventDeleted}
                                isEventUpdated={handleEventUpdated}
                                StateName={state}
                                board={board}
                                medium={medium}
                                grade={grade}
                              >
                                {SessionCardFooter && (
                                  <SessionCardFooter
                                    item={item}
                                    cohortName={cohortName}
                                    isTopicSubTopicAdded={handleEventUpdated}
                                    state={state}
                                    board={board}
                                    medium={medium}
                                    grade={grade}
                                    cohortId={cohortId}
                                  />
                                )}
                              </SessionCard>
                            )}
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </Box>
                  {extraSessions && extraSessions?.length === 0 && (
                    <Box
                      className="fs-12 fw-400 italic"
                      sx={{ color: theme.palette.warning['300'] }}
                    >
                      {t('COMMON.NO_SESSIONS_SCHEDULED')}
                    </Box>
                  )}
                </Box>

                <Box sx={{ padding: '10px 16px', mt: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme?.palette?.warning['300'],
                        marginBottom: '15px',
                      }}
                    >
                      {t('CENTER_SESSION.PLANNED_SESSIONS')}
                    </Box>
                    <Box>
                      <Box
                        display={'flex'}
                        sx={{
                          cursor: 'pointer',
                          color: theme.palette.secondary.main,
                          gap: '4px',
                          opacity: classId === 'all' ? 0.5 : 1,
                          alignItems: 'center',
                        }}
                        onClick={viewAttendanceHistory}
                      >
                        <Typography
                          marginBottom={'0'}
                          style={{ fontWeight: '500' }}
                        >
                          {getMonthName()}
                        </Typography>
                        <CalendarMonthIcon sx={{ fontSize: '18px' }} />
                      </Box>
                    </Box>
                  </Box>
                  <WeekCalender
                    showDetailsHandle={showDetailsHandle}
                    data={percentageAttendanceData}
                    disableDays={classId === 'all'}
                    classId={classId}
                    showFromToday={true}
                    newWidth={'100%'}
                    eventData={eventDates}
                  />
                </Box>

                <Box mt={3} px="18px">
                  <Grid container spacing={3}>
                    {sessions?.map((item) => (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        mb={2}
                        key={item.id}
                      >
                        {SessionCard && (
                          <SessionCard
                            data={item}
                            isEventDeleted={handleEventDeleted}
                            isEventUpdated={handleEventUpdated}
                            StateName={state}
                            board={board}
                            medium={medium}
                            grade={grade}
                          >
                            {SessionCardFooter && (
                              <SessionCardFooter
                                item={item}
                                cohortName={cohortName}
                                isTopicSubTopicAdded={handleEventUpdated}
                                state={state}
                                board={board}
                                medium={medium}
                                grade={grade}
                                cohortId={cohortId}
                              />
                            )}
                          </SessionCard>
                        )}
                      </Grid>
                    ))}
                    {sessions && sessions.length === 0 && (
                      <Box
                        className="fs-12 fw-400 italic"
                        sx={{ color: theme.palette.warning['300'], px: '16px' }}
                      >
                        {t('COMMON.NO_SESSIONS_SCHEDULED')}
                      </Box>
                    )}
                  </Grid>
                </Box>
              </>
            )}
          </>
        )}

      <Box>
        {value === 2 && (
          <>
            {isActiveYear && (
              <Box>
                <Box mt={3} px={'18px'}>
                  <Button
                    sx={{
                      border: '1px solid #1E1B16',
                      borderRadius: '100px',
                      height: '40px',
                      px: '16px',
                      color: theme.palette.error.contrastText,
                      '& .MuiButton-endIcon': {
                        marginLeft: isRTL ? '0px !important' : '8px !important',
                        marginRight: isRTL
                          ? '8px !important'
                          : '-2px !important',
                      },
                    }}
                    className="text-1E"
                    endIcon={<AddIcon />}
                    onClick={handleOpenAddLearnerModal}
                  >
                    {t('COMMON.ADD_NEW')}
                  </Button>
                </Box>
                <Box
                  px={'18px'}
                  mt={2}
                  sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      cursor: 'pointer',
                    }}
                    className="fs-14 fw-500"
                    onClick={() => {
                      router.push('/attendance-overview');
                    }}
                  >
                    {t('COMMON.REVIEW_ATTENDANCE')}
                  </Box>
                  <ArrowForwardIcon
                    sx={{
                      fontSize: '18px',
                      color: theme.palette.secondary.main,
                      transform: isRTL ? ' rotate(180deg)' : 'unset',
                    }}
                  />
                </Box>
              </Box>
            )}
            <Box>
              <CohortLearnerList
                cohortId={cohortId}
                reloadState={reloadState}
                setReloadState={setReloadState}
                isLearnerAdded={isLearnerAdded}
              />
            </Box>
            {openAddLearnerModal && (
              <AddLearnerModal
                open={openAddLearnerModal}
                onClose={handleCloseAddLearnerModal}
                onLearnerAdded={handleLearnerAdded}
              />
            )}
          </>
        )}
      </Box>
      <Box>
        {value === 3 && (
          <>
            <Box mt={3} px={'18px'}></Box>
            <CohortFacilitatorList
              cohortId={cohortId}
              reloadState={reloadState}
              setReloadState={setReloadState}
            />
          </>
        )}
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withAccessControl('accessCenters', accessControl)(CohortPage);

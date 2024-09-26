import {
  formatSelectedDate,
  getAfterDate,
  getBeforeDate,
  getMonthName,
  getTodayDate,
  shortDateFormat,
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
import React, { useEffect, useState } from 'react';

import AddLearnerModal from '@/components/AddLeanerModal';
import CenterSessionModal from '@/components/CenterSessionModal';
import CohortFacilitatorList from '@/components/CohortFacilitatorList';
import CohortLearnerList from '@/components/CohortLearnerList';
import DeleteSession from '@/components/DeleteSession';
import Header from '@/components/Header';
import PlannedSession from '@/components/PlannedSession';
import SessionCard from '@/components/SessionCard';
import SessionCardFooter from '@/components/SessionCardFooter';
import WeekCalender from '@/components/WeekCalender';
import DeleteCenterModal from '@/components/center/DeleteCenterModal';
import RenameCenterModal from '@/components/center/RenameCenterModal';
import { getCohortDetails } from '@/services/CohortServices';
import { getEventList } from '@/services/EventService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { CustomField } from '@/utils/Interfaces';
import { Role } from '@/utils/app.constant';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import Schedule from '../../../components/Schedule';
import { Session } from '../../../utils/Interfaces';

import manageUserStore from '@/store/manageUserStore';
import {
  accessControl,
  eventDaysLimit,
  modifyAttendanceLimit,
} from '../../../../app.config';
import withAccessControl from '@/utils/hoc/withAccessControl';

const CohortPage = () => {
  const [value, setValue] = React.useState(1);
  const [showDetails, setShowDetails] = React.useState(false);
  const [classId, setClassId] = React.useState('');
  const router = useRouter();
  const { cohortId }: any = router.query;
  const { t } = useTranslation();
  const [role, setRole] = React.useState<any>('');

  const store = manageUserStore();
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

  const handleClick = (selection: string) => {
    setClickedBox(selection);
  };

  const removeModal = () => {
    setDeleteModal(true);
  };

  const handleCentermodel = () => {
    setOpenSchedule(true);
  };

  const handleSchedule = () => {
    console.log('handleSchedule called');
    setCreateEvent(true);
  };

  const handleCloseSchedule = () => {
    setEventCreated(true);
    handleClose();
  };

  useEffect(() => {
    if (eventCreated) {
      setOpen(false);
      setCreateEvent(false);
    }
  }, [eventCreated, createEvent]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setOpenSchedule(false);
    setDeleteModal(false);
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
          setState(state.value);
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
    getCohortData();
  }, []);

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
            if (event?.isRecurring) {
              sessionArray.push(event);
            }
          });
        }
        setSessions(sessionArray);
        setEventUpdated(false);
        setEventDeleted(false);
      } catch (error) {
        setSessions([]);
      }
    };

    getSessionsData();
  }, [selectedDate, eventCreated, eventDeleted, eventUpdated]);

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
            if (!event.isRecurring) {
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
      setSortedSessions(sessionList);

      if (index > 0) {
        setInitialSlideIndex(index);
      } else {
        setInitialSlideIndex(0);
      }
    }
  }, [extraSessions]);

  const handleEventDeleted = () => {
    setEventDeleted(true);
  };

  const handleEventUpdated = () => {
    setEventUpdated(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackEvent = () => {
    window.history.back();
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
  };

  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
  };

  const viewAttendanceHistory = () => {
    if (classId !== 'all') {
      router.push(`${router.asPath}/events/${getMonthName()?.toLowerCase()}`);
      ReactGA.event('month-name-clicked', { selectedCohortID: classId });
    }
  };

  const handleLearnerAdded = () => {
    setIsLearnerAdded(true);
  };

  const handleEditEvent = () => {
    setOnEditEvent(true);
  };

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
              sx={{ color: theme.palette.warning['A200'], marginTop: '18px' }}
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
          {role === Role.TEAM_LEADER && (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ color: theme.palette.warning['A200'] }}
            >
              <MoreVertIcon />
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
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.RENAME_CENTER')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenDeleteCenterModal(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.warning['A200'] }}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              {t('CENTERS.REQUEST_TO_DELETE')}
            </MenuItem>
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
          <Tab value={1} label={t('COMMON.CENTER_SESSIONS')} />
          <Tab value={2} label={t('COMMON.LEARNER_LIST')} />
          {role === Role.TEAM_LEADER && (
            <Tab value={3} label={t('COMMON.FACILITATOR_LIST')} />
          )}
        </Tabs>
      </Box>

      {value === 1 && (
        <>
          <Box mt={3} px="18px">
            <Button
              sx={{
                border: `1px solid ${theme.palette.error.contrastText}`,
                borderRadius: '100px',
                height: '40px',
                width: '163px',
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
          >
            {deleteModal ? (
              <DeleteSession />
            ) : openSchedule ? (
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
            ) : (
              <Schedule clickedBox={clickedBox} handleClick={handleClick} />
            )}
          </CenterSessionModal>

          <Box mt={3} px="18px">
            <Box
              className="fs-14 fw-500"
              sx={{ color: theme.palette.warning['300'] }}
            >
              {t('COMMON.UPCOMING_EXTRA_SESSION', { days: eventDaysLimit })}
            </Box>
            <Box mt={3} sx={{ position: 'relative' }}>
              {initialSlideIndex >= 0 && (
                <Swiper
                  initialSlide={initialSlideIndex}
                  pagination={{
                    type: 'fraction',
                  }}
                  breakpoints={{
                    500: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    740: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    900: {
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
                    <SwiperSlide style={{ paddingBottom: '38px' }} key={index}>
                      <SessionCard
                        data={item}
                        isEventDeleted={handleEventDeleted}
                        isEventUpdated={handleEventUpdated}
                        StateName={state}
                        board={board}
                        medium={medium}
                        grade={grade}
                      >
                        <SessionCardFooter
                          item={item}
                          cohortName={cohortName}
                          isTopicSubTopicAdded={handleEventUpdated}
                          state={state}
                          board={board}
                          medium={medium}
                          grade={grade}
                        />
                      </SessionCard>
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
                  <Typography marginBottom={'0'} style={{ fontWeight: '500' }}>
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
            />
          </Box>

          <Box mt={3} px="18px">
            <Grid container spacing={3}>
              {sessions?.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <SessionCard
                    data={item}
                    isEventDeleted={handleEventDeleted}
                    isEventUpdated={handleEventUpdated}
                    StateName={state}
                    board={board}
                    medium={medium}
                    grade={grade}
                  >
                    <SessionCardFooter
                      item={item}
                      cohortName={cohortName}
                      isTopicSubTopicAdded={handleEventUpdated}
                      state={state}
                      board={board}
                      medium={medium}
                      grade={grade}
                    />
                  </SessionCard>
                </Grid>
              ))}
              {sessions && sessions.length === 0 && (
                <Box
                  className="fs-12 fw-400 italic"
                  sx={{ color: theme.palette.warning['300'] }}
                >
                  {t('COMMON.NO_SESSIONS_SCHEDULED')}
                </Box>
              )}
            </Grid>
          </Box>
        </>
      )}

      <Box>
        {value === 2 && (
          <>
            <Box mt={3} px={'18px'}>
              <Button
                sx={{
                  border: '1px solid #1E1B16',
                  borderRadius: '100px',
                  height: '40px',
                  width: '126px',
                  color: theme.palette.error.contrastText,
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
                sx={{ color: theme.palette.secondary.main }}
                className="fs-14 fw-500"
                onClick={() => {
                  router.push('/attendance-overview');
                }}
              >
                {t('COMMON.REVIEW_ATTENDANCE')}
              </Box>
              <ArrowForwardIcon
                sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
              />
            </Box>
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

import {
  formatSelectedDate,
  getMonthName,
  getTodayDate,
  shortDateFormat,
  toPascalCase,
} from '@/utils/Helper';
import {
  Button,
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
import { getSessions } from '@/services/Sessionservice';
import { CustomField } from '@/utils/Interfaces';
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
import { Session } from '../../utils/Interfaces';
import Schedule from './../../components/Schedule';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { Role } from '@/utils/app.constant';
import { showToastMessage } from '@/components/Toastify';
import { getEventList } from '@/services/EventService';
import { eventDaysLimit, modifyAttendanceLimit } from '../../../app.config';
import manageUserStore from '@/store/manageUserStore';

const TeachingCenterDetails = () => {
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

  const [deleteModal, setDeleteModal] = React.useState(false);

  const [clickedBox, setClickedBox] = useState<string | null>(null);
  const [isLearnerAdded, setIsLearnerAdded] = useState(false);

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
    console.log('API Call');
  };

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
      console.log(response);

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
          const stateCode = state?.code || '';
          const stateId = state?.fieldId || '';

          const blockField = cohortData?.customField.find(
            (field: any) => field.label === 'BLOCKS'
          );

          cohortData.address =
            `${toPascalCase(district?.value)}, ${toPascalCase(state?.value)}` ||
            '';
        }
        setCohortDetails(cohortData);
      }
    };
    getCohortData();
  }, []);

  useEffect(() => {
    const getSessionsData = async () => {
      try {
        const limit = 0;
        const offset = 0;
        const filters = {
          date: selectedDate,
          cohortId: cohortId,
          status: ['live'],
        };
        const response = await getEventList({ limit, offset, filters });
        let sessionArray: any[] = [];
        if (response?.events.length > 0) {
          response?.events.forEach((event: any) => {
            if (event.isRecurring) {
              sessionArray.push(event);
            }
          });
        }
        setSessions(sessionArray);
      } catch (error) {
        setSessions([]);
        showToastMessage(t('COMMON.NO_SESSIONS_SCHEDULED'), 'error');
      }
    };

    getSessionsData();
  }, [selectedDate]);

  useEffect(() => {
    const getExtraSessionsData = async () => {
      try {
        const date = new Date();
        const startDate = shortDateFormat(new Date());
        const lastDate = new Date(
          date.setDate(date.getDate() + modifyAttendanceLimit)
        );
        const endDate = shortDateFormat(lastDate);
        const limit = 0;
        const offset = 0;
        const filters = {
          startDate: startDate,
          endDate: endDate,
          cohortId: cohortId,
          status: ['live'],
        };
        const response = await getEventList({ limit, offset, filters });
        console.log(response);
        let extraSessionArray: any[] = [];
        if (response?.events.length > 0) {
          response?.events.forEach((event: any) => {
            if (!event.isRecurring) {
              console.log(event);
              extraSessionArray.push(event);
            }
          });
        }
        setExtraSessions(extraSessionArray);
      } catch (error) {
        setExtraSessions([]);
        showToastMessage(t('COMMON.NO_SESSIONS_SCHEDULED'), 'error');
      }
      console.log(sessions);
    };

    getExtraSessionsData();
  }, []);

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

  const handleRenameCenterClose = () => {
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
      router.push('/center-session');
      ReactGA.event('month-name-clicked', { selectedCohortID: classId });
    }
  };

  const handleLearnerAdded = () => {
    setIsLearnerAdded(true);
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
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleBackEvent}
          >
            <KeyboardBackspaceOutlinedIcon
              sx={{ color: theme.palette.warning['A200'], marginTop: '8px' }}
            />
            <Box m={'1rem 1rem 0.5rem'} display={'column'} gap={'5px'}>
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
          <RenameCenterModal
            open={openRenameCenterModal}
            handleClose={handleRenameCenterClose}
          />
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
          <Tab value={3} label={t('COMMON.FACILITATOR_LIST')} />
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
                  ? clickedBox === t('CENTER_SESSION.EXTRA_SESSION')
                    ? 'Extra Session'
                    : t('CENTER_SESSION.PLANNED_SESSION')
                  : t('CENTER_SESSION.SCHEDULE')
            }
            primary={
              deleteModal
                ? t('COMMON.OK')
                : openSchedule
                  ? t('CENTER_SESSION.SCHEDULE')
                  : t('GUIDE_TOUR.NEXT')
            }
            secondary={deleteModal ? t('COMMON.CANCEL') : undefined}
            handlePrimaryModel={
              deleteModal
                ? undefined
                : openSchedule
                  ? handleSchedule
                  : handleCentermodel
            }
          >
            {deleteModal ? (
              <DeleteSession />
            ) : openSchedule ? (
              <PlannedSession
                clickedBox={clickedBox}
                removeModal={removeModal}
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
            <Box mt={3} px="18px">
              {extraSessions?.map((item) => (
                <SessionCard data={item} key={item.id}>
                  <SessionCardFooter item={item} />
                </SessionCard>
              ))}
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
                  // onClick={viewAttendanceHistory}
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
            />
          </Box>

          <Box mt={3} px="18px">
            {sessions?.map((item) => (
              <SessionCard data={item} key={item.id}>
                <SessionCardFooter item={item} />
              </SessionCard>
            ))}
            {sessions && sessions?.length === 0 && (
              <Box
                className="fs-12 fw-400 italic"
                sx={{ color: theme.palette.warning['300'] }}
              >
                {t('COMMON.NO_SESSIONS_SCHEDULED')}
              </Box>
            )}
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
            <AddLearnerModal
              open={openAddLearnerModal}
              onClose={handleCloseAddLearnerModal}
              onLearnerAdded={handleLearnerAdded}
            />
          </>
        )}
      </Box>
      <Box>
        {value === 3 && (
          <>
            <Box mt={3} px={'18px'}>
              {/* <Button
                sx={{
                  border: '1px solid #1E1B16',
                  borderRadius: '100px',
                  height: '40px',
                  width: '126px',
                  color: theme.palette.error.contrastText,
                }}
                className="text-1E"
                endIcon={<AddIcon />}
              >
                {t('COMMON.ADD_NEW')}
              </Button> */}
            </Box>
            <Box
              px={'18px'}
              mt={2}
              sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
            >
              {/* <Box
                sx={{ color: theme.palette.secondary.main }}
                className="fs-14 fw-500"
                onClick={() => {
                  router.push('/attendance-overview');
                }}
              >
                {t('COMMON.REVIEW_ATTENDANCE')}
              </Box> */}
              {/* <ArrowForwardIcon
                sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
              /> */}
            </Box>
            <Box>
              <CohortFacilitatorList
                cohortId={cohortId}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            </Box>
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

export default TeachingCenterDetails;

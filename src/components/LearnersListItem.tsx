import { Role, Status } from '@/utils/app.constant';
import {
  BulkCreateCohortMembersRequest,
  LearnerListProps,
  UpdateCustomField,
  UserData
} from '@/utils/Interfaces';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Avatar, Box, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BottomDrawer from './BottomDrawer';
import ConfirmationModal from './ConfirmationModal';
import DeleteUserModal from './DeleteUserModal';
import DropOutModal from './DropOutModal';
import LearnerModal from './LearnerModal';
import Loader from './Loader';
import ManageCentersModal from './ManageCentersModal';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { bulkCreateCohortMembers } from '@/services/CohortServices';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import { getUserDetails } from '@/services/ProfileService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import { capitalizeEachWord, filterMiniProfileFields } from '@/utils/Helper';
import { fetchAttendanceStats } from '@/utils/helperAttendanceStatApi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import manageUserStore from '../store/manageUserStore';
import { showToastMessage } from './Toastify';

type Anchor = 'bottom';

const LearnersListItem: React.FC<LearnerListProps> = ({
  type,
  userId,
  learnerName,
  isDropout,
  enrollmentId,
  cohortMembershipId,
  statusReason,
  reloadState,
  setReloadState,
  block,
  center,
  showMiniProfile,
  onLearnerDelete,
  isFromProfile = false,
}) => {
  const [state, setState] = React.useState({
    bottom: false,
  });
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isUserDeleted, setIsUserDeleted] = React.useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [
    confirmationModalReassignCentersOpen,
    setConfirmationModalReassignCentersOpen,
  ] = React.useState<boolean>(false);

  const [learnerState, setLearnerState] = React.useState({
    loading: false,
    isModalOpenLearner: false,
    userData: null as UserData | null,
    userName: '',
    contactNumber: '',
    enrollmentNumber: '',
    customFieldsData: [] as UpdateCustomField[],
  });
  const userStore = useStore();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { t } = useTranslation();
  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = React.useState(false);
  const [centers, setCenters] = React.useState();
  const [centersName, setCentersName] = React.useState();
  const store = manageUserStore();
  const reassignStore = reassignLearnerStore();
  const setReassignId = reassignLearnerStore((state) => state.setReassignId);
  const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: 'underline',
    textDecorationColor: theme?.palette?.secondary.main,
    textDecorationThickness: '1px',
  }));
  const setCohortLearnerDeleteId = manageUserStore(
    (state) => state.setCohortLearnerDeleteId
  );
  const isActiveYear = userStore.isActiveYearSelected;

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
      // window.location.reload();
    }
    const cohorts = userStore.cohorts;
    const centers = cohorts
      .filter((cohort: { status: any }) => cohort.status !== Status.ARCHIVED)
      .map((cohort: { name: string; cohortId: string; status: any }) => ({
        name: cohort?.name,
        cohortId: cohort?.cohortId,
      }));
    const centersName = centers?.map((center: { name: any }) => center?.name);

    setCenters(centers);
    setCentersName(centersName);
  }, [reloadState, setReloadState, userStore.cohorts]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setCohortLearnerDeleteId(cohortMembershipId);
        setReassignId(userId);

        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, bottom: open });
      };

  const setLoading = (loading: boolean) => {
    setLearnerState((prevState) => ({ ...prevState, loading }));
  };

  const setIsModalOpenLearner = (isOpen: boolean) => {
    setLearnerState((prevState) => ({
      ...prevState,
      isModalOpenLearner: isOpen,
    }));
  };

  const setUserData = (data: UserData | null) => {
    setLearnerState((prevState) => ({ ...prevState, userData: data }));
  };

  const setUserName = (name: string) => {
    setLearnerState((prevState) => ({ ...prevState, userName: name }));
  };

  const setContactNumber = (number: string) => {
    setLearnerState((prevState) => ({ ...prevState, contactNumber: number }));
  };

  const setEnrollmentNumber = (number: string) => {
    setLearnerState((prevState) => ({
      ...prevState,
      enrollmentNumber: number,
    }));
  };

  const setCustomFieldsData = (fields: UpdateCustomField[]) => {
    setLearnerState((prevState) => ({
      ...prevState,
      customFieldsData: fields,
    }));
  };

  const handleUnmarkDropout = async () => {
    try {
      setLoading(true);

      if (cohortMembershipId) {
        const memberStatus = Status.ACTIVE;
        const membershipId = cohortMembershipId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          membershipId,
        });

        if (response?.responseCode !== 200 || response?.params?.err) {
          ReactGA.event('unmark-dropout-student-error', {
            cohortMembershipId: membershipId,
          });
          throw new Error(
            response.params?.errmsg ||
            'An error occurred while updating the user.'
          );
        } else {
          ReactGA.event('unmark-dropout-student-successful', {
            cohortMembershipId: membershipId,
          });
          showToastMessage(t('COMMON.LEARNER_UNMARKED_DROPOUT'), 'success');
          setReloadState(true);
        }
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const listItemClick = (event: React.MouseEvent, name: string) => {
    if (name === 'mark-drop-out') {
      setShowModal(true);
    } else if (name === 'unmark-drop-out') {
      handleUnmarkDropout();
    }
    if (name === 'reassign-centers') {
      setOpenCentersModal(true);
      getTeamLeadersCenters();
    }
    if (name === 'delete-User') {
      setOpenDeleteUserModal(true);
    }
    setState({ ...state, bottom: false });
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      //API call to check if today's attendance is marked. If yes, don't allow achieve today
      if (type == Role.STUDENT) {
        const attendanceStats = await fetchAttendanceStats(userId);
        if (attendanceStats && attendanceStats.length > 0) {
          showToastMessage(
            t('COMMON.CANNOT_DELETE_TODAY_ATTENDANCE_MARKED'),
            'error'
          );
        }
      } else if (cohortMembershipId) {
        const memberStatus = Status.ARCHIVED;
        const membershipId = cohortMembershipId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          membershipId,
        });

        if (response?.responseCode !== 200 || response?.params?.err) {
          ReactGA.event('remove-student-error', {
            cohortMembershipId: membershipId,
          });
          throw new Error(
            response.params?.errmsg ||
            'An error occurred while updating the user.'
          );
        } else {
          ReactGA.event('remove-student-successful', {
            cohortMembershipId: membershipId,
          });
          showToastMessage(t('COMMON.LEARNER_REMOVED'), 'success');
          setReloadState(true);
        }
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
    setConfirmationModalOpen(false);
    setState({ ...state, bottom: false });
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
    setConfirmationModalReassignCentersOpen(false);
    setOpenDeleteUserModal(false);
  };

  const handleDroppedOutLabelClick = () => {
    setShowModal(true);
  };

  const handleOpenModalLearner = (userId: string) => {
    fetchUserDetails(userId);
    setIsModalOpenLearner(true);
  };

  const handleCloseModalLearner = () => {
    setIsModalOpenLearner(false);
  };

  const handleTeacherFullProfile = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      if (userId) {
        setLoading(true);
        const response = await getUserDetails(userId, true);
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserData(userData);
            setUserName(userData?.firstName+' '+userData?.middleName+' '+userData?.lastName);
            setContactNumber(userData?.mobile);
            setEnrollmentNumber(userData?.username);
            const customDataFields = userData?.customFields;
            if (customDataFields?.length > 0) {
              setCustomFieldsData(customDataFields);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = filterMiniProfileFields(learnerState.customFieldsData);

  const getTeamLeadersCenters = async () => { };

  const handleCloseCentersModal = () => {
    setOpenCentersModal(false);
  };

  const handleAssignCenters = async (selectedCenters: any) => {
    setOpenCentersModal(false);
    setConfirmationModalReassignCentersOpen(true);
  };

  const handleReassignCenterRequest = async () => {
    const attendanceStats = await fetchAttendanceStats(userId);
    if (attendanceStats && attendanceStats.length > 0) {
      showToastMessage(
        t('COMMON.CANNOT_REASSIGN_TODAY_ATTENDANCE_MARKED'),
        'error'
      );
    } else {
      const payload: BulkCreateCohortMembersRequest = {
        userId: [reassignStore?.reassignId],
        cohortId: [reassignStore?.cohortId],
        removeCohortId: [reassignStore?.removeCohortId],
      };

      try {
        const response = await bulkCreateCohortMembers(payload);
        console.log('Cohort members created successfully', response);

        showToastMessage(
          t('MANAGE_USERS.CENTERS_REASSIGNED_SUCCESSFULLY'),
          'success'
        );
        setReloadState(!reloadState);
      } catch (error) {
        console.error('Error creating cohort members', error);
        showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');
      }
    }
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    setCohortLearnerDeleteId(cohortMembershipId);
    setReassignId(userId);
  };

  const renderCustomContent = () => {
    if (isDropout) {
      return (
        <Box
          sx={{
            padding: '10px 16px 10px 16px',
            mx: '20px',
            borderRadius: '12px',
            bgcolor: theme.palette.success.contrastText,
          }}
        >
          <Typography
            variant="h5"
            color={theme.palette.warning[400]}
            fontWeight="600"
          >
            {t('COMMON.REASON_FOR_DROPOUT')}
          </Typography>
          <Typography
            variant="h3"
            color={theme.palette.warning[300]}
            fontWeight="500"
          >
            {statusReason}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const handleUserDelete = () => {
    setIsUserDeleted(true);
    onLearnerDelete();
  };
  const stringAvatar = (name: string) => {
    if (name) {
      const nameParts = name.split(' ');
  
      return {
        children:
          nameParts.length === 1
            ? nameParts[0][0]
            : `${nameParts[0][0]}${nameParts[1]?.[0] || ''}`, 
      };
    }
  
    return '';
  };

  return (
    <>
      {isFromProfile ? (
        <Box>
          <MoreVertIcon
            onClick={(event) => {
              isMobile
                ? toggleDrawer('bottom', true)(event)
                : handleMenuOpen(event);
            }}
            sx={{
              fontSize: '32px',
              color: theme.palette.warning['300'],
              cursor: 'pointer',
            }}
          />
        </Box>
      ) : (
        <Box>
          {learnerState.loading ? (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          ) : (
            <LearnerModal
              userId={userId}
              open={learnerState.isModalOpenLearner}
              onClose={handleCloseModalLearner}
              data={filteredFields}
              userName={learnerState.userName}
              contactNumber={learnerState.contactNumber}
              enrollmentNumber={learnerState.enrollmentNumber}
            />
          )}
          <Box
            px={2}
            sx={{
              '@media (max-width: 900px)': {
                borderBottom: `1px solid ${theme.palette.warning['A100']}`,
              },
              '@media (min-width: 900px)': {
                marginTop: '20px',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0',
                '@media (min-width: 900px)': {
                  border: `1px solid ${theme.palette.warning['A100']}`,
                  padding: '10px',
                  borderRadius: '8px',
                  background: theme.palette.warning['A400'],
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Box className="box_shadow_center">
                  <Box>
                    <Avatar
                      sx={{
                        background: '#EDE1CF' /* not in custom theme */,
                        color: theme.palette.warning['300'],
                        fontSize: '16px',
                        fontWeight: '500',
                      }}
                      {...stringAvatar(learnerName)}
                    />
                  </Box>
                </Box>
                <Box>
                  {isDropout ? (
                    <Box
                      sx={{
                        fontSize: '16px',
                        color: theme.palette.warning['400'],
                        fontWeight: '400',
                      }}
                    >
                      {learnerName}
                    </Box>
                  ) : (
                    <CustomLink
                      className="word-break"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Typography
                        onClick={() => {
                          showMiniProfile
                            ? handleOpenModalLearner(userId!)
                            : handleTeacherFullProfile(userId!);
                          // ReactGA.event('teacher-details-link-clicked', {
                          //   userId: userId,
                          // });
                        }}
                        sx={{
                          textAlign: 'left',
                          fontSize: '16px',
                          fontWeight: '400',
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {learnerName}
                      </Typography>
                    </CustomLink>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      justifyContent: 'left',
                    }}
                  >
                    {isDropout ? (
                      <Box
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.warning['300'],
                          background: theme.palette.error.light,
                          fontWeight: '500',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                        }}
                        onClick={handleDroppedOutLabelClick}
                      >
                        <Box sx={{ marginTop: '1px' }}>
                          {t('COMMON.DROPPED_OUT')}
                        </Box>
                        <ErrorOutlineIcon style={{ fontSize: '13px' }} />
                      </Box>
                    ) : (
                      <>
                        {/* {
                          age &&
                          <>
                            <Box
                              sx={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: theme.palette.warning['400'],
                                // marginRight:'4px',
                                whiteSpace:'nowrap'
                              }}
                                // className="one-line-text"
                            >
                              {age + ' y/o'}
                            </Box>
                            <FiberManualRecordIcon
                              style={{ fontSize: '8px', color: '#CDC5BD' }}
                            />
                          </>
                        } */}
                        <Box
                          sx={{
                            fontSize: '14px',
                            fontWeight: '400',
                            color: theme.palette.warning['400'],
                            wordBreak: 'break-all',
                          }}
                          className="one-line-text"
                        >
                          {enrollmentId}
                        </Box>
                      </>
                    )}
                  </Box>
                  {!isDropout && (
                    <Box
                      display={'flex'}
                      gap={'10px'}
                      alignItems={'center'}
                      justifyContent={'left'}
                    >
                      <Box
                        sx={{
                          fontSize: '14px',
                          fontWeight: '400',
                          color: theme.palette.warning['400'],
                        }}
                      >
                        {block}
                      </Box>

                      <Box
                        sx={{
                          fontSize: '14px',
                          fontWeight: '400',
                          color: theme.palette.warning['400'],
                        }}
                      >
                        {center}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              {isActiveYear && (
                <MoreVertIcon
                  onClick={(event) => {
                    isMobile
                      ? toggleDrawer('bottom', true)(event)
                      : handleMenuOpen(event);
                  }}
                  sx={{
                    fontSize: '24px',
                    color: theme.palette.warning['300'],
                    cursor: 'pointer',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}

      <BottomDrawer
        toggleDrawer={toggleDrawer}
        state={state}
        listItemClick={listItemClick}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        isMobile={isMobile}
        optionList={
          block
            ? [
              // TODO: Integrate todo service
              // {
              //   label: t('COMMON.REASSIGN_BLOCKS_REQUEST'),
              //   icon: (
              //     <LocationOnOutlinedIcon
              //       sx={{ color: theme.palette.warning['300'] }}
              //     />
              //   ),
              //   name: 'reassign-block-request',
              // },
              {
                label: t('COMMON.REASSIGN_CENTERS'),
                icon: (
                  <ApartmentIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'reassign-centers',
              },
              {
                label: isDropout
                  ? t('COMMON.UNMARK_DROP_OUT')
                  : t('COMMON.MARK_DROP_OUT'),
                icon: (
                  <NoAccountsIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: isDropout ? 'unmark-drop-out' : 'mark-drop-out',
              },
              {
                label: t('COMMON.DELETE_USER'),
                icon: (
                  <DeleteOutlineIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'delete-User',
              },
            ].filter(
              (option) =>
                (type === Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')) &&
                (!(isFromProfile || isDropout) ||
                  option.name !== 'reassign-centers')
            )
            : [
              {
                label: t('COMMON.REASSIGN_CENTERS'),
                icon: (
                  <ApartmentIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'reassign-centers',
              },
              {
                label: isDropout
                  ? t('COMMON.UNMARK_DROP_OUT')
                  : t('COMMON.MARK_DROP_OUT'),
                icon: (
                  <NoAccountsIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: isDropout ? 'unmark-drop-out' : 'mark-drop-out',
              },
              {
                label: t('COMMON.DELETE_USER_FROM_CENTER'),
                icon: (
                  <DeleteOutlineIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'delete-User',
              },
            ].filter(
              (option) =>
                (type === Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')) &&
                (!(isFromProfile || isDropout) ||
                  option.name !== 'reassign-centers')
            )
        }
        renderCustomContent={renderCustomContent}
      />

      {isDropout ? (
        <DropOutModal
          open={showModal}
          onClose={() => setShowModal(false)}
          cohortMembershipId={cohortMembershipId}
          isButtonAbsent={true}
          statusReason={statusReason}
          userId={userId}
          reloadState={reloadState}
          setReloadState={setReloadState}
        />
      ) : (
        <DropOutModal
          open={showModal}
          onClose={() => setShowModal(false)}
          cohortMembershipId={cohortMembershipId}
          userId={userId}
          reloadState={reloadState}
          setReloadState={setReloadState}
        />
      )}

      <ConfirmationModal
        message={t('COMMON.SURE_REASSIGN_CENTER')}
        handleAction={handleReassignCenterRequest}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalReassignCentersOpen}
      />

      <ConfirmationModal
        message={t('COMMON.SURE_REMOVE')}
        handleAction={handleAction}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpen}
      />

      <ManageCentersModal
        open={openCentersModal}
        onClose={handleCloseCentersModal}
        centersName={centersName}
        centers={centers}
        onAssign={handleAssignCenters}
        isForLearner={true}
      />

      <DeleteUserModal
        type={Role.STUDENT}
        userId={userId}
        open={openDeleteUserModal}
        onClose={handleCloseModal}
        onUserDelete={handleUserDelete}
        reloadState={reloadState}
        setReloadState={setReloadState}
      />
    </>
  );
};

export default LearnersListItem;

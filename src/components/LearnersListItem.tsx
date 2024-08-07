import { Box, Typography } from '@mui/material';
import {
  LearnerListProps,
  UserData,
  UpdateCustomField,
} from '@/utils/Interfaces';
import React, { useEffect } from 'react';
import {
  Status,
  Role,
} from '@/utils/app.constant';
import { BulkCreateCohortMembersRequest } from '@/utils/Interfaces';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BottomDrawer from './BottomDrawer';
import ConfirmationModal from './ConfirmationModal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteUserModal from './DeleteUserModal';
import DropOutModal from './DropOutModal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LearnerModal from './LearnerModal';
import Link from 'next/link';
import Loader from './Loader';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ManageCentersModal from './ManageCentersModal';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import ReactGA from 'react-ga4';
import { getUserDetails } from '@/services/ProfileService';
import { showToastMessage } from './Toastify';
import { styled } from '@mui/system';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
// import Woman2Icon from '@mui/icons-material/Woman2';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import manageUserStore from '../store/manageUserStore';
import useStore from '@/store/store';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { bulkCreateCohortMembers } from '@/services/CohortServices';
import { capitalizeEachWord, filterMiniProfileFields } from '@/utils/Helper';

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
  const router = useRouter();
  const { learnerId }: any = router.query;
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

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
      // window.location.reload();
    }
    const cohorts = userStore.cohorts;
    const centers = cohorts.map(
      (cohort: { name: string; cohortId: string }) => ({
        name: cohort.name,
        cohortId: cohort.cohortId,
      })
    );
    const centersName = centers?.map((center: { name: any }) => center?.name);

    setCenters(centers);
    setCentersName(centersName);
  }, [reloadState, setReloadState]);

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
      if (cohortMembershipId) {
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

  const handleCloseBottomDrawer = () => {
    setState({ ...state, bottom: false });
  };

  const handleDroppedOutLabelClick = () => {
    console.log('handleDroppedOutLabelClick');
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
        console.log('response for popup', response?.result);
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserData(userData);
            setUserName(userData?.name);
            setContactNumber(userData?.mobile);
            setEnrollmentNumber(capitalizeEachWord(userData?.username));
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

  const getTeamLeadersCenters = async () => {};

  const handleCloseCentersModal = () => {
    setOpenCentersModal(false);
  };

  const handleAssignCenters = async (selectedCenters: any) => {
    setOpenCentersModal(false);
    setConfirmationModalReassignCentersOpen(true);
  };

  const handleReassignCenterRequest = async () => {
    const payload: BulkCreateCohortMembersRequest = {
      userId: [reassignStore.reassignId],
      cohortId: [reassignStore.cohortId],
      removeCohortId: [reassignStore.removeCohortId],
    };

    try {
      const response = await bulkCreateCohortMembers(payload);
      console.log('Cohort members created successfully', response);

      showToastMessage(
        t('MANAGE_USERS.CENTERS_REQUESTED_SUCCESSFULLY'),
        'success'
      );
    } catch (error) {
      console.error('Error creating cohort members', error);
      showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');
    }
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

  return (
    <>
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
        sx={{ borderBottom: `1px solid ${theme.palette.warning['A100']}` }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 0',
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* <Box className="box_shadow_center">
              <Woman2Icon
                sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
              />
            </Box> */}
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
                {/* <Box
                  sx={{ fontSize: '12px', color: theme.palette.warning['400'] }}
                >
                  19 y/o
                </Box> */}
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
                    {/* <FiberManualRecordIcon
                   sx={{
                    fontSize: '9px',
                    color: theme.palette.secondary.contrastText,
                  }}
                /> */}
                    <Box
                      sx={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: theme.palette.warning['400'],
                      }}
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
          <MoreVertIcon
            onClick={toggleDrawer('bottom', true)}
            sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
          />
        </Box>
      </Box>

      <BottomDrawer
        toggleDrawer={toggleDrawer}
        state={state}
        listItemClick={listItemClick}
        optionList={
          block
            ? [
                {
                  label: t('COMMON.REASSIGN_BLOCKS_REQUEST'),
                  icon: (
                    <LocationOnOutlinedIcon
                      sx={{ color: theme.palette.warning['300'] }}
                    />
                  ),
                  name: 'reassign-block-request',
                },
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
                  type == Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')
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
                  type == Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')
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
          reloadState={reloadState}
          setReloadState={setReloadState}
        />
      ) : (
        <DropOutModal
          open={showModal}
          onClose={() => setShowModal(false)}
          cohortMembershipId={cohortMembershipId}
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
      />
    </>
  );
};

export default LearnersListItem;

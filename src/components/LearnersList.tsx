import BottomDrawer from './BottomDrawer';
import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DropOutModal from './DropOutModal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import React, { useEffect } from 'react';
// import Woman2Icon from '@mui/icons-material/Woman2';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { LearnerListProps, UserData, updateCustomField } from '@/utils/Interfaces';
import ConfirmationModal from './ConfirmationModal';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import ReactGA from 'react-ga4';
import { showToastMessage } from './Toastify';
import Link from 'next/link';
import { getUserDetails } from '@/services/ProfileService';
import LearnerModal from './LearnerModal';
import Loader from './Loader';
import { Status, names } from '@/utils/app.constant';

type Anchor = 'bottom';

const LearnersList: React.FC<LearnerListProps> = ({
  userId,
  learnerName,
  isDropout,
  enrollmentId,
  cohortMembershipId,
  statusReason,
  reloadState,
  setReloadState,
}) => {
  const [state, setState] = React.useState({
    bottom: false,
  });
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);

  const [learnerState, setLearnerState] = React.useState({
    loading: false,
    isModalOpenLearner: false,
    userData: null as UserData | null,
    userName: '',
    contactNumber: '',
    customFieldsData: [] as updateCustomField[]
  });

  const theme = useTheme<any>();
  const { t } = useTranslation();

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
      // window.location.reload();
    }
  }, [reloadState, setReloadState]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
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
    setLearnerState((prevState) => ({ ...prevState, isModalOpenLearner: isOpen }));
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

  const setCustomFieldsData = (fields: updateCustomField[]) => {
    setLearnerState((prevState) => ({ ...prevState, customFieldsData: fields }));
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
    } else {
      setConfirmationModalOpen(true);
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

  const handleCloseModel = () => {
    setConfirmationModalOpen(false);
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

  const nameSet = new Set<string>(names);
  const filteredFields = learnerState.customFieldsData.reduce((acc, field) => {
    if (field.name && nameSet.has(field.name)) {
      acc.push(field);
    }
    return acc;
  }, [] as updateCustomField[]);

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
            paddingBottom: '15px',
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
                <Link className="word-break" href="#">
                  <Typography
                    onClick={() => {
                      handleOpenModalLearner(userId!);
                      ReactGA.event('learner-details-link-clicked', {
                        userId: userId,
                      });
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
                </Link>
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
        optionList={[
          {
            label: isDropout
              ? t('COMMON.UNMARK_DROP_OUT')
              : t('COMMON.MARK_DROP_OUT'),
            icon: (
              <NoAccountsIcon sx={{ color: theme.palette.warning['300'] }} />
            ),
            name: isDropout ? 'unmark-drop-out' : 'mark-drop-out',
          },
          {
            label: t('COMMON.REMOVE_FROM_CENTER'),
            icon: (
              <DeleteOutlineIcon sx={{ color: theme.palette.warning['300'] }} />
            ),
            name: 'remove-from-center',
          },
        ]}
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
        message={t('COMMON.SURE_REMOVE')}
        handleAction={handleAction}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModel={handleCloseModel}
        modalOpen={confirmationModalOpen}
      />
    </>
  );
};

export default LearnersList;

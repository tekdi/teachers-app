import { bulkAttendance } from '@/services/AttendanceService';
import { Box, Button, Divider, Fade, Modal, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  deepClone,
  getDayMonthYearFormat,
  shortDateFormat,
} from '../utils/Helper';

import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import ReactGA from 'react-ga4';
import { DropoutMember } from '../utils/Interfaces';
import AttendanceStatusListView from './AttendanceStatusListView';
import NoDataFound from './common/NoDataFound';
import ConfirmationModal from './ConfirmationModal';
import Loader from './Loader';
import { showToastMessage } from './Toastify';
import { modalStyles } from '@/styles/modalStyles';

interface MarkBulkAttendanceProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  selectedDate: Date;
  onSaveSuccess?: (isModified?: boolean) => void;
  memberList: Array<{}>;
  presentCount: number;
  absentCount: number;
  numberOfCohortMembers: number;
  dropoutMemberList: Array<DropoutMember>;
  dropoutCount: any;
  bulkStatus: any;
}

const MarkBulkAttendance: React.FC<MarkBulkAttendanceProps> = ({
  open,
  onClose,
  classId,
  selectedDate,
  onSaveSuccess,
  memberList,
  presentCount,
  absentCount,
  numberOfCohortMembers,
  dropoutMemberList,
  dropoutCount,
  bulkStatus,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [updateAttendance, setUpdateAttendance] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState(false);
  const [isConfirmation, setIsConfirmation] = React.useState(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const attendanceUpdate = () => {
    setUpdateAttendance(true);
    setModalOpen(true);
  };
  const confirmationOpen = () => {
    setConfirmation(true);
    setModalOpen(true);
  };
  const [loading, setLoading] = React.useState(false);
  const [showUpdateButton, setShowUpdateButton] = React.useState(false);
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<{}>>(
    deepClone(memberList)
  );
  const [dynamicPresentCount, setDynamicPresentCount] = React.useState(presentCount);
  const [dynamicAbsentCount, setDynamicAbsentCount] = React.useState(absentCount);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] =
    React.useState(bulkStatus);
  const [isAllAttendanceMarked, setIsAllAttendanceMarked] =
    React.useState(false);
  const [teacherUserId, setTeacherUserId] = React.useState<string>('');



  const updateBulkAttendanceStatus = (arr: any[]) => {
    setIsConfirmation(true);
    const isAllPresent = arr.every(
      (user: any) => user.attendance === 'present'
    );
    const isAllAbsent = arr.every((user: any) => user.attendance === 'absent');
    setBulkAttendanceStatus(
      isAllPresent ? 'present' : isAllAbsent ? 'absent' : ''
    );
  };

  const submitBulkAttendanceAction = (
    isBulkAction: boolean,
    status: string,
    id?: string | undefined
  ) => {
    setIsConfirmation(true);

    const updatedAttendanceList = cohortMemberList?.map((user: any) => {
      if (isBulkAction) {
        user.attendance = status;
        setBulkAttendanceStatus(status);
      } else {
        setBulkAttendanceStatus('');
        if (user.userId === id) {
          user.attendance = status;
        }
      }
      return user;
    });
    setCohortMemberList(updatedAttendanceList);
    updateBulkAttendanceStatus(updatedAttendanceList);
    const hasEmptyAttendance = () => {
      const allAttendance = updatedAttendanceList.some(
        (user) => user.attendance === ''
      );
      if (updatedAttendanceList?.length) {
        setIsAllAttendanceMarked(!allAttendance);
        setDynamicPresentCount(updatedAttendanceList.filter(member=> member.attendance === "present").length);
        setDynamicAbsentCount(updatedAttendanceList.filter(member=> member.attendance === "absent").length);
      }
      if (!allAttendance) {
        setShowUpdateButton(true);
      }
    };
    hasEmptyAttendance();
  };

  useEffect(() => {
    // submitBulkAttendanceAction(true, '', '');
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUserID = localStorage.getItem('userId');
      setTeacherUserId(storedUserID ?? '');
    }
  }, []);

  const handleSave = () => {
    onClose();
    const userAttendance = cohortMemberList?.map((user: any) => {
      return {
        userId: user.userId,
        attendance: user.attendance,
      };
    });
    if (userAttendance) {
      const date = shortDateFormat(selectedDate);
      const data = {
        attendanceDate: date,
        contextId: classId,
        userAttendance,
      };
      const markBulkAttendance = async () => {
        setLoading(true);
        try {
          const response = await bulkAttendance(data);
          const resp = response?.responses;

          if (resp) {
            setShowUpdateButton(true);
            setLoading(false);
            if (onSaveSuccess) {
              if (presentCount === 0 && absentCount === 0) {
                onSaveSuccess(false);
              } else {
                onSaveSuccess(true);
              }
              ReactGA.event('attendance-marked/update-success', {
                teacherId: teacherUserId,
              });
              const telemetryInteract = {
                context: {
                  env: 'dashboard',
                  cdata: [],
                },
                edata: {
                  id: 'bulk-attendance-marked',
                  type: Telemetry.CLICK,
                  subtype: '',
                  pageid: 'dashboard',
                },
              };
              telemetryFactory.interact(telemetryInteract);
              onClose();
            }
          } else {
            showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
          }
        } catch (error) {
          console.error('Error fetching cohort list:', error);
          setLoading(false);
          showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
          ReactGA.event('attendance-marked/update-fail', {
            error: error,
          });
        }
        // handleClick({ vertical: 'bottom', horizontal: 'center' })();
      };
      markBulkAttendance();
    }
  };

  // const handleClick = (newState: SnackbarOrigin) => () => {
  // setState({ ...newState, openModal: true });
  // };

  // const handleClose = () => {
  // setState({ ...state, openModal: false });
  // };

  const getMessage = () => {
    if (updateAttendance)
      return presentCount == 0 && absentCount == 0
        ? t('COMMON.SURE_MARK')
        : t('COMMON.SURE_UPDATE');
    if (confirmation) return t('COMMON.SURE_CLOSE');
    return '';
  };

  const handleAction = () => {
    if (updateAttendance) {
      handleSave();
    } else if (confirmation) {
      onClose();
    }
    onClose();
  };

  const handleCloseModel = () => {
    setUpdateAttendance(false);
    setConfirmation(false);
    setModalOpen(false);
  };
  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="modal_mark"
      >
        <Fade in={open}>
          <Box
            sx={modalStyles}
            borderRadius={'1rem'}
            padding={"15px 10px 0 10px"}
          >
            <Box height={'100%'} maxHeight={'526px'} sx={{overflowX:'auto'}} width={'100%'}>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                sx={{ padding: '0 10px' }}
              >
                <Box marginBottom={'0px'}>
                  <Typography
                    variant="h2"
                    component="h2"
                    marginBottom={'0px'}
                    fontWeight={'500'}
                    fontSize={'16px'}
                    sx={{ color: theme.palette.warning['A200'] }}
                  >
                    {presentCount == 0 && absentCount == 0 ? t('COMMON.MARK_CENTER_ATTENDANCE'): t('COMMON.MODIFY_CENTER_ATTENDANCE')}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      paddingBottom: '10px',
                      color: theme.palette.warning['A200'],
                      fontSize: '14px',
                    }}
                    component="h2"
                  >
                    {getDayMonthYearFormat(shortDateFormat(selectedDate))}
                  </Typography>
                  <ConfirmationModal
                    message={getMessage()}
                    handleAction={handleAction}
                    handleCloseModal={handleCloseModel}
                    buttonNames={{
                      primary: t('COMMON.YES'),
                      secondary: t('COMMON.NO_GO_BACK'),
                    }}
                    modalOpen={modalOpen}
                  />
                </Box>
                <Box>
                  <CloseIcon
                    sx={{
                      cursor: 'pointer',
                      color: theme.palette.warning['A200'],
                    }}
                    onClick={isConfirmation ? confirmationOpen : onClose}
                  />
                </Box>
              </Box>
              <Box sx={{ height: '1px', background: '#D0C5B4' }}></Box>
              {loading && (
                <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
              )}

              <Box display={'flex'} justifyContent={'space-between'}>
                {dropoutCount > 0 ? (
                  <>
                    <Typography
                      sx={{
                        marginTop: '10px',
                        fontSize: '10px',
                        color: theme.palette.warning['A200'],
                        padding: '0 8px',
                        lineHeight: '16px',
                      }}
                    >
                      {t('ATTENDANCE.ACTIVE_STUDENTS', {
                        count: numberOfCohortMembers,
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        marginTop: '10px',
                        marginLeft: '0.5rem',
                        fontSize: '10px',
                        color: theme.palette.warning['A200'],
                        padding: '0 8px',
                        lineHeight: '16px',
                      }}
                    >
                      {t('ATTENDANCE.DROPOUT_STUDENTS', {
                        count: dropoutCount,
                      })}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    sx={{
                      marginTop: '10px',
                      marginLeft: '0.5rem',
                      fontSize: '10px',
                      color: theme.palette.warning['A200'],
                      padding: '0 8px',
                      lineHeight: '16px',
                    }}
                  >
                    {t('ATTENDANCE.TOTAL_STUDENTS', {
                      count: numberOfCohortMembers,
                    })}
                  </Typography>
                )}

                <Typography
                  sx={{
                    marginTop: '10px',
                    marginLeft: '0.5rem',
                    fontSize: '10px',
                    color: theme.palette.warning['A200'],
                    lineHeight: '16px',
                  }}
                >
                  {t('ATTENDANCE.PRESENT_STUDENTS', {
                    count: dynamicPresentCount,
                  })}
                </Typography>
                <Typography
                  sx={{
                    marginTop: '10px',
                    marginLeft: '0.5rem',
                    fontSize: '10px',
                    color: theme.palette.warning['A200'],
                    padding: '0 8px 0 10px',
                    lineHeight: '16px',
                  }}
                >
                  {t('ATTENDANCE.ABSENT_STUDENTS', {
                    count: dynamicAbsentCount,
                  })}
                </Typography>
              </Box>

              {cohortMemberList && cohortMemberList?.length != 0 ? (
                <Box
                  height={'64%'}
                  sx={{
                    overflowY: 'auto',
                    marginTop: '10px',
                    padding: '0 0 10px',
                  }}
                >
                  <Box className="modalBulk">
                    <AttendanceStatusListView
                      isEdit={true}
                      isBulkAction={true}
                      bulkAttendanceStatus={bulkAttendanceStatus}
                      handleBulkAction={submitBulkAttendanceAction}
                    />
                    {cohortMemberList?.map(
                      (
                        user: any //cohort member list should have userId, attendance, name
                      ) => (
                        <AttendanceStatusListView
                          key={user.userId}
                          userData={{
                            userId: user.userId,
                            attendance: user.attendance,
                            attendanceDate: selectedDate,
                            name: user.name,
                            memberStatus: user.memberStatus,
                            updatedAt : user.updatedAt,
                            userName : user.userName
                          }}
                          isEdit={true}
                          bulkAttendanceStatus={bulkAttendanceStatus}
                          handleBulkAction={submitBulkAttendanceAction}
                          attendanceDate={selectedDate}
                        />
                      )
                    )}
                    {dropoutMemberList?.map(
                      (
                        user: any //cohort member list should have userId, attendance, name
                      ) => (
                        <AttendanceStatusListView
                          key={user.userId}
                          isDisabled={true}
                          userData={{
                            userId: user.userId,
                            attendance: user.attendance,
                            attendanceDate: selectedDate,
                            name: user.name,
                            memberStatus: user.memberStatus,
                            updatedAt : user.updatedAt,
                            userName : user.userName
                          }}
                          presentCount={presentCount}
                          absentCount={absentCount}
                          attendanceDate={selectedDate}
                          // isEdit={true}
                          // bulkAttendanceStatus={bulkAttendanceStatus}
                          // handleBulkAction={submitBulkAttendanceAction}
                        />
                      )
                    )}
                  </Box>
                </Box>
                
              ) : (
                <NoDataFound />
              )}
            </Box>
            <Box
              // position={'absolute'}
              bottom="15px"
              display={'flex'}
              gap={'20px'}
              flexDirection={'row'}
              justifyContent={'space-evenly'}
              margin={'5px 8px 10px'}
              sx={{
                background: '#fff',
                // padding: '0px 0 10px 0',
                width: '93%',
              }}
            >
              <Button
                variant="outlined"
                disabled={!isAllAttendanceMarked}
                onClick={() => submitBulkAttendanceAction(true, '', '')}
                sx={{
                  width: '128px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {' '}
                {t('COMMON.CLEAR_ALL')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: '128px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={isAllAttendanceMarked ? false : true}
                onClick={attendanceUpdate}
              >
                {presentCount == 0 && absentCount == 0
                  ? t('COMMON.MARK')
                  : t('COMMON.MODIFY')}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MarkBulkAttendance;

import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  attendanceStatusList,
  bulkAttendance,
} from '@/services/AttendanceService';
import {
  getDayMonthYearFormat,
  shortDateFormat,
  toPascalCase,
} from '../utils/Helper';

import { AttendanceStatusListProps, DropoutMember } from '../utils/Interfaces';
import AttendanceStatusListView from './AttendanceStatusListView';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationModal from './ConfirmationModal';
import Loader from './Loader';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { showToastMessage } from './Toastify';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Status } from '@/utils/app.constant';
import ReactGA from 'react-ga4';
import NoDataFound from './common/NoDataFound';

interface MarkBulkAttendanceProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  selectedDate: Date;
  onSaveSuccess?: (isModified?: boolean) => void;
}

const MarkBulkAttendance: React.FC<MarkBulkAttendanceProps> = ({
  open,
  onClose,
  classId,
  selectedDate,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [updateAttendance, setUpdateAttendance] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState(false);
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
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<{}>>([]);
  const [dropoutMemberList, setDropoutMemberList] = React.useState<
    Array<DropoutMember>
  >([]);
  const [presentCount, setPresentCount] = React.useState(0);
  const [absentCount, setAbsentCount] = React.useState(0);
  const [dropoutCount, setDropoutCount] = React.useState(0);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = React.useState('');
  const [isAllAttendanceMarked, setIsAllAttendanceMarked] =
    React.useState(false);
  const [numberOfCohortMembers, setNumberOfCohortMembers] = React.useState(0);
  const [teacherUserId, setTeacherUserId] = React.useState<string>('');

  const modalContainer = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    bgcolor: theme.palette.warning['A400'],
    boxShadow: 24,
    p: 4,
    height: '526px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const updateBulkAttendanceStatus = (arr: any[]) => {
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
      }
      if (!allAttendance) {
        setShowUpdateButton(true);
      }
    };
    hasEmptyAttendance();
  };

  const getPresentCount = (
    newArray: {
      userId: string;
      name: string;
      memberStatus: string;
      attendance: string;
    }[]
  ) => {
    setPresentCount(
      newArray.filter(
        (user: { attendance: string }) => user.attendance === 'present'
      ).length
    );
  };
  const getAbsentCount = (
    newArray: {
      userId: string;
      name: string;
      memberStatus: string;
      attendance: string;
    }[]
  ) => {
    setAbsentCount(
      newArray.filter(
        (user: { attendance: string }) => user.attendance === 'absent'
      ).length
    );
  };

  useEffect(() => {
    submitBulkAttendanceAction(true, '', '');
    const getCohortMemberList = async () => {
      setLoading(true);
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUserID = localStorage.getItem('userId');
        setTeacherUserId(storedUserID ?? '');
      }
      try {
        if (classId) {
          const limit = 300;
          const page = 0;
          const filters = { cohortId: classId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.userDetails;
          if (resp) {
            const nameUserIdArray = resp
              .map((entry: any) => ({
                userId: entry.userId,
                name: toPascalCase(entry.name),
                memberStatus: entry.status,
                createdAt: entry.createdAt,
              }))
              .filter((member: { createdAt: string | number | Date }) => {
                const createdAt = new Date(member.createdAt);
                createdAt.setHours(0, 0, 0, 0);
                return createdAt <= selectedDate;
              });

            if (nameUserIdArray && selectedDate) {
              const formatSelectedDate = shortDateFormat(selectedDate);
              const userAttendanceStatusList = async () => {
                const attendanceStatusData: AttendanceStatusListProps = {
                  limit: 300,
                  page: 0,
                  filters: {
                    fromDate: formatSelectedDate,
                    toDate: formatSelectedDate,
                    contextId: classId,
                    scope: 'student',
                  },
                };
                const res = await attendanceStatusList(attendanceStatusData);
                const response = res?.data?.attendanceList;
                console.log('attendanceStatusList', response);
                if (nameUserIdArray && response) {
                  const getUserAttendanceStatus = (
                    nameUserIdArray: any[],
                    response: any[]
                  ) => {
                    const userAttendanceArray: {
                      userId: any;
                      attendance: any;
                    }[] = [];

                    nameUserIdArray.forEach((user) => {
                      const userId = user.userId;
                      const attendance = response.find(
                        (status) => status.userId === userId
                      );
                      userAttendanceArray.push({
                        userId,
                        attendance: attendance?.attendance
                          ? attendance.attendance
                          : '',
                      });
                    });
                    return userAttendanceArray;
                  };
                  const userAttendanceArray = getUserAttendanceStatus(
                    nameUserIdArray,
                    response
                  );
                  console.log('userAttendanceArray', userAttendanceArray);

                  if (nameUserIdArray && userAttendanceArray) {
                    const mergeArrays = (
                      nameUserIdArray: {
                        userId: string;
                        name: string;
                        memberStatus: string;
                      }[],
                      userAttendanceArray: {
                        userId: string;
                        attendance: string;
                      }[]
                    ): {
                      userId: string;
                      name: string;
                      memberStatus: string;
                      attendance: string;
                    }[] => {
                      const newArray: {
                        userId: string;
                        name: string;
                        memberStatus: string;
                        attendance: string;
                      }[] = [];
                      nameUserIdArray.forEach((user) => {
                        const userId = user.userId;
                        const attendanceEntry = userAttendanceArray.find(
                          (entry) => entry.userId === userId
                        );
                        if (attendanceEntry) {
                          newArray.push({
                            userId,
                            name: user.name,
                            memberStatus: user.memberStatus,
                            attendance: attendanceEntry.attendance,
                          });
                        }
                      });
                      if (newArray.length !== 0) {
                        setNumberOfCohortMembers(newArray?.length);
                        setCohortMemberList(newArray);
                        getPresentCount(newArray);
                        getAbsentCount(newArray);
                        const hasDropout = newArray.some(
                          (user) => user.memberStatus === Status.DROPOUT
                        );
                        if (hasDropout) {
                          setCohortMemberList(
                            newArray.filter(
                              (user) => user.memberStatus === Status.ACTIVE
                            )
                          );
                          setDropoutMemberList(
                            newArray.filter(
                              (user) => user.memberStatus === Status.DROPOUT
                            )
                          );
                          getPresentCount(newArray);
                          getAbsentCount(newArray);
                          setDropoutCount(
                            newArray.filter(
                              (user) => user.memberStatus === Status.DROPOUT
                            ).length
                          );
                        }
                      } else {
                        setCohortMemberList(
                          nameUserIdArray.filter(
                            (user) => user.memberStatus === Status.ACTIVE
                          )
                        );
                        setDropoutMemberList(
                          nameUserIdArray.filter(
                            (user) => user.memberStatus === Status.DROPOUT
                          )
                        );
                        setNumberOfCohortMembers(nameUserIdArray?.length);
                      }
                      updateBulkAttendanceStatus(newArray);
                      return newArray;
                    };
                    mergeArrays(nameUserIdArray, userAttendanceArray);
                  }
                }
                setLoading(false);
              };
              userAttendanceStatusList();
            }
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (classId !== '') {
      getCohortMemberList();
    }
  }, [classId, selectedDate, showUpdateButton]);

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
    if (updateAttendance) return t('COMMON.SURE_UPDATE');
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
            sx={{
              ...modalContainer,
              borderColor: theme.palette.warning['A400'],
              padding: '15px 10px 0 10px',
            }}
            borderRadius={'1rem'}
            height={'526px'}
          >
            <Box height={'100%'} width={'100%'}>
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
                    {t('COMMON.MARK_CENTER_ATTENDANCE')}
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
                    onClick={confirmationOpen}
                  />
                </Box>
              </Box>
              <Box sx={{ height: '1px', background: '#D0C5B4' }}></Box>
              {loading && (
                <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
              )}

              <Box
                display={'flex'}
                flexDirection="row"
                justifyContent={'space-between'}
              >
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
                        count: numberOfCohortMembers - dropoutCount,
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
                    count: presentCount,
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
                    count: absentCount,
                  })}
                </Typography>
              </Box>

              {cohortMemberList && cohortMemberList?.length != 0 ? (
                <Box
                  height={'64%'}
                  sx={{
                    overflowY: 'scroll',
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
                          }}
                          isEdit={true}
                          bulkAttendanceStatus={bulkAttendanceStatus}
                          handleBulkAction={submitBulkAttendanceAction}
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
                          }}
                          presentCount={presentCount}
                          absentCount={absentCount}
                          // isEdit={true}
                          // bulkAttendanceStatus={bulkAttendanceStatus}
                          // handleBulkAction={submitBulkAttendanceAction}
                        />
                      )
                    )}
                  </Box>
                  <Box
                    position={'absolute'}
                    bottom="15px"
                    display={'flex'}
                    gap={'20px'}
                    flexDirection={'row'}
                    justifyContent={'space-evenly'}
                    // marginBottom={'8px'}
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
              ) : (
                <NoDataFound />
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default MarkBulkAttendance;

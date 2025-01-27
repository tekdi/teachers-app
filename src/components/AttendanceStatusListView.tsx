import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  AttendanceStatusListViewProps,
  UpdateCustomField,
} from '../utils/Interfaces';

import { getUserDetails } from '@/services/ProfileService';
import { Status } from '@/utils/app.constant';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; //present
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  ATTENDANCE_ENUM,
  capitalizeEachWord,
  filterMiniProfileFields,
  shortDateFormat,
  toPascalCase,
} from '../utils/Helper';
import DropoutLabel from './DropoutLabel';
import LearnerModal from './LearnerModal';
import Loader from './Loader';

const AttendanceStatusListView: React.FC<AttendanceStatusListViewProps> = ({
  isDisabled = false,
  showLink = false,
  userData,
  isEdit = false,
  isBulkAction = false,
  handleBulkAction = () => {},
  bulkAttendanceStatus = '',
  presentCount,
  absentCount,
  attendanceDate,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  let updatedAtDate: string | undefined;
  let attendanceDateFormatted: string | undefined;

  if (userData?.updatedAt) {
    updatedAtDate = shortDateFormat(new Date(userData.updatedAt));
  }

  if (attendanceDate) {
    attendanceDateFormatted = shortDateFormat(new Date(attendanceDate));
  }

  const boxStyling = {
    display: 'flex',
    height: isBulkAction ? '56px' : '',
    padding: '0 8px',
    alignItems: 'center',
    borderRadius: isBulkAction ? '8px' : 0,
    // marginBottom: '12px',
    backgroundColor: isBulkAction ? theme.palette.warning[800] : 'none',
    // position: isBulkAction ? 'fixed' : 'none',
    // width: isBulkAction ? '89%' : '100%',
    borderBottom: isBulkAction ? 'none' : '1px solid #D0C5B4', 
    justifyContent: 'space-between',
  };

  const handleClickAction = (
    isBulkAction: boolean,
    selectedAction: string,
    id?: string
  ) => {
    if (isEdit) {
      handleBulkAction(isBulkAction, selectedAction, id);
    }
  };

  // -----learner profile  details----
  const [customFieldsData, setCustomFieldsData] = React.useState<
    UpdateCustomField[]
  >([]);
  const [contactNumber, setContactNumber] = useState<any>('');
  const [userName, setUserName] = React.useState('');
  const [enrollmentNumber, setEnrollmentNumber] = React.useState('');
  const [isModalOpenLearner, setIsModalOpenLearner] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenModalLearner = (userId: string) => {
    if (!showLink) {
      return;
    }
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
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            let fullName = "";

            if (userData?.firstName) {
              fullName += toPascalCase(userData.firstName);
            }
            
            if (userData?.middleName) {
              fullName += (fullName ? " " : "") + toPascalCase(userData.middleName);
            }
            
            if (userData?.lastName) {
              fullName += (fullName ? " " : "") + toPascalCase(userData.lastName);
            }
            
            setUserName(fullName);

            setContactNumber(userData?.mobile);
            setEnrollmentNumber(userData?.username);
            const customDataFields = userData?.customFields;
            if (customDataFields?.length > 0) {
              setCustomFieldsData(customDataFields);
            }
            setLoading(false);
          } else {
            console.log('No data Found');
          }
        } else {
          console.log('No Response Found');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const filteredFields = filterMiniProfileFields(customFieldsData);

  return (
    <Box sx={{ padding: '0 10px' }}>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        showLink && (
          <LearnerModal
            userId={userData?.userId}
            open={isModalOpenLearner}
            onClose={handleCloseModalLearner}
            data={filteredFields}
            userName={userName}
            contactNumber={contactNumber}
            enrollmentNumber={enrollmentNumber}
          />
        )
      )}

      <Box sx={boxStyling} className="last-hide-border">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant="body1"
            marginY="auto"
            sx={{
              textAlign: 'left',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '400',
              color: isDisabled
                ? theme.palette.warning['400']
                : theme.palette.warning['300'],
            }}
            onClick={() => handleOpenModalLearner(userData?.userId!)}
            className="two-line-text"
          >
            {isBulkAction ? (
              t('COMMON.MARK_ALL_AS')
            ) : showLink ? (
              <Link style={{ color: theme.palette.secondary.main }} href={''}>
                {userData?.name}
              </Link>
            ) : (
              userData?.name
            )}
          </Typography>
          <Typography variant='h6'>{(userData?.userName)?.toUpperCase()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          {userData?.memberStatus === Status.DROPOUT &&
          updatedAtDate &&
          attendanceDateFormatted &&
          updatedAtDate <= attendanceDateFormatted ? (
            <Box display="column">
              {presentCount === 0 && absentCount === 0 ? (
                <DropoutLabel />
              ) : (
                <>
                  <Box display="flex">
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      className="icon_holder"
                      p={1}
                    >
                      {[userData?.attendance, bulkAttendanceStatus].includes(
                        ATTENDANCE_ENUM.PRESENT
                      ) ? (
                        <CheckCircleIcon
                          sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                          style={{
                            fill: theme.palette.success.main,
                          }}
                        />
                      ) : (
                        <CheckCircleOutlineIcon
                          sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                          style={{
                            fill: isDisabled
                              ? theme.palette.warning['400']
                              : theme.palette.warning[100],
                          }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        marginTop={1}
                        sx={{ color: () => theme.palette.warning[400] }}
                      >
                        {t('ATTENDANCE.PRESENT')}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      className="icon_holder"
                      p={1}
                    >
                      {[userData?.attendance, bulkAttendanceStatus].includes(
                        ATTENDANCE_ENUM.ABSENT
                      ) ? (
                        <CancelIcon
                          sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                          style={{ fill: theme.palette.error.main }}
                        />
                      ) : (
                        <HighlightOffIcon
                          sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                          style={{
                            fill: isDisabled
                              ? theme.palette.warning['400']
                              : theme.palette.warning[100],
                          }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        marginTop={1}
                        sx={{ color: () => theme.palette.warning[400] }}
                      >
                        {t('ATTENDANCE.ABSENT')}
                      </Typography>
                    </Box>
                  </Box>
                  {/* <DropoutLabel /> */}
                  {updatedAtDate &&
                    attendanceDateFormatted &&
                    updatedAtDate <= attendanceDateFormatted &&
                    userData.memberStatus === Status.DROPOUT && <DropoutLabel />}
                </>
              )}
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                className="icon_holder"
                p={1}
                onClick={() =>
                  handleClickAction(
                    isBulkAction,
                    ATTENDANCE_ENUM.PRESENT,
                    isBulkAction ? '' : userData?.userId
                  )
                }
              >
                {[userData?.attendance, bulkAttendanceStatus].includes(
                  ATTENDANCE_ENUM.PRESENT
                ) ? (
                  <CheckCircleIcon
                    sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                    style={{
                      fill: theme.palette.success.main,
                    }}
                  />
                ) : (
                  <CheckCircleOutlineIcon
                    sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                    style={{
                      fill: isDisabled
                        ? theme.palette.warning['400']
                        : theme.palette.warning[100],
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  marginTop={1}
                  sx={{ color: () => theme.palette.warning[400] }}
                >
                  {t('ATTENDANCE.PRESENT')}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                className="icon_holder"
                p={1}
                onClick={() =>
                  handleClickAction(
                    isBulkAction,
                    ATTENDANCE_ENUM.ABSENT,
                    isBulkAction ? '' : userData?.userId
                  )
                }
              >
                {[userData?.attendance, bulkAttendanceStatus].includes(
                  ATTENDANCE_ENUM.ABSENT
                ) ? (
                  <CancelIcon
                    sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                    style={{ fill: theme.palette.error.main }}
                  />
                ) : (
                  <HighlightOffIcon
                    sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                    style={{
                      fill: isDisabled
                        ? theme.palette.warning['400']
                        : theme.palette.warning[100],
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  marginTop={1}
                  sx={{ color: () => theme.palette.warning[400] }}
                >
                  {t('ATTENDANCE.ABSENT')}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AttendanceStatusListView;

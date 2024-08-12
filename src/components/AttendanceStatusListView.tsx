import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  AttendanceStatusListViewProps,
  UpdateCustomField,
} from '../utils/Interfaces';

import { getUserDetails } from '@/services/ProfileService';
import { Status, names } from '@/utils/app.constant';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; //present
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ATTENDANCE_ENUM } from '../utils/Helper';
import DropoutLabel from './DropoutLabel';
import LearnerModal from './LearnerModal';
import Loader from './Loader';



const attendance = {
  self: {
    allowed: 1,
    back_dated_attendance: 0,
    restrict_attendance_timings: 1,
    attendance_starts_at: '10:15',
    attendance_ends_at: '13:05',
    allow_late_marking: 1,
    capture_geoLocation: 1,
  },
  student: {
    allowed: 1,
    back_dated_attendance: 0,
    restrict_attendance_timings: 1,
    attendance_starts_at: '13:33',
    attendance_ends_at: '13:35',
    allow_late_marking: 1,
    capture_geoLocation: 1,
  },}


  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
  };
  
  const isWithinAttendanceTime = (attendanceTimes: {
    attendance_starts_at: string | null;
    attendance_ends_at: string | null;
  }) => {
    if (!attendanceTimes.attendance_starts_at || !attendanceTimes.attendance_ends_at) {
      return true;
    }
  
    const now = new Date().getTime();
    const startsAt = formatTime(attendanceTimes.attendance_starts_at);
    const endsAt = formatTime(attendanceTimes.attendance_ends_at);
  
    return now >= startsAt && now <= endsAt;
  };




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
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();


  const attendanceTimes =  attendance.student 
  const canMarkAttendance = isWithinAttendanceTime(attendanceTimes);



  const boxStyling = {
    display: 'flex',
    height: isBulkAction ? '56px' : '',
    // width: '100%',
    // borderBottom: `0.5px solid ${theme.palette.warning[400]}`,
    padding: '0 8px',
    alignItems: 'center',
    borderRadius: isBulkAction ? '8px' : 0,
    // marginBottom: '12px',
    backgroundColor: isBulkAction ? theme.palette.warning[800] : 'none',
    // position: isBulkAction ? 'fixed' : 'none',
    // width: isBulkAction ? '89%' : '100%',
    borderBottom: isBulkAction ? 'none' : '1px solid #D0C5B4',
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
        console.log('response for popup', response?.result);
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserName(userData?.name);
            setContactNumber(userData?.mobile);
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

  const filteredFields = names
    .map((label) => customFieldsData.find((field) => field.name === label))
    .filter(Boolean);

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
          />
        )
      )}

      <Box sx={boxStyling}>
        <Typography
          variant="body1"
          marginRight="auto"
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
            t('ATTENDANCE.MARK_ALL')
          ) : showLink ? (
            <Link style={{ color: theme.palette.secondary.main }} href={''}>
              {userData?.name}
            </Link>
          ) : (
            userData?.name
          )}
        </Typography>
        {userData?.memberStatus === Status.DROPOUT ? (
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
                <DropoutLabel />
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
              sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
            >
              {[userData?.attendance, bulkAttendanceStatus].includes(
                ATTENDANCE_ENUM.PRESENT
              ) ? (
                <CheckCircleIcon
                sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
                  style={{
                    fill: theme.palette.success.main,
                  }}
                />
              ) : (
                <CheckCircleOutlineIcon
                sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
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
              sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
            >
              {[userData?.attendance, bulkAttendanceStatus].includes(
                ATTENDANCE_ENUM.ABSENT
              ) ? (
                <CancelIcon
                sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
                  style={{ fill: theme.palette.error.main }}
                />
              ) : (
                <HighlightOffIcon
                sx={{ cursor: canMarkAttendance ? 'pointer' : 'not-allowed' }}
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
  );
};

export default AttendanceStatusListView;

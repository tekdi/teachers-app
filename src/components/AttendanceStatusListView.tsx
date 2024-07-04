import {
  AttendanceStatusListViewProps,
  UserData,
  updateCustomField,
} from '../utils/Interfaces';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { ATTENDANCE_ENUM } from '../utils/Helper';
import { BorderBottom } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; //present
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LearnerModal from './LearnerModal';
import Link from 'next/link';
import Loader from './Loader';
import { getUserDetails } from '@/services/ProfileService';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import DropoutLabel from './DropoutLabel';
import { Status, names } from '@/utils/app.constant';

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

  const boxStyling = {
    display: 'flex',
    height: isBulkAction ? '56px' : '',
    // width: '100%',
    // borderBottom: `0.5px solid ${theme.palette.warning[400]}`,
    padding: isBulkAction ? '0 8px' : '0 8px',
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
  const [usersData, setUsersData] = React.useState<UserData | null>(null);
  const [customFieldsData, setCustomFieldsData] = React.useState<
    updateCustomField[]
  >([]);
  const [contactNumber, setContactNumber] = useState<any>('');
  const [userName, setUserName] = React.useState('');
  const [isModalOpenLearner, setIsModalOpenLearner] = useState(false);
  const [loading, setLoading] = useState(false);
  // const userId = '12345'; // Replace with the actual user ID you want to pass

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
            // setUsersData(userData);
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
                          fill: isDisabled
                            ? theme.palette.success.main
                            : theme.palette.success.main,
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
            >
              {[userData?.attendance, bulkAttendanceStatus].includes(
                ATTENDANCE_ENUM.PRESENT
              ) ? (
                <CheckCircleIcon
                  sx={{ cursor: isDisabled ? 'default' : 'pointer' }}
                  style={{
                    fill: isDisabled
                      ? theme.palette.success.main
                      : theme.palette.success.main,
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
  );
};

export default AttendanceStatusListView;

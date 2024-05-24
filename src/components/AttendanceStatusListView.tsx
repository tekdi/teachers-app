import { Box, Typography } from '@mui/material';

import { ATTENDANCE_ENUM } from '../utils/Helper';
import { AttendanceStatusListViewProps } from '../utils/Interfaces';
import { BorderBottom } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; //present
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const AttendanceStatusListView: React.FC<AttendanceStatusListViewProps> = ({
  userData,
  isEdit = false,
  isBulkAction = false,
  handleBulkAction = () => {},
  bulkAttendanceStatus = '',
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
  return (
    <Box>
      <Box sx={boxStyling}>
        <Typography
          variant="body1"
          marginRight="auto"
          marginY="auto"
          sx={{
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: '400',
            color: '#1F1B13',
          }}
        >
          {isBulkAction ? t('ATTENDANCE.MARK_ALL') : userData?.name}
        </Typography>
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
            <CheckCircleIcon sx={{ color: () => theme.palette.warning[400] }} />
          ) : (
            <CheckCircleOutlineIcon
              sx={{ color: () => theme.palette.warning[400] }}
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
            <CancelIcon sx={{ color: () => theme.palette.warning[400] }} />
          ) : (
            <HighlightOffIcon />
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
    </Box>
  );
};

export default AttendanceStatusListView;

import { SessionsCardProps } from '@/utils/Interfaces';
import { Box, Snackbar, Typography } from '@mui/material';

import { convertUTCToIST } from '@/utils/Helper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import CenterSessionModal from './CenterSessionModal';
import PlannedSession from './PlannedSession';
import ConfirmationModal from './ConfirmationModal';

const SessionsCard: React.FC<SessionsCardProps> = ({
  data,
  children,
  isEventDeleted,
  isEventUpdated,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [eventDeleted, setEventDeleted] = React.useState(false);
  const [eventEdited, setEventEdited] = React.useState(false);
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [editSelection, setEditSelection] = React.useState('EDIT_SESSION');
  const [updateEvent, setUpdateEvent] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [editSession, setEditSession] = React.useState();
  const handleEditSelection = (selection: string) => {
    setEditSelection(selection);
  };
  const handleOpen = (eventData: any) => {
    setOpen(true);
    setEditSession(eventData);
    setEventEdited(true);
  };

  const handleClose = () => setOpen(false);

  const onEventDeleted = () => {
    setOpen(false);
    setEventDeleted(true);
    if (isEventDeleted) {
      isEventDeleted();
    }
  };

  const onEventUpdated = () => {
    setOpen(false);
    if (isEventUpdated) {
      isEventUpdated();
    }
    setUpdateEvent(false);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleCopyUrl = () => {
    if (data?.url) {
      navigator.clipboard
        .writeText(data.url)
        .then(() => {
          setSnackbarOpen(true);
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  useEffect(() => {
    const startDateTime = convertUTCToIST(data?.startDateTime);
    const startDate = startDateTime.date;
    const startTime = startDateTime.time;
    setStartTime(startTime);
    setStartDate(startDate);

    const endDateTime = convertUTCToIST(data?.endDateTime);
    const endDate = endDateTime.date;
    const endTime = endDateTime.time;
    setEndTime(endTime);

    console.log(startDate, startTime, endDate, endTime);
  }, [data]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const sessionDate = new Date(`${startDate} ${currentYear}`);
    const currentDate = new Date();
    sessionDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (currentDate <= sessionDate) {
      setShowEdit(true);
    } else {
      setShowEdit(false);
    }
  }, [startDate]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditModal = () => {
    setModalOpen(true);
  };

  const onUpdateClick = () => {
    console.log('update the event');
    setUpdateEvent(true);
    // if (isEventUpdated) {
    //   isEventUpdated();
    // }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: '8px',
        marginBottom: '38px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 16px 4px',
        }}
      >
        <Box>
          <Typography
            color={theme.palette.warning['300']}
            fontWeight={'400'}
            textAlign={'left'}
            fontSize={'16px'}
          >
            {data?.metadata?.framework?.subject}
          </Typography>

          <Typography
            fontWeight={'400'}
            textAlign={'left'}
            fontSize={'14px'}
            display={'flex'}
            alignItems={'center'}
            gap={'4px'}
          >
            {data?.isRecurring === false && (
              <>
                <CalendarMonthIcon sx={{ fontSize: '18px' }} /> {startDate},{' '}
              </>
            )}
            {startTime} - {endTime}
          </Typography>
          <Typography fontWeight={'400'} textAlign={'left'} fontSize={'14px'}>
            {data?.metadata?.framework?.teacherName}
          </Typography>
        </Box>
        {showEdit && (
          <EditOutlined
            onClick={() => handleOpen?.(data)}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
      <Box
        sx={{
          padding: '0px 16px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '30px',
        }}
        onClick={handleCopyUrl}
      >
        <Box
          sx={{
            fontSize: '14px',
            color: theme.palette.secondary.main,
            fontWeight: '500',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          {data?.meetingDetails?.url}
        </Box>
        {data?.meetingDetails?.url && (
          <ContentCopyIcon
            sx={{
              fontSize: '18px',
              color: theme.palette.secondary.main,
              cursor: 'pointer',
            }}
          />
        )}
      </Box>
      <CenterSessionModal
        open={open}
        handleClose={handleClose}
        title={'Home Science'}
        primary={eventEdited ? 'Update' : 'Schedule'}
        handleEditModal={handleEditModal}
      >
        <PlannedSession
          editSession={editSession}
          handleEditSelection={handleEditSelection}
          onEventDeleted={onEventDeleted}
          onEventUpdated={onEventUpdated}
          eventDeleted={eventDeleted}
          eventData={data}
          updateEvent={updateEvent}
        />
      </CenterSessionModal>

      <ConfirmationModal
        message={t('CENTER_SESSION.UPDATE_CHANGES')}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModal={handleCloseModal}
        handleAction={onUpdateClick}
        modalOpen={modalOpen}
      />

      <Box>{children}</Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="URL copied to clipboard"
      />
    </Box>
  );
};

export default SessionsCard;

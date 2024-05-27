import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { ATTENDANCE_ENUM, formatDate } from '../utils/Helper';
//components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
//icons
import { Icon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; //present
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; //Half-Day
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { MarkAttendanceProps } from '../utils/Interfaces';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

type IconType = React.ReactElement<typeof Icon>;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));
const MarkAttendance: React.FC<MarkAttendanceProps> = ({
  isOpen,
  isSelfAttendance = true,
  date,
  name,
  currentStatus,
  handleClose,
  handleSubmit,
  message,
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = React.useState(currentStatus);
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);
  const theme = useTheme<any>();
  const SNACKBAR_AUTO_HIDE_DURATION = 5000;
  const [openMarkUpdateAttendance, setOpenMarkUpdateAttendance] =
    React.useState(false);
  const handleMarkUpdateAttendanceModal = () =>
    setOpenMarkUpdateAttendance(!openMarkUpdateAttendance);
  const [openMarkClearAttendance, setOpenMarkClearAttendance] =
    React.useState(false);
  const handleMarkClearAttendanceModal = () => {
    setOpenMarkClearAttendance(!openMarkClearAttendance);
  };
  const [modal, setModal] = React.useState<State>({
    openModal: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, openModal } = modal;
  const submitUpdateAttendance = () => {
    handleClose();
    handleMarkUpdateAttendanceModal();
  };
  const submitClearAttendance = () => {
    setStatus(ATTENDANCE_ENUM.NOT_MARKED);
    handleClose();
    handleMarkClearAttendanceModal();
  };
  const submitAttendance = (newState: SnackbarOrigin) => () => {
    handleSubmit(date, status);
    //  setOpenMarkUpdateAttendance(!openMarkUpdateAttendance);
    setModal({ ...newState, openModal: true });
    setTimeout(() => {
      handleClose2();
    }, SNACKBAR_AUTO_HIDE_DURATION);
  };

  const submitConfirmAttendance = (newState: SnackbarOrigin) => () => {
    // setOpenMarkClearAttendance(!openMarkClearAttendance);
    handleMarkUpdateAttendanceModal();
    handleSubmit(date, status);

    setModal({ ...newState, openModal: true });
    setTimeout(() => {
      handleClose2();
    }, SNACKBAR_AUTO_HIDE_DURATION);
  };

  const handleClose2 = () => {
    setModal({ ...modal, openModal: false });
  };
  const handleClear = () => {
    if (status !== ATTENDANCE_ENUM.NOT_MARKED) {
      setStatus(ATTENDANCE_ENUM.NOT_MARKED);
    }
  };
  const getButtonComponent = (
    value: string,
    icon1: IconType,
    icon2: IconType,
    text: string
  ) => {
    //setStatus(currentStatus)
    // console.log(status === value)

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        onClick={() => setStatus(value)}
      >
        {status === value ? icon1 : icon2}
        <Typography marginTop={1}>{text}</Typography>
      </Box>
    );
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        sx={{ borderRadius: '16px' }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Typography variant="h2" sx={{ marginBottom: 0 }}>
            {currentStatus === ATTENDANCE_ENUM.NOT_MARKED
              ? t('COMMON.MARK_ATTENDANCE')
              : t('COMMON.UPDATE_ATTENDANCE')}
          </Typography>
          <Typography
            variant="h4"
            sx={{ marginBottom: 0, color: theme.palette.warning['A200'] }}
          >
            {formatDate(date)}
          </Typography>
        </DialogTitle>
        {/* <Typography variant="h2">Mark Attendance</Typography> */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.warning['A200'],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            alignItems="center"
          >
            {!isSelfAttendance && (
              <Typography variant="body1">{name}</Typography>
            )}
            {getButtonComponent(
              ATTENDANCE_ENUM.PRESENT,
              <CheckCircleIcon style={{ fill: theme.palette.success.main }} />,
              <CheckCircleOutlineIcon />,
              t('ATTENDANCE.PRESENT')
            )}
            {getButtonComponent(
              isSelfAttendance
                ? ATTENDANCE_ENUM.ON_LEAVE
                : ATTENDANCE_ENUM.ABSENT,
              <CancelIcon style={{ fill: theme.palette.error.main }} />,
              <HighlightOffIcon />,
              isSelfAttendance
                ? t('ATTENDANCE.ON_LEAVE')
                : t('ATTENDANCE.ABSENT')
            )}
            {/* {isSelfAttendance &&
              getButtonComponent(
                ATTENDANCE_ENUM.HALF_DAY,
                <RemoveCircleIcon />,
                <RemoveCircleOutlineIcon />,
                t('ATTENDANCE.HALF_DAY')
              )} */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            autoFocus
            onClick={() => {
              if (currentStatus === ATTENDANCE_ENUM.NOT_MARKED) {
                {
                  handleClear();
                }
              } else {
                submitClearAttendance();
              }
            }}
            sx={{
              width: '100%',
            }}
          >
            {t('ATTENDANCE.CLEAR')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (currentStatus === ATTENDANCE_ENUM.NOT_MARKED) {
                {
                  submitAttendance({
                    vertical: 'bottom',
                    horizontal: 'center',
                  })();
                }
              } else {
                submitUpdateAttendance();
              }
            }}
            disabled={
              status === ATTENDANCE_ENUM.NOT_MARKED || status === currentStatus
            }
            sx={{
              width: '100%',
            }}
          >
            {currentStatus === ATTENDANCE_ENUM.NOT_MARKED
              ? t('COMMON.SAVE')
              : t('COMMON.UPDATE')}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleMarkUpdateAttendanceModal}
        aria-labelledby="customized-update-dialog-title"
        open={openMarkUpdateAttendance}
        sx={{ borderRadius: '16px' }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-update-dialog-title">
          <Typography variant="h2" sx={{ marginBottom: 0 }}>
            {t('ATTENDANCE.UPDATE_ATTENDANCE_ALERT')}
          </Typography>
        </DialogTitle>
        {/* <Typography variant="h2">Mark Attendance</Typography> */}

        <DialogActions>
          <Button
            //  variant="outlined"
            autoFocus
            onClick={handleMarkUpdateAttendanceModal}
            sx={{
              width: '100%',
            }}
          >
            {t('ATTENDANCE.NO_GO_BACK')}
          </Button>
          <Button
            variant="contained"
            onClick={submitConfirmAttendance({
              vertical: 'bottom',
              horizontal: 'center',
            })}
            disabled={
              status === ATTENDANCE_ENUM.NOT_MARKED || status === currentStatus
            }
            sx={{
              width: '100%',
            }}
          >
            {t('COMMON.UPDATE')}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleMarkClearAttendanceModal}
        aria-labelledby="customized-clear-dialog-title"
        open={openMarkClearAttendance}
        sx={{ borderRadius: '16px' }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-clear-dialog-title">
          <Typography variant="h2" sx={{ marginBottom: 0 }}>
            {t('ATTENDANCE.CLEAR_ATTENDANCE_ALERT')}
          </Typography>
        </DialogTitle>
        {/* <Typography variant="h2">Mark Attendance</Typography> */}

        <DialogActions>
          <Button
            //  variant="outlined"
            autoFocus
            onClick={handleMarkClearAttendanceModal}
            sx={{
              width: '100%',
            }}
          >
            {t('ATTENDANCE.NO_GO_BACK')}
          </Button>
          <Button
            variant="contained"
            onClick={submitClearAttendance}
            sx={{
              width: '100%',
            }}
          >
            {t('COMMON.YES')}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openModal}
        onClose={handleClose2}
        message={message}
        key={vertical + horizontal}
        className="sample"
      />
    </React.Fragment>
  );
};

export default MarkAttendance;

import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ReactGA from 'react-ga4';
import { dropoutReasons } from '../../app.config';
import { showToastMessage } from './Toastify';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Status } from '@/utils/app.constant';
import { fetchAttendanceStats } from '@/utils/helperAttendanceStatApi';
import { modalStyles } from '@/styles/modalStyles';
interface DropOutModalProps {
  open: boolean;
  onClose: (confirmed: boolean, reason?: string) => void;
  cohortMembershipId: string | number;
  isButtonAbsent?: boolean;
  statusReason?: string;
  userId: string;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
}

function DropOutModal({
  open,
  onClose,
  cohortMembershipId,
  isButtonAbsent,
  statusReason,
  userId,
  reloadState,
  setReloadState,
}: DropOutModalProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const theme = useTheme<any>();

  React.useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);



  const handleSelection = (event: SelectChangeEvent) => {
    setSelectedReason(event.target.value);
    setIsButtonDisabled(false);
  };

  const handleMarkDropout = async () => {
    try {
      onClose(true, selectedReason);
      setLoading(true);
      const attendanceStats = await fetchAttendanceStats(userId);
      if (attendanceStats && attendanceStats.length > 0) {
        showToastMessage(
          t('COMMON.CANNOT_DROPOUT_TODAY_ATTENDANCE_MARKED'),
          'error'
        );
      } else if (selectedReason && cohortMembershipId) {
        const memberStatus = Status.DROPOUT;
        const statusReason = selectedReason;
        const membershipId = cohortMembershipId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          statusReason,
          membershipId,
        });

        if (response?.params?.err) {
          ReactGA.event('dropout-student-error', {
            cohortMembershipId: membershipId,
          });
          // throw new Error(response.params?.errmsg || 'An error occurred while updating the user.');
        } else {
          ReactGA.event('dropout-student-successful', {
            cohortMembershipId: membershipId,
          });
          showToastMessage(t('COMMON.LEARNER_MARKED_DROPOUT'), 'success');
          setReloadState(true);
        }
        setIsButtonDisabled(true);
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      open={open}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalStyles}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          sx={{ padding: '18px 16px' }}
        >
          <Box marginBottom={'0px'}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {t('COMMON.DROP_OUT')}
            </Typography>
          </Box>
          <CloseIcon
            sx={{
              cursor: 'pointer',
              color: theme.palette.warning['A200'],
            }}
            onClick={() => onClose(false)}
          />
        </Box>
        <Divider />
        {isButtonAbsent ? (
          <Box sx={{ padding: '18px 16px', width: '100%' }}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['400'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {t('COMMON.REASON_FOR_DROPOUT')}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['300'],
                fontSize: '16px',
              }}
              component="h2"
            >
              {statusReason}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ padding: '10px 18px' }}>
              <FormControl sx={{ mt: 1, width: '100%' }}>
                <InputLabel
                  sx={{
                    fontSize: '16px',
                    color: theme.palette.warning['300'],
                  }}
                  id="demo-multiple-name-label"
                >
                  {t('COMMON.REASON_FOR_DROPOUT')}
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  input={<OutlinedInput label="Reason for Dropout" />}
                  onChange={handleSelection}
                >
                  {dropoutReasons?.map((reason) => (
                    <MenuItem
                      key={reason.value}
                      value={reason.value}
                      sx={{
                        fontSize: '16px',
                        color: theme.palette.warning['300'],
                      }}
                    >
                      {reason.label
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={1.5}>
              <Divider />
            </Box>
            <Box p={'18px'}>
              <Button
                className="w-100"
                sx={{ boxShadow: 'none' }}
                variant="contained"
                onClick={handleMarkDropout}
                disabled={isButtonDisabled}
              >
                {t('COMMON.MARK_DROP_OUT')}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default DropOutModal;

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
import { useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';
import { dropoutReasons } from '../../app.config';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import ReactGA from 'react-ga4';

interface DropOutModalProps {
  open: boolean;
  onClose: (confirmed: boolean, reason?: string) => void;
  cohortMembershipId: string | number;
}

function DropOutModal({
  open,
  onClose,
  cohortMembershipId,
}: DropOutModalProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = React.useState<boolean>(true);

  const { t } = useTranslation();
  const theme = useTheme<any>();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '24px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const handleSelection = (event: SelectChangeEvent) => {
    setSelectedReason(event.target.value);
    setIsButtonDisabled(false);
  };

  const handleMarkDropout = () => {
    onClose(true, selectedReason);
    console.log('Dropout api called');
    if (selectedReason && cohortMembershipId) {
      const memberStatus = 'dropout';
      const statusReason = selectedReason;
      const membershipId = cohortMembershipId;
      const response = updateCohortMemberStatus({
        memberStatus,
        statusReason,
        membershipId,
      });
      // console.log('!!!!!!!!!!!!!!!!!!!!!', response);
      ReactGA.event('dropout-student-successful', {
        cohortMembershipId: membershipId,
      });
      // if (response.responseCode !== 201 || response.params.err) {
      //   ReactGA.event('dropout-student-error', { cohortMembershipId: membershipId });
      throw new Error();
      //   //   response.params.errmsg ||
      //   //     'An error occurred while updating the user.'
    }
    setIsButtonDisabled(true);
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
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
          <Box sx={{ padding: '10px 18px' }}>
            <FormControl sx={{ mt: 1, width: '100%' }}>
              <InputLabel
                sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
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
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default DropOutModal;

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { showToastMessage } from './Toastify';
import { getCohortList } from '@/services/CohortServices';
import { updateFacilitator } from '@/services/ManageUser';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import { Role, Status } from '@/utils/app.constant';
import manageUserStore from '@/store/manageUserStore';

interface DeleteUserModalProps {
  type: Role.STUDENT | Role.TEACHER;
  userId: string;
  open: boolean;
  onClose: () => void;
  onUserDelete: () => void;
}
const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  type,
  userId,
  open,
  onClose,
  onUserDelete,
}) => {
  const store = manageUserStore();
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const [selectedValue, setSelectedValue] = useState('');
  // const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { value: 'Incorrect Data Entry', label: 'Incorrect Data Entry' },
    { value: 'Duplicated User', label: 'Duplicated User' },
    // { value: 'Other', label: 'Other' },
  ];

  const handleRadioChange = (value: string) => {
    console.log(value);
    setSelectedValue(value);
  };

  const handleDeleteAction = async () => {
    if (type == Role.TEACHER) {
      const studentData = {
        status: Status.ARCHIVED,
        reason: selectedValue,
      };

      const studentResponse = await updateFacilitator(userId, studentData);
    } else if (type == Role.STUDENT) {
      const memberStatus = Status.ARCHIVED;
      const statusReason = selectedValue;
      const membershipId = store?.learnerDeleteId;

      const teacherResponse = await updateCohortMemberStatus({
        memberStatus,
        statusReason,
        membershipId,
      });
    }

    setSelectedValue('');
    onClose();
    onUserDelete();
    showToastMessage(t('COMMON.USER_DELETED_PERMANENTLY'), 'success');
  };

  // const handleOtherReasonChange = (event: any) => {
  //   setOtherReason(event.target.value);
  // };

  return (
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
              {t('COMMON.DELETE_USER')}
            </Typography>
          </Box>
          <CloseIcon
            sx={{
              cursor: 'pointer',
              color: theme.palette.warning['A200'],
            }}
            onClick={onClose}
          />
        </Box>
        <Divider />
        {/* {isButtonAbsent ? ( */}
        <Box sx={{ padding: '18px 16px', width: '100%' }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.warning['400'],
              fontSize: '14px',
            }}
            component="h2"
          >
            {t('COMMON.REASON_FOR_DELETION')}
          </Typography>
        </Box>
        <>
          <Box padding={'0 1rem'}>
            {reasons.map((option) => (
              <>
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: theme.palette.warning['A200'],
                      fontSize: '14px',
                    }}
                    component="h2"
                  >
                    {option.label}
                  </Typography>

                  <Radio
                    sx={{ pb: '20px' }}
                    onChange={() => handleRadioChange(option.value)}
                    value={option.value}
                    checked={selectedValue === option.value}
                  />
                </Box>
                <Divider />
              </>
            ))}
            {/* {selectedValue === 'Other' && (
              <FormControl sx={{ mt: 2, width: '100%' }}>
                <TextField
                  id="otherReason"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label={t('COMMON.OTHER_REASON')}
                  placeholder={t('COMMON.OTHER_REASON_PLACEHOLDER')}
                  value={otherReason}
                  onChange={(e) => handleOtherReasonChange(e)}
                />
              </FormControl>
            )} */}
          </Box>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={() => handleDeleteAction()}
              disabled={selectedValue === ''}
            >
              {t('COMMON.DELETE_USER_WITH_REASON')}
            </Button>
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default DeleteUserModal;

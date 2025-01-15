import { updateFacilitator } from '@/services/ManageUser';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import manageUserStore from '@/store/manageUserStore';
import { Role, Status } from '@/utils/app.constant';
import { fetchAttendanceStats } from '@/utils/helperAttendanceStatApi';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Modal,
  Radio,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { showToastMessage } from './Toastify';
import { modalStyles } from '@/styles/modalStyles';

interface DeleteUserModalProps {
  type: Role.STUDENT | Role.TEACHER;
  userId: string;
  open: boolean;
  onClose: () => void;
  onUserDelete: () => void;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  type,
  userId,
  open,
  onClose,
  onUserDelete,
  reloadState,
  setReloadState,
}) => {
  const store = manageUserStore();
  const { t } = useTranslation();
  const theme = useTheme<any>();

  React.useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);



  const [selectedValue, setSelectedValue] = useState('');
  // const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { value: 'Incorrect Data Entry', label: t('COMMON.INCORRECT_DATA_ENTRY') },
    { value: 'Duplicated User', label: t('COMMON.DUPLICATED_USER') },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleDeleteAction = async () => {
    if (type === Role.TEACHER) {
      const studentData = {
        status: Status.ARCHIVED,
        reason: selectedValue,
      };

      await updateFacilitator(userId, studentData);
      showToastMessage(t('COMMON.USER_DELETED_PERMANENTLY'), 'success');
    } else if (type === Role.STUDENT) {
      //API call to check if today's attendance is marked. If yes, don't allow achieve today
      const attendanceStats = await fetchAttendanceStats(userId);

      if (attendanceStats?.length > 0) {
        showToastMessage(
          t('COMMON.CANNOT_DELETE_TODAY_ATTENDANCE_MARKED'),
          'error'
        );
      } else {
        const memberStatus = Status.ARCHIVED;
        const statusReason = selectedValue;
        const membershipId = store?.learnerDeleteId;

        await updateCohortMemberStatus({
          memberStatus,
          statusReason,
          membershipId,
        });
        showToastMessage(t('COMMON.USER_DELETED_PERMANENTLY'), 'success');
      }
    }

    setSelectedValue('');
    onClose();
    onUserDelete();
    setReloadState(true);
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
            {reasons.map((option, index) => (
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
                {
                  reasons?.length - 1 !== index && <Divider />
                }
              </>
            ))}
          </Box>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'}>
            <Button
              className="w-100  one-line-text"
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

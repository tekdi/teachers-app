import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { showToastMessage } from './Toastify';
import { sendCredentialService } from '@/services/NotificationService';

interface SendCredentialModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  isLearnerAdded?: boolean;
}
const SendCredentialModal: React.FC<SendCredentialModalProps> = ({
  open,
  onClose,
  email,
  isLearnerAdded,
}) => {
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
  const handleAction = async () => {
    onClose();
  };

  // const handleBackAction = () => {
  //   onClose();
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
              {t('COMMON.NEW', { role: 'Learner' })}
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
        <Box
          sx={{
            padding: '18px 16px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['400'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {isLearnerAdded
                ? t('COMMON.CREDENTIALS_EMAILED_OF_LEARNER')
                : t('COMMON.CREDENTIALS_EMAILED')}
            </Typography>
          </Box>
          <Box sx={{ padding: '0 1rem' }}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['400'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {email}
            </Typography>
          </Box>
        </Box>

        <>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'} display={'flex'} gap={'1rem'}>
            {/* <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="outlined"
              onClick={() => handleBackAction()}
            >
              {t('COMMON.BACK')}
            </Button> */}
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={() => handleAction()}
            >
              {t('COMMON.OKAY')}
            </Button>
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default SendCredentialModal;

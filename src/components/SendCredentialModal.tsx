import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { showToastMessage } from './Toastify';

interface SendCredentialModalProps {
  open: boolean;
  onClose: () => void;
}
const SendCredentialModal: React.FC<SendCredentialModalProps> = ({
  open,
  onClose,
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

  const handleAction = () => {
    onClose();
    showToastMessage(t('COMMON.USER_CREDENTIAL_SEND_SUCCESSFULLY'), 'success');
  };

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
        <Box sx={{ padding: '18px 16px', width: '100%' }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.warning['400'],
              fontSize: '14px',
            }}
            component="h2"
          >
            {t('COMMON.CREDENTIALS_EMAILED')}
          </Typography>
          <Box padding={'0 1rem'}>user's email</Box>
        </Box>
        <>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'} display={'flex'} gap={'1rem'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="outlined"
            >
              {t('COMMON.BACK')}
            </Button>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={() => handleAction()}
            >
              {t('COMMON.SEND_CREDENTIALS')}
            </Button>
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default SendCredentialModal;

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { modalStyles } from '@/styles/modalStyles';

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
  const handleAction = async () => {
    onClose();
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

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Fade,
  Divider,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme, styled } from '@mui/material/styles';
import { showToastMessage } from '../Toastify';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
}

const CustomRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&.Mui-checked': {
    color: theme.palette.text.primary,
  },
}));

const DeleteCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();



  const handleDeleteButtonClick = () => {
    console.log('Delete request sent');
    showToastMessage(t('CENTERS.REQUEST_TO_DELETE_HAS_BEEN_SENT'), 'success');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'white',
            boxShadow: 24,
            maxWidth: 400,
            width: '90%',
            margin: 'auto',
            borderRadius: 3,
            outline: 'none',
            p: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 2 }}>
          
          {t('CENTERS.YOU_ARE_SENDING_REQUEST_TO_THE_STATE_ADMIN')}
          </Typography>
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            
              pl: 1,
              pr: 2,
            }}
          >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              width: '60%',
              border: 'none',
              color: theme?.palette?.secondary?.main,
              mb: 2,
            }}
          >
            
            {t('COMMON.CANCEL')}
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteButtonClick}
            sx={{
              width: '100%',
              border: 'none',
              backgroundColor: theme?.palette?.primary?.main,
              mb: 2,
            }}
          >
            
            {t('CENTERS.SEND_REQUEST')}
          </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteCenterModal;

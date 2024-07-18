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
import React, { ReactNode, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { showToastMessage } from './Toastify';
import manageUserStore from '@/store/manageUserStore';
import { getCohortList } from '@/services/CohortServices';

interface SimpleModalProps {
  secondaryActionHandler?: () => void;
  primaryActionHandler: () => void;
  secondaryText?: string;
  primaryText: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  modalTitle: string;
}
const SimpleModal: React.FC<SimpleModalProps> = ({
  open,
  onClose,
  primaryText,
  secondaryText,
  primaryActionHandler,
  secondaryActionHandler,
  children,
  modalTitle
}) => {
  const { t } = useTranslation();
  const store = manageUserStore();
  const theme = useTheme<any>();
  const style = {
    padding: '20px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '450px',
      maxHeight: '80vh',
      overflowY: 'auto', 
    },
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
          justifyContent={'center'}
          sx={{ padding: '18px 16px' }}
        >
          <Box marginBottom={'0px'}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['A200'],
                
              }}
              component="h2"
            >
              {modalTitle}
            </Typography>
          </Box>
          
        </Box>
        <Divider />
        {children}
        <Divider />

        <Box sx={{ padding: '20px 16px' }} display={'flex'}>
          {primaryText && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: theme?.palette?.primary?.main,
                },
                minWidth: '84px',
                height: '2.5rem',
                padding: theme.spacing(1),
                fontWeight: '500',
                width: '100%',
              }}
              onClick={primaryActionHandler}
            >
              {primaryText}
            </Button>
          )}

          {secondaryText && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: theme?.palette?.primary?.main,
                },
                minWidth: '84px',
                height: '2.5rem',
                padding: theme.spacing(1),
                fontWeight: '500',
                width: '100%',
              }}
              onClick={secondaryActionHandler}
            >
              {secondaryText}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SimpleModal;

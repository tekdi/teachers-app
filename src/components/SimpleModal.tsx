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
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

interface SimpleModalProps {
  secondaryActionHandler?: () => void;
  primaryActionHandler?: () => void;
  secondaryText?: string;
  primaryText?: string;
  showFooter?: boolean;
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
  showFooter = true,
  primaryActionHandler,
  secondaryActionHandler,
  children,
  modalTitle,
}) => {
  const { t } = useTranslation();
  const store = manageUserStore();
  const theme = useTheme<any>();

  const modalStyle = {
    paddingTop: '0', 
    paddingLeft: theme.spacing(2), 
    paddingRight: theme.spacing(2), 
    paddingBottom: theme.spacing(2), 
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const titleStyle = {
    position: 'sticky',
    top: '0',
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    zIndex: 9999,
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Modal
      open={open}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalStyle}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          // sx={{ padding: '18px 16px' }}
          sx={titleStyle}
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
          <Box>
            <CloseSharpIcon
              sx={{
                cursor: 'pointer',
              }}
              onClick={onClose}
              aria-label="Close"
            />
          </Box>
        </Box>
        <Divider />
        {children}
        <Divider />

        {showFooter ? (
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
        ) : null}
      </Box>
    </Modal>
  );
};

export default SimpleModal;

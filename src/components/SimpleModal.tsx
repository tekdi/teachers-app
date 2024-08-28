import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme<any>();

  const modalStyle = {
    padding: '0',
    paddingBottom: theme.spacing(2),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxHeight: '80vh',
    // overflowY: 'auto',
    backgroundColor: '#fff',
    borderRadius: '18px',
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
    borderRadius: '12px',
  };

  return (
    <Modal
      open={open}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display={'flex'} justifyContent={'space-between'} sx={titleStyle}>
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
        <Box sx={{  height: '55vh', }}>
          {children}
        </Box>
        <Divider />

        {showFooter ? (
          <Box sx={{ padding: '8px 16px' , mb:2 }} display={'flex'}>
            {secondaryText && (
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: theme?.palette?.primary?.main,
                  },
                  minWidth: '84px',
                  height: '2.5rem',
                  padding: theme.spacing(1),
                  fontWeight: '500',
                  width: '100%',
                  margin: '10px',
                }}
                onClick={secondaryActionHandler}
              >
                {secondaryText}
              </Button>
            )}
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
                  margin: '10px',
                }}
                onClick={primaryActionHandler}
              >
                {primaryText}
              </Button>
            )}
          </Box>
        ) : null}
      </Box>
    </Modal>
  );
};

export default SimpleModal;

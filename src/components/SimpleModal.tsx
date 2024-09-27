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
  children?: ReactNode;
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
    padding: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxHeight: '80vh',
    backgroundColor: '#fff',
    borderRadius: '18px',
    boxShadow: theme.shadows[5],
    display: 'flex',
    flexDirection: 'column',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const titleStyle = {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    zIndex: 1,
    borderRadius: '12px 12px 0 0',
  };

  const footerStyle = {
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1,
    borderRadius: '0 0 12px 12px',
    backgroundColor: '#fff',
  };

  const contentStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box display={'flex'} justifyContent={'space-between'} sx={titleStyle}>
          <Typography
            variant="h3"
            sx={{ color: theme.palette.warning['A200'] }}
            component="h2"
          >
            {modalTitle}
          </Typography>
          <CloseSharpIcon
            sx={{ cursor: 'pointer' }}
            onClick={onClose}
            aria-label="Close"
          />
        </Box>

        <Divider />

        {/* Scrollable Content */}
        <Box sx={contentStyle}>{children}</Box>

        <Divider />

        {/* Footer */}
        {showFooter && (
          <Box sx={footerStyle}>
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
        )}
      </Box>
    </Modal>
  );
};

export default SimpleModal;

import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTheme } from '@mui/material/styles';
import { modalStyles } from '@/styles/modalStyles';

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

  const titleStyle = {
    backgroundColor: theme.palette.warning['A400'],
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
    backgroundColor: theme.palette.warning['A400'],
  };

  const contentStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '0 16px 16px',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={modalStyles}>
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

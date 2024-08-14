import React from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  Divider,
  useMediaQuery,
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  subtitle?: string;
  primaryBtnText: string;
  secondaryBtnText?: string;
  primaryBtnClick?: () => void;
  secondaryBtnClick?: () => void;
  showClose?: boolean;
  backdropClose?: boolean;
  primaryBtnDisabled?: boolean;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  handleClose,
  title,
  subtitle,
  primaryBtnText,
  secondaryBtnText,
  primaryBtnClick,
  secondaryBtnClick,
  showClose = true,
  backdropClose = true,
  primaryBtnDisabled = true,
  children,
}) => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  return (
    <Modal
      open={open}
      onClose={backdropClose ? handleClose : undefined}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '90%' : 400,
          maxWidth: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography id="modal-title" variant="h1">
              {title}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            {showClose && (
              <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        {subtitle && (
          <Typography id="modal-subtitle" variant="h5">
            {subtitle}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Box id="modal-description">{children}</Box>
        <Box mt={2} display="flex" justifyContent="right" gap={2}>
          {secondaryBtnText && (
            <Button onClick={secondaryBtnClick} variant="outlined">
              {secondaryBtnText}
            </Button>
          )}
          <Button
            // fullWidth
            onClick={primaryBtnClick}
            variant="contained"
            disabled={primaryBtnDisabled}
          >
            {primaryBtnText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;

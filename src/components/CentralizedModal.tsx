import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { CentralizedModalProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';
import { modalStyles } from '@/styles/modalStyles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CentralizedModal: React.FC<CentralizedModalProps> = ({
  title,
  subTitle,
  secondary,
  primary,
  modalOpen = false,
  handlePrimaryButton,
  handleSkipButton,
  icon,
}) => {
  const [open, setOpen] = React.useState(modalOpen);

  React.useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);

  const theme = useTheme<any>();
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles}>
        <Box sx={{ padding: '16px' }}>
          <Box
            sx={{
              fontSize: '22px',
              color: theme.palette.warning['A200'],
              fontWeight: '400',
              textAlign: 'center',
            }}
          >
            {title}
          </Box>
          {icon && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CheckCircleOutlineIcon
                sx={{ color: theme.palette.success.main, fontSize: '33px' }}
              />
            </Box>
          )}
          <Box
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              color: theme,
              textAlign: 'center',
              pt: '12px',
            }}
          >
            {subTitle}
          </Box>
        </Box>
        <Box sx={{ my: 1.2 }}>
          <Divider sx={{ color: theme.palette.warning['A100'] }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            my: 2,
          }}
        >
          {secondary && (
            <Button
              className="one-line-text"
              sx={{
                width: 'auto',
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                color: theme.palette.secondary.main,
                '&:hover': {
                  border: 'none',
                  backgroundColor: 'transparent',
                },
              }}
              variant="outlined"
              color="primary"
              onClick={() => {
                handleClose();
                if (handleSkipButton) {
                  handleSkipButton();
                }
              }}
            >
              {secondary}
            </Button>
          )}
          {primary && (
            <Button
              className="one-line-text"
              sx={{
                width: '151px',
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
              }}
              variant="contained"
              color="primary"
              onClick={handlePrimaryButton}
            >
              {primary}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CentralizedModal;

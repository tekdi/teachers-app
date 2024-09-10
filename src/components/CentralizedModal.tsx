import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { CentralizedModalProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: '#fff',
  boxShadow: 24,
  borderRadius: '16px',
  '@media (min-width: 600px)': {
    width: '350px',
  },
};

const CentralizedModal: React.FC<CentralizedModalProps> = ({
  title,
  subTitle,
  secondary,
  primary,
  modalOpen,
  handlePrimaryButton,
  handleSkipButton,
}) => {
  const [open, setOpen] = React.useState(modalOpen);

  React.useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);
  const theme = useTheme<any>();
  const handleClose = () => setOpen(false);
  const router = useRouter();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
          <Button
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
              handleSkipButton();
            }}
          >
            {secondary}
          </Button>
          <Button
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
        </Box>
      </Box>
    </Modal>
  );
};

export default CentralizedModal;

import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';

interface ConfirmationModalProps {
  message: string;
  handleAction?: () => void;
  buttonNames: ButtonNames;
  handleCloseModal: () => void;
  modalOpen: boolean;
}

interface ButtonNames {
  primary: string;
  secondary: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  modalOpen,
  message,
  handleAction,
  buttonNames,
  handleCloseModal,
}) => {
  const theme = useTheme<any>();

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

  return (
    <Modal
      open={modalOpen}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleCloseModal();
        }
      }}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{ p: 3 }}
          color={theme.palette.warning['300']}
          id="confirmation-modal-title"
        >
          {message}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '18px',
            p: 2,
          }}
        >
          <Button
            sx={{
              border: 'none',
              color: theme.palette.secondary.main,
              fontSize: '14px',
              fontWeight: '500',
              '&:hover': {
                border: 'none',
                backgroundColor: 'transparent',
              },
            }}
            className="one-line-text"
            variant="outlined"
            onClick={handleCloseModal}
          >
            {buttonNames.secondary}
          </Button>
          <Button
            sx={{
              width: 'auto',
              height: '40px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            className="one-line-text"
            variant="contained"
            color="primary"
            onClick={() => {
              if (handleAction !== undefined) {
                handleAction();
                handleCloseModal();
              } else {
                handleCloseModal();
              }
            }}
          >
            {buttonNames.primary}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

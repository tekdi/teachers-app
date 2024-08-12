import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useGeolocation from './useGeolocation';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: GeoLocation) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { getLocation, error } = useGeolocation();

  const handleConfirm = async () => {
    const location = await getLocation(true);
    if (location) {
      onConfirm(location);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Turn on device location</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Device location is needed to mark your attendance.
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              Turn On
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default LocationModal;

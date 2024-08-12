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
import { useTranslation } from 'next-i18next';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: GeolocationPosition) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { getLocation, error } = useGeolocation();
  const { t } = useTranslation();
  const handleConfirm = async () => {
    const location = await getLocation(true);

    if (location !== null) {
      onConfirm(location as unknown as GeolocationPosition); // TypeScript now knows location is not null
    } else {
      console.error('Location could not be retrieved');
      // Handle the null case here, e.g., show an error message to the user
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
          <Typography variant="h6">
            {t('COMMON.TURN_ON_DEVICE_LOCATION')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {'COMMON.DEVICE_LOCATION_NEED_TO_ATTENDANCE'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" onClick={onClose}>
              {(t("COMMON.CANCEL"))}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              {t('COMMON.TURN_ON')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default LocationModal;

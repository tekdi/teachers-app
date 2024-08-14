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
import ConfirmationModal from './ConfirmationModal';

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
    <ConfirmationModal
      message={t('COMMON.DEVICE_LOCATION_NEED_TO_ATTENDANCE')}
      handleAction={handleConfirm}
      buttonNames={{
        primary: t('COMMON.TURN_ON'),
        secondary: t('COMMON.NO_GO_BACK'),
      }}
      handleCloseModal={onClose}
      modalOpen={isOpen}
      error={error ?? ''}
    />
    
  );
};

export default LocationModal;

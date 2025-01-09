import { useTranslation } from 'next-i18next';
import React from 'react';
import ConfirmationModal from '../ConfirmationModal';
import { showToastMessage } from '../Toastify';
import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
}

const DeleteCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
}) => {
  const { t } = useTranslation();

  const handleDeleteButtonClick = () => {
    showToastMessage(t('CENTERS.REQUEST_TO_DELETE_HAS_BEEN_SENT'), 'success');

    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'event-created-successfully',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    handleClose();
  };

  return (
    <ConfirmationModal
      message={t('CENTERS.YOU_ARE_SENDING_REQUEST_TO_THE_STATE_ADMIN')}
      buttonNames={{
        primary: t('CENTERS.SEND_REQUEST'),
        secondary: t('COMMON.CANCEL'),
      }}
      handleCloseModal={handleClose}
      handleAction={() => handleDeleteButtonClick}
      modalOpen={open}
    />
  );
};

export default DeleteCenterModal;

import { useTranslation } from 'next-i18next';
import React from 'react';
import ConfirmationModal from '../ConfirmationModal';
import { showToastMessage } from '../Toastify';

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
    console.log('Delete request sent');
    showToastMessage(t('CENTERS.REQUEST_TO_DELETE_HAS_BEEN_SENT'), 'success');
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

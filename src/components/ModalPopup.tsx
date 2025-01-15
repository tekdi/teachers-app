import { modalStyles } from '@/styles/modalStyles';
import {
  Box,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';

import Modal from '@mui/material/Modal';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const ModalComponent = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme<any>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  
  return (
    <div>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={modalStyles}
          padding={4}
           textAlign= {'center'}
          gap="10px"
          display="flex"
          flexDirection="column"
          borderRadius={'1rem'}
        >
          <Divider />

          <Divider />
        </Box>
      </Modal>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default ModalComponent;

import React from 'react';
import Modal from '@mui/material/Modal';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ProfileField from '@/components/ProfileField';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ModalComponent = () => {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme<any>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? 500 : 400,
    bgcolor: 'warning.A400',
    p: 4,
    textAlign: 'center',
    height: 'auto',
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={style}
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

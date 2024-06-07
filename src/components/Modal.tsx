// import { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';

import ButtonFunctional from './ButtonComponent';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  heading: string;
  SubHeading?: string;
  children?: React.ReactNode;
  btnText: string;
  handleApplySort: () => void;
}

const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  heading,
  SubHeading,
  children,
  btnText,
  handleApplySort,
}) => {
  // const style = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  //   bgcolor: 'background.paper',
  //   boxShadow: 24,
  //   p: 4,
  //   borderRadius: '1rem'
  // };

  const { t } = useTranslation();

  const handleClick = () => {};

  return (
    // <Modal open={open} onClose={onClose}>
    //   <Box sx={style}>
    //     <Box display={'flex'} justifyContent={'space-between'}>
    //       <Typography variant="h4" m={0} fontSize={'16px'} fontWeight={'500'}>
    //         {heading}
    //       </Typography>
    //       <CloseSharpIcon onClick={onClose} aria-label="Close" />
    //     </Box>

    //     <Box>
    //       <Typography variant="h6">{SubHeading}</Typography>

    //       <Box>{children}</Box>
    //     </Box>
    //     <ButtonFunctional buttonName={t('COMMON.APPLY')} />
    //   </Box>
    // </Modal>
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          bgcolor: 'white',
          boxShadow: 24,
          // height: '526px',
          '@media (min-width: 600px)': {
            width: '450px',
          },
          borderRadius: '16px',
        }}
      >
        <Box
          p={'20px 20px 15px'}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontSize="16px" fontWeight="500" m={0}>
            {heading}
          </Typography>
          <CloseSharpIcon
            sx={{
              cursor: 'pointer', // Show pointer cursor on hover
            }}
            onClick={onClose}
            aria-label="Close"
          />
        </Box>
        <Typography variant="h6">{SubHeading}</Typography>
        <Box mt={2}>{children}</Box>
        <Box mt={2} p={'0 20px 20px'} display="flex" justifyContent="flex-end">
          <ButtonFunctional
            handleClickButton={handleApplySort}
            buttonName={t('COMMON.APPLY')}
          />{' '}
          {/* You may use t('COMMON.APPLY') */}
        </Box>
      </Box>
    </Modal>
  );
};

ModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  SubHeading: PropTypes.string,
  btnText: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ModalComponent;

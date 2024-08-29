import { Box, Modal, Typography } from '@mui/material';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonFunctional from './ButtonComponent';

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
  const { t } = useTranslation();

  return (
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
        <Box mt={0.6}>{children}</Box>
        <Box
          mt={2}
          p={'4px 20px 20px'}
          display="flex"
          justifyContent="flex-end"
        >
          <ButtonFunctional
            handleClickButton={handleApplySort}
            buttonName={btnText ?? t('COMMON.APPLY')}
          />{' '}
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

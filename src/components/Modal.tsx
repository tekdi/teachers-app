import { Box, Divider, Modal, Typography } from '@mui/material';

import { modalStyles } from '@/styles/modalStyles';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonFunctional from './ButtonComponent';

import {
  getDayMonthYearFormat,
  shortDateFormat
} from '../utils/Helper';


interface ModalProps {
  open: boolean;
  onClose: () => void;
  heading: string;
  SubHeading?: string;
  children?: React.ReactNode;
  btnText: string;
  handlePrimaryAction: () => void;
  secondaryBtnText?: string;
  handleSecondaryAction?: () => void;
  selectedDate?: Date; // Ensure selectedDate is always a Date if provided
}


const ModalComponent: React.FC<ModalProps> = ({
  open,
  onClose,
  heading,
  SubHeading,
  children,
  btnText,
  handlePrimaryAction,
  selectedDate,
  secondaryBtnText='Back',
  handleSecondaryAction=(()=>{console.log('Button2')}),
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();



  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={modalStyles}
      >
        <Box
          p={'20px 20px 15px'}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontSize="16px" fontWeight="500" m={0}>
              {heading}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                paddingBottom: '10px',
                color: theme.palette.warning['A200'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {selectedDate
                ? getDayMonthYearFormat(shortDateFormat(selectedDate))
                : 'N/A'}
            </Typography>

          </Box>
          <CloseSharpIcon
            sx={{
              cursor: 'pointer', // Show pointer cursor on hover
            }}
            onClick={onClose}
            aria-label="Close"
          />
        </Box>
        <Divider/>
        <Typography variant="h6">{SubHeading}</Typography>
        <Box mt={0.6}>{children}</Box>
        <Divider />

        <Box
          mt={2}
          p={'4px 20px 20px'}
          display="flex"
          justifyContent="flex-end"
          gap={'20px'}
        >
           {secondaryBtnText && handleSecondaryAction && (
            <ButtonFunctional
              handleClickButton={handleSecondaryAction}
              buttonName={secondaryBtnText}
            />
          )}
          <ButtonFunctional
            handleClickButton={handlePrimaryAction}
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
  handlePrimaryAction: PropTypes.func.isRequired,
  children: PropTypes.node,
  secondaryBtnText: PropTypes.string,
  handleSecondaryAction: PropTypes.func,
};

export default ModalComponent;

import {
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    Typography,
  } from '@mui/material';
  import React, { useState } from 'react';
  import { useTheme } from '@mui/material/styles';
  import { useTranslation } from 'next-i18next';
  import CloseIcon from '@mui/icons-material/Close';
  import { showToastMessage } from './Toastify';
  import manageUserStore from '@/store/manageUserStore';
  import { getCohortList } from '@/services/CohortServices';
  
  interface RemoveFacilitatorAlertProps {
    removeCohortNames : string;
    open: boolean;
    onClose: () => void;
  }
  const RemoveFacilitatorAlert: React.FC<RemoveFacilitatorAlertProps> = ({removeCohortNames, open, onClose }) => {
    const { t } = useTranslation();
    const store = manageUserStore();
    const theme = useTheme<any>();
    const style = {
      padding : "20px",
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '85%',
      boxShadow: 24,
      bgcolor: '#fff',
      borderRadius: '16px',
      '@media (min-width: 600px)': {
        width: '450px',
      },
    };
  
    return (
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '18px 16px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {t('COMMON.DELETE_USER')}
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={onClose}
            />
          </Box>
          <Divider />
            <Box mt={1.5}>
              <Typography>
              {t('CENTERS.THE_USER_BELONGS_TO_THE_FOLLOWING_COHORT')} {removeCohortNames}. {t('CENTERS.PLEASE_REMOVE_THE_USER_FROM_COHORT')}
              </Typography>

            </Box>
        </Box>
      </Modal>
    );
  };
  
  export default RemoveFacilitatorAlert;
  
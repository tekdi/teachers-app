import * as React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { modalStyles } from '@/styles/modalStyles';

interface ManageUsersModalProps {
  leanerName: string;
  centerName: string[];
  open: boolean;
  blockName: string;
  onClose: () => void;
}

const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  leanerName,
  centerName,
  blockName,
  open,
  onClose,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
 


  return (
    <div>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            onClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyles}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '20px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '16px',
                }}
                component="h2"
              >
                {leanerName}
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
          <Box sx={{ padding: '0 20px', marginTop: '20px' }}>
            <Box
              className="fs-14 fw-500"
              sx={{ color: theme.palette.warning['400'] }}
            >
              {t('COMMON.CENTERS_ASSIGNED', { block: blockName })}
            </Box>
          </Box>

          <Box
            sx={{
              padding: '0 20px',
              margin: '10px 0 20px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {centerName?.map((name, index) => {
              return (
                <React.Fragment key={index}>
                  <Button
                    sx={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: `1px solid ${theme.palette.warning[900]}`,
                    }}
                    className="text-dark-grey"
                  >
                    {name}
                  </Button>
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageUsersModal;

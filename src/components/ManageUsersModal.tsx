import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

export default function ManageUsersModal() {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    bgcolor: theme.palette.warning['A400'],
    boxShadow: 24,
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                Aditi Patel
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={() => handleClose()}
            />
          </Box>
          <Divider />
          <Box sx={{ padding: '0 20px', marginTop: '20px' }}>
            <Box
              className="fs-14 fw-500"
              sx={{ color: theme.palette.warning['400'] }}
            >
              {t('COMMON.CENTERS_ASSIGNED')}
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
              Bhiwapur
            </Button>
            <Button
              sx={{
                borderBottom: `1px solid ${theme.palette.warning[900]}`,
                padding: '6px, 12px 6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-dark-grey"
            >
              Jabarbodi
            </Button>
            <Button
              sx={{
                borderBottom: `1px solid ${theme.palette.warning[900]}`,
                padding: '6px, 12px 6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-dark-grey"
            >
              Kargaon
            </Button>
            <Button
              sx={{
                borderBottom: `1px solid ${theme.palette.warning[900]}`,
                padding: '6px, 12px 6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-dark-grey"
            >
              Katol
            </Button>
            <Button
              sx={{
                borderBottom: `1px solid ${theme.palette.warning[900]}`,
                padding: '6px, 12px 6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-dark-grey"
            >
              Kondhali
            </Button>
            <Button
              sx={{
                borderBottom: `1px solid ${theme.palette.warning[900]}`,
                padding: '6px, 12px 6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="text-dark-grey"
            >
              Metpanjara
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

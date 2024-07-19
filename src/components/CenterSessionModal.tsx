import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
import { SessionsModalProps } from '@/utils/Interfaces';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const CenterSessionModal: React.FC<SessionsModalProps> = ({
  children,
  open,
  handleClose,
  title,
  primary,
  center,
  date,
  handlePrimaryModel,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: theme?.palette?.warning['A400'],
    boxShadow: 24,
    borderRadius: '16px',
    border: 'none',
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
            sx={{ padding: '18px 16px' }}
          >
            <Box marginBottom={0}>
              <Typography
                variant="h2"
                sx={{
                  color: theme?.palette?.warning['A200'],
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                component="h2"
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: theme?.palette?.warning['A200'],
                    fontSize: '14px',
                    fontWeight: '400',
                  }}
                  component="h2"
                >
                  {center}
                </Typography>
                <CircleIcon
                  sx={{
                    fontSize: '6px',
                    color: theme.palette.secondary.contrastText,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    color: theme?.palette?.warning['A200'],
                    fontSize: '14px',
                    fontWeight: '400',
                  }}
                  component="h2"
                >
                  {date}
                </Typography>
              </Box>
            </Box>
            <CloseIcon
              onClick={handleClose}
              sx={{
                cursor: 'pointer',
                color: theme?.palette?.warning['A200'],
              }}
            />
          </Box>
          <Divider />
          {children}
          {primary && (
            <>
              <Divider />
              <Box sx={{ padding: '20px 16px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    '&.Mui-disabled': {
                      backgroundColor: theme?.palette?.primary?.main,
                    },
                    minWidth: '84px',
                    height: '2.5rem',
                    padding: theme.spacing(1),
                    fontWeight: '500',
                    width: '100%',
                  }}
                  onClick={handlePrimaryModel}
                >
                  {primary}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CenterSessionModal;

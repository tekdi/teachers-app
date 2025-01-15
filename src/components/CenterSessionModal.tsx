import { modalStyles } from '@/styles/modalStyles';
import { toPascalCase } from '@/utils/Helper';
import { SessionsModalProps } from '@/utils/Interfaces';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import React from 'react';

const CenterSessionModal: React.FC<SessionsModalProps> = ({
  children,
  open,
  handleClose,
  title,
  primary,
  center,
  date,
  secondary,
  handlePrimaryModel,
  handleEditModal,
  disable = false,
}) => {
  const theme = useTheme<any>();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    bgcolor: theme?.palette?.warning['A400'],
    boxShadow: 24,
    borderRadius: '16px',
    maxHeight: '626px',
    minheight: '100%',
    border: 'none',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };


  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles} 
        maxHeight =  {'626px'}
         border= {'none'}
      >
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
                {toPascalCase(center)}
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
        <Box
          sx={{
            maxHeight: '49vh',
            minHeight: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {secondary && (
            <Box>
              <Box sx={{ padding: '20px 16px' }}>
                <Button
                  variant="outlined"
                  className="one-line-text"
                  color="primary"
                  sx={{
                    '&.Mui-disabled': {
                      backgroundColor: theme?.palette?.primary?.main,
                    },
                    minWidth: '84px',
                    padding: theme.spacing(1),
                    fontWeight: '500',
                    width: '128px',
                    height: '40px',
                    '@media (max-width: 430px)': {
                      width: '100%',
                    },
                  }}
                  onClick={handlePrimaryModel}
                >
                  {secondary}
                </Button>
              </Box>
            </Box>
          )}
          {primary && (
            <Box sx={{ width: secondary ? 'unset' : '100%' }}>
              <Box sx={{ padding: '20px 16px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  className="one-line-text"
                  sx={{
                    // '&.Mui-disabled': {
                    //   backgroundColor: theme?.palette?.primary?.main,
                    // },
                    minWidth: '84px',
                    padding: theme.spacing(1),
                    fontWeight: '500',
                    width: secondary ? '128px' : '100%',
                    height: '40px',
                    '@media (max-width: 430px)': {
                      width: '100%',
                    },
                  }}
                  onClick={handlePrimaryModel || handleEditModal}
                  disabled={disable}
                >
                  {primary}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CenterSessionModal;

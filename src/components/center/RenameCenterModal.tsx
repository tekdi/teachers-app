import { renameFacilitator } from '@/services/ManageUser';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { showToastMessage } from '../Toastify';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
}

const RenameCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const { cohortId }: any = router.query;

  const [centerName, setCenterName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCenterName(value);

    if (!value.trim()) {
      setError(t('CENTERS.ERROR_EMPTY'));
    } else if (!isNaN(Number(value))) {
      setError(t('CENTERS.ERROR_NUMBER'));
    } else {
      setError('');
    }
  };

  const handleCreateButtonClick = async () => {
    if (error) return;

    console.log('Entered Rename Name:', centerName);

    const name = centerName;

    const response = await renameFacilitator(cohortId, name);

    showToastMessage(t('CENTERS.CENTER_RENAMED'), 'success');
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'white',
            boxShadow: 24,
            maxWidth: 400,
            width: '90%',
            margin: 'auto',
            borderRadius: 3,
            outline: 'none',
            p: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              color={theme?.palette?.text?.primary}
            >
              {t('CENTERS.RENAME_CENTER')}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: theme?.palette?.text?.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, mx: -2 }} />

          <TextField
            fullWidth
            label={t('CENTERS.UNIT_NAME')}
            id="outlined-size-normal"
            sx={{ mb: 1, mt: 2 }}
            value={centerName}
            onChange={handleTextFieldChange}
            error={!!error}
            helperText={error}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t('CENTERS.NOTE')}
          </Typography>
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Button
            variant="outlined"
            onClick={handleCreateButtonClick}
            sx={{
              width: '100%',
              border: 'none',
              backgroundColor: theme?.palette?.primary?.main,
              mb: 2,
            }}
            disabled={!!error || !centerName.trim()}
          >
            {t('CENTERS.RENAME')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RenameCenterModal;

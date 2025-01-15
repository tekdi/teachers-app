import { renameFacilitator } from '@/services/ManageUser';
import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Fade,
  FormHelperText,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { showToastMessage } from '../Toastify';
import { modalStyles } from '@/styles/modalStyles';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: (name: string) => void;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  name?: string;
}

const RenameCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
  reloadState,
  setReloadState,
  name,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const { cohortId }: any = router.query;
  const [centerName, setCenterName] = useState<string>(name ?? '');
  const [error, setError] = useState<boolean>(false);
  const [enableRenameButton, setEnableRenameButton] = useState<boolean>();


  const pattern = /^[a-zA-Z ]*$/;

  React.useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;


    // Validate against the pattern
    if (!pattern.test(value.trim())) {
      setError(true);
    } else {
      setError(false);
    }
    setCenterName(value);
    setEnableRenameButton(true)
  };

  const handleCreateButtonClick = async () => {
    if (error) return;
    try {
      const name = centerName.toLowerCase().trim();
      await renameFacilitator(cohortId, name);
      setReloadState(true);
      showToastMessage(t('CENTERS.CENTER_RENAMED'), 'success');

      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const telemetryInteract = {
        context: {
          env: 'teaching-center',
          cdata: [],
        },
        edata: {
          id: 'rename-center-successfully',
          type: Telemetry.CLICK,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
      telemetryFactory.interact(telemetryInteract);
      handleClose(name);
    } catch (error) {
      const name = centerName.trim();

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          showToastMessage(t('CENTERS.DUPLICATE_CENTER'), 'info');
        }
      }
      handleClose(name);
    }
  }

  return (
    <Modal open={open} onClose={() => handleClose('')} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={modalStyles}
          padding={2}
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
              onClick={() => handleClose('')}
              sx={{ color: theme?.palette?.text?.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, mx: -2 }} />

          <TextField
            required
            fullWidth
            label={t('CENTERS.UNIT_NAME')}
            id="outlined-size-normal"
            sx={{ mb: 1, mt: 2 }}
            value={centerName}
            onChange={handleTextFieldChange}
            error={!!error}
            inputProps={{ pattern: pattern }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {t('CENTERS.NOTE')}
          </Typography>
          {error && (
            <FormHelperText error sx={{ mb: 2 }}>
              {t('FORM_ERROR_MESSAGES.ENTER_VALID_CENTER_NAME')}
            </FormHelperText>
          )}
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Button
  variant="outlined"
  onClick={handleCreateButtonClick}
  sx={{
    width: '100%',
    border: 'none',
    backgroundColor: (!!error || !centerName.trim() || !enableRenameButton)? "#EDEDED" :theme?.palette?.primary?.main,
    mb: 2,
  }}
  disabled={!!error || !centerName.trim() || !enableRenameButton}
>
  {t('CENTERS.RENAME')}
</Button>

        </Box>
      </Fade>
    </Modal>
  );
};

export default RenameCenterModal;

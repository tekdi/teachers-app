import { modalStyles } from '@/styles/modalStyles';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateBlockModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [blockName, setBlockName] = useState<string>('');

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBlockName(event.target.value);
  };

  const handleCreateButtonClick = () => {
    // Log the value entered in TextField

    handleClose();
  };

 

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
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
              {t('BLOCKS.NEW_BLOCK')}
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
            label={t('BLOCKS.BLOCK_NAME')}
            id="outlined-size-normal"
            sx={{ mb: 4, mt: 2 }}
            value={blockName}
            onChange={handleTextFieldChange}
          />
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
          >
            {t('BLOCKS.CREATE')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateBlockModal;

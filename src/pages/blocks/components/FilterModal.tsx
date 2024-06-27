import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Modal,
  Fade,
  Backdrop,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';

interface FilterModalProps {
  open: boolean;
  handleClose: () => void;
  blocks: string[];
  selectedBlocks: string[];
  setSelectedBlocks: (blocks: string[]) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onApply: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  handleClose,
  blocks,
  selectedBlocks,
  setSelectedBlocks,
  sortOrder,
  setSortOrder,
  onApply,
}) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const theme = useTheme<any>();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleBlockToggle = (block: string) => {
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  const filteredBlocks = blocks.filter((block) =>
    block.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleApplyClick = () => {
    onApply();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            maxWidth: 400,
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 5,
            outline: 'none',
             position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography
              color={theme?.palette?.text?.primary}
              variant="h3"
              mt={2}
            >
              {t('BLOCKS.FILTERS')}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Typography fontSize="12px" variant="subtitle1">
            {t('BLOCKS.NAMES')}
          </Typography>
          <RadioGroup
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <FormControlLabel
              sx={{ justifyContent: 'space-between' }}
              value="asc"
              control={
                <Radio
                  sx={{
                    color: '#4D4639',
                    '&.Mui-checked': {
                      color: '#4D4639',
                    },
                  }}
                />
              }
              className="modal_label"
              labelPlacement="start"
              label={t('BLOCKS.A_TO_Z')}
            />
            <FormControlLabel
              sx={{ justifyContent: 'space-between' }}
              value="desc"
              control={
                <Radio
                  sx={{
                    color: '#4D4639',
                    '&.Mui-checked': {
                      color: '#4D4639',
                    },
                  }}
                />
              }
              className="modal_label"
              labelPlacement="start"
              label={t('BLOCKS.Z_TO_A')}
            />
          </RadioGroup>
          <Divider sx={{ mt: 2, mx: -2 }} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApplyClick}
            sx={{ mt: 2 }}
          >
            {t('BLOCKS.APPLY')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FilterModal;

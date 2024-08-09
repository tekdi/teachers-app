import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Modal,
  Fade,
  Divider,
  InputAdornment,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';

type CenterType = '' | 'regular' | 'remote';

interface FilterModalProps {
  open: boolean;
  handleClose: () => void;
  centers: string[];
  selectedCenters: string[];
  setSelectedCenters: (centers: string[]) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  centerType: CenterType;
  setCenterType: (type: CenterType) => void;
  onApply: () => void;
}

const FilterModalCenter: React.FC<FilterModalProps> = ({
  open,
  handleClose,
  centers,
  selectedCenters,
  setSelectedCenters,
  sortOrder,
  setSortOrder,
  centerType,
  setCenterType,
  onApply,
}) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const theme = useTheme<any>();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleCenterToggle = (center: string) => {
    if (selectedCenters?.includes(center)) {
      setSelectedCenters(selectedCenters?.filter((c) => c !== center));
    } else {
      setSelectedCenters([...selectedCenters, center]);
    }
  };

  const filteredCenters = centers?.filter((center) =>
    center?.toLowerCase().includes(searchInput?.toLowerCase())
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
            borderRadius: 3,
            outline: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography
              color={theme?.palette?.text?.primary}
              variant="h3"
              mt={2}
            >
              {t('COMMON.FILTERS')}
            </Typography>
            <IconButton onClick={handleClose} sx={{color: "#4D4639"}}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, mx: -2 }} />
          <Typography fontSize="12px" variant="subtitle1">
            {t('COMMON.NAMES')}
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
              label={t('COMMON.A_TO_Z')}
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
              label={t('COMMON.Z_TO_A')}
            />
          </RadioGroup>
          <Typography fontSize="12px" variant="subtitle1" mt={2} mb={1}>
            {t('CENTERS.CENTER_TYPE')}
          </Typography>
          <RadioGroup
            value={centerType}
            onChange={(e) => setCenterType(e.target.value as CenterType)}
          >
            <FormControlLabel
              sx={{ justifyContent: 'space-between' }}
              value="regular"
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
              label={t('CENTERS.REGULAR')}
            />
            <FormControlLabel
              sx={{ justifyContent: 'space-between' }}
              value="remote"
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
              label={t('CENTERS.REMOTE')}
            />
          </RadioGroup>
          <Divider sx={{ mt: 2, mx: -2 }} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleApplyClick}
            sx={{ mt: 2, mb: 2 }}
          >
            {t('COMMON.APPLY')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FilterModalCenter;

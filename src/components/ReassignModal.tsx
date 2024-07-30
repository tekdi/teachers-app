import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Divider, TextField, Checkbox, InputAdornment, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import useStore from '@/store/store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';


interface ReassignModalProps {
  message: string;
  handleAction?: () => void;
  buttonNames?: ButtonNames;
  handleCloseReassignModal: () => void;
  modalOpen: boolean;
}

interface ButtonNames {
  primary: string;
  secondary: string;
}

const ReassignModal: React.FC<ReassignModalProps> = ({
  modalOpen,
  message,
  handleAction,
  buttonNames,
  handleCloseReassignModal,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const store = useStore();
  const cohorts = store.cohorts;
  const centerList = cohorts.map((cohort: { name: string }) => cohort.name);

  const [searchInput, setSearchInput] = React.useState('');
  const [checkedCenters, setCheckedCenters] = React.useState<string[]>([]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleToggle = (name: string) => {
    setCheckedCenters((prevCheckedCenters) => {
      const currentIndex = prevCheckedCenters.indexOf(name);
      const isCurrentlyChecked = currentIndex !== -1;
      const newChecked = [...prevCheckedCenters];

      if (isCurrentlyChecked) {
        newChecked.splice(currentIndex, 1);
      } else {
        newChecked.push(name);
      }
      return newChecked;
    });
  };

  const filteredCenters = centerList.filter((center: string) =>
    center.toLowerCase().includes(searchInput.toLowerCase())
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '350px',
    },
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseReassignModal}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }} 
          id="confirmation-modal-title"
        >
          <span>{message}</span>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseReassignModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3}}>
          <TextField
          sx={{ 
            backgroundColor: theme.palette.warning['A700'], 
            borderRadius: 8, 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiOutlinedInput-input': {
              borderRadius: 8,
            },
          }}
          placeholder={t('CENTERS.SEARCH_CENTERS')}
            value={searchInput}
            onChange={handleSearchInputChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ p: 3, maxHeight: '300px', overflowY: 'auto' }}>
          {filteredCenters.map((center: string, index: number) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <span>{center}</span>
              <Checkbox
                checked={checkedCenters.includes(center)}
                onChange={() => handleToggle(center)}
              />
            </Box>
          ))}
        </Box>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '18px',
            p: 2,
          }}
        >
          <Button
            sx={{
              width: '100%',
              height: '40px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (handleAction !== undefined) {
                handleAction();
                handleCloseReassignModal();
              } else {
                handleCloseReassignModal();
              }
            }}
          >
            {buttonNames?.primary || 'Re-assign'}
          </Button>
          
        </Box>
      </Box>
    </Modal>
  );
};

export default ReassignModal;

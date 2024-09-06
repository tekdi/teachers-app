import * as React from 'react';
import {
  Box,
  Button,
  Divider,
  TextField,
  Checkbox,
  InputAdornment,
  IconButton,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useStore from '@/store/store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { bulkCreateCohortMembers } from '@/services/CohortServices';
import { showToastMessage } from './Toastify';
import { Status } from '@/utils/app.constant';

interface ReassignModalProps {
  cohortNames?: any;
  message: string;
  handleAction?: () => void;
  buttonNames?: ButtonNames;
  handleCloseReassignModal: () => void;
  modalOpen: boolean;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonNames {
  primary: string;
  secondary: string;
}

interface Cohort {
  id: any;
  cohortId: string;
  name: string;
}

const ReassignModal: React.FC<ReassignModalProps> = ({
  cohortNames,
  modalOpen,
  message,
  handleAction,
  buttonNames,
  handleCloseReassignModal,
  reloadState,
  setReloadState,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const store = useStore();
  const reStore = reassignLearnerStore();
  const cohorts: Cohort[] = store.cohorts.map(
    (cohort: { cohortId: any; name: string }) => ({
      name: cohort.name,
      id: cohort.cohortId,
    })
  );

  const [searchInput, setSearchInput] = useState('');
  const [checkedCenters, setCheckedCenters] = useState<string[]>([]);

  React.useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

  useEffect(() => {
    if (cohortNames) {
      const activeCenters = cohortNames
        .filter((cohort: { status: string }) => cohort.status === Status.ACTIVE)
        .map((cohort: { name: any }) => cohort.name);
      setCheckedCenters(activeCenters);
    }
  }, [cohortNames]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const handleToggle = (name: string) => {
    setCheckedCenters((prev) => {
      const updatedCheckedCenters = prev.includes(name)
        ? prev.filter((center) => center !== name)
        : [...prev, name];

      return updatedCheckedCenters;
    });
  };

  const filteredCenters = cohorts
    .filter((center) =>
      center.name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => {
      const aChecked = checkedCenters.includes(a.name);
      const bChecked = checkedCenters.includes(b.name);
      if (aChecked === bChecked) {
        return 0;
      }
      return aChecked ? -1 : 1;
    });

  const handleReassign = async () => {
    const selectedData = cohorts
      .filter((center) => checkedCenters.includes(center.name))
      .map((center) => center.id);
    const unSelectedData = cohorts
      .filter((center) => !checkedCenters.includes(center.name))
      .map((center) => center.id);

    const payload = {
      userId: [reStore.reassignFacilitatorUserId],
      cohortId: selectedData,
      removeCohortId: unSelectedData,
    };

    try {
      await bulkCreateCohortMembers(payload);
      showToastMessage(
        t('MANAGE_USERS.CENTERS_REQUESTED_SUCCESSFULLY'),
        'success'
      );
      setReloadState(true);
    } catch (error) {
      showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');
    } finally {
      handleCloseReassignModal();
      return;
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '350px',
    },
  };

  return (
    <Modal open={modalOpen} onClose={handleCloseReassignModal}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'black', fontWeight: 400 }}>{message}</span>
          <IconButton
            color="inherit"
            onClick={() => {
              setSearchInput('');
              handleCloseReassignModal();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <TextField
            sx={{
              backgroundColor: theme.palette.warning['A700'],
              borderRadius: 8,
              '& .MuiOutlinedInput-root fieldset': { border: 'none' },
              '& .MuiOutlinedInput-input': { borderRadius: 8 },
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
          {filteredCenters.map((center, index) => (
            <Box key={center.id}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
              >
                <span style={{ color: 'black' }}>{center.name}</span>
                <Checkbox
                  checked={checkedCenters.includes(center.name)}
                  onChange={() => handleToggle(center.name)}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.Mui-checked': {
                      color: 'black',
                    },
                    verticalAlign: 'middle',
                    marginTop: '-10px',
                  }}
                />
              </Box>
              {index < filteredCenters.length - 1 && <Divider sx={{ mb: 2 }} />}
            </Box>
          ))}
        </Box>
        <Divider />
        <Box
          sx={{ display: 'flex', justifyContent: 'center', gap: '18px', p: 2 }}
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
            onClick={handleReassign}
          >
            {buttonNames?.primary || 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReassignModal;

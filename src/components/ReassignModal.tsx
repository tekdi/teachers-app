import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  Divider,
  TextField,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import useStore from '@/store/store';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import { bulkCreateCohortMembers } from '@/services/CohortServices';
import { showToastMessage } from './Toastify';

interface ReassignModalProps {
  cohortNames?: any;
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
  cohortNames,
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
  const centerList = cohorts?.map((cohort: { cohortId: any; name: string }) => ({
    name: cohort.name,
    id: cohort.cohortId,
  }));
  const reStore = reassignLearnerStore();
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedData, setSelectedData] = React.useState<string[]>([]);
  const [unSelectedData, setUnSelectedData] = React.useState<string[]>([]);
  const [checkedCenters, setCheckedCenters] = React.useState<string[]>([]);

  useEffect(() => {
    if (cohortNames) {
      const initialCheckedCenters = cohortNames
        .filter((cohort: { status: string }) => cohort.status === 'active')
        .map((cohort: { name: any }) => cohort.name);
      setCheckedCenters(initialCheckedCenters);
    }
  }, [cohortNames]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

      const checkedCenterIds = centerList
        .filter((center: { name: string }) => newChecked.includes(center.name))
        .map((center: { id: any }) => center.id);
      const uncheckedCenterIds = centerList
        .filter((center: { name: string }) => !newChecked.includes(center.name))
        .map((center: { id: any }) => center.id);

      setSelectedData(checkedCenterIds);
      setUnSelectedData(uncheckedCenterIds);

      return newChecked;
    });
  };

  const filteredCenters = centerList
    .filter((center: { name: string }) =>
      center.name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a: { name: string }, b: { name: string }) => {
      const aChecked = checkedCenters.includes(a.name);
      const bChecked = checkedCenters.includes(b.name);
      if (aChecked === bChecked) {
        return 0;
      }
      return aChecked ? -1 : 1;
    });

  const handleReassign = async () => {
    console.log('USER ID', reStore.reassignFacilitatorUserId);
    console.log('Checked Center IDs:', selectedData);
    console.log('Unchecked Center IDs:', unSelectedData);

    const payload = {
      userId: [reStore?.reassignFacilitatorUserId],
      cohortId: selectedData,
      removeCohortId: unSelectedData,
    };

    try {
      const response = await bulkCreateCohortMembers(payload);
      console.log('Cohort members created successfully', response);
      handleCloseReassignModal();
      showToastMessage(
        t('MANAGE_USERS.CENTERS_REQUESTED_SUCCESSFULLY'),
        'success'
      );
    } catch (error) {
      console.error('Error creating cohort members', error);
      handleCloseReassignModal();
      showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');

    }
  };

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
            alignItems: 'center',
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
        <Box sx={{ p: 3 }}>
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
          {filteredCenters.map(
            (center: { name: string; id: string }, index: number) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <span>{center.name}</span>
                <Checkbox
                  checked={checkedCenters.includes(center.name)}
                  onChange={() => handleToggle(center.name)}
                />
              </Box>
            )
          )}
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
            onClick={handleReassign}
          >
            {buttonNames?.primary || 'Re-assign'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReassignModal;

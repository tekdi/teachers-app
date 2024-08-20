import * as React from 'react';
import {
  Checkbox,
  Divider,
  InputAdornment,
  Radio,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import reassignLearnerStore from '@/store/reassignLearnerStore';

interface ManageUsersModalProps {
  open: boolean;
  onClose: () => void;
  centersName?: string[];
  centers?: { name: string, cohortId: string }[];
  onAssign?: (selectedCenters: string[]) => void;
  isForLearner?: boolean;
}

const ManageCentersModal: React.FC<ManageUsersModalProps> = ({
  centersName = [],
  centers = [],
  open,
  onAssign,
  onClose,
  isForLearner,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [checkedCenters, setCheckedCenters] = React.useState<string[]>([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const setCohortId = reassignLearnerStore((state) => state.setCohortId);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    bgcolor: theme.palette.warning['A400'],
    boxShadow: 24,
    borderRadius: '16px',
    height: 'auto',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  React.useEffect(() => {
    if (centers) {
      setCheckedCenters(centers?.map(center => center?.name));
    }
  }, [centers]);

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

  const handleRadioChange = (name: string, cohortId: string) => {
    setSelectedValue(name);
    setCohortId(cohortId);
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(checkedCenters);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCenters = centers?.filter(center =>
    center?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '20px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '16px',
                }}
                component="h2"
              >
                {t('COMMON.REASSIGN_CENTERS')}
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={onClose}
            />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: '20px' }}>
            <TextField
              className="input_search"
              placeholder={t('CENTERS.SEARCH_CENTERS')}
              color="secondary"
              focused
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                borderRadius: '100px',
                height: '40px',
                width: '100%',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mx={'20px'}>
            <Box sx={{ height: '37vh', mt: '10px', overflowY: 'auto' }}>
              {filteredCenters?.map((center, index) => (
                <React.Fragment key={index}>
                  <Box
                    borderBottom={theme.palette.warning['A100']}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        color: theme.palette.warning['300'],
                        pb: '20px',
                      }}
                    >
                      {center?.name}
                    </Box>
                    <Box>
                      {isForLearner ? (
                        <Radio
                          sx={{ pb: '20px' }}
                          checked={selectedValue === center?.name}
                          onChange={() => handleRadioChange(center?.name, center?.cohortId)}
                          value={selectedValue}
                        />
                      ) : (
                        <Checkbox
                          sx={{ pb: '20px' }}
                          className="checkBox_svg"
                          checked={checkedCenters.includes(center?.name)}
                          onChange={() => handleToggle(center?.name)}
                        />
                      )}
                    </Box>
                  </Box>
                </React.Fragment>
              ))}
            </Box>
          </Box>
          <Divider />
          <Box p={'20px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={handleAssign}
            >
              {t('COMMON.ASSIGN')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageCentersModal;

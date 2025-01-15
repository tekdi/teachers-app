import reassignLearnerStore from '@/store/reassignLearnerStore';
import { toPascalCase } from '@/utils/Helper';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Checkbox,
  Divider,
  InputAdornment,
  Radio,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import NoDataFound from './common/NoDataFound';
import { modalStyles } from '@/styles/modalStyles';

interface ManageUsersModalProps {
  open: boolean;
  onClose: () => void;
  centersName?: string[];
  centers?: { name: string; cohortId: string }[];
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
  const [userClass, setUserClass] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const setCohortId = reassignLearnerStore((state) => state.setCohortId);


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const classData: string | null = localStorage.getItem('className');
      if (classData) {
        setSelectedValue(classData);
        setUserClass(classData);
      }
    }
  }, []);

  React.useEffect(() => {
    if (centers) {
      setCheckedCenters(centers?.map((center) => center?.name));
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
    setSelectedValue(name.toLowerCase());
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

  const filteredCenters = centers
  ?.filter((center) =>
    center?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  )
  ?.sort((a, b) => a.name.localeCompare(b.name));



  return (
    <div>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            onClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyles}>
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
                      {toPascalCase(center?.name)}
                    </Box>
                    <Box>
                      {isForLearner ? (
                        <Radio
                          sx={{ pb: '20px' }}
                          checked={
                            selectedValue === center?.name?.toLowerCase()
                          }
                          onChange={() =>
                            handleRadioChange(center?.name, center?.cohortId)
                          }
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

              {filteredCenters.length === 0 && (
                <NoDataFound title={t('COMMON.NO_CENTER_FOUND')} />
              )}
            </Box>
          </Box>
          <Divider />
          <Box p={'20px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={handleAssign}
              disabled={selectedValue === userClass}
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

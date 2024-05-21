import * as React from 'react';
import Divider from '@mui/material/Divider';


import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup
} from '@mui/material';
import ModalComponent from './Modal';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

interface sortCardProps {
  handleSorting: (sortByName: string, sortByAttendance: string) => void;
  handleCloseModal: () => void;
  isModalOpen: boolean;
}

const SortingModal: React.FC<sortCardProps> = ({
  handleSorting,
  isModalOpen,
  handleCloseModal,
}) => {
  const [sortByName, setSortByName] = React.useState('asc');
  const [sortByAttendance, setSortByAttendance] = React.useState('');
  const { t } = useTranslation();
  const theme = useTheme<any>();

  // handle changes names from sorting
  const handleChangeSort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortByAttendance('');
    if (event.target.value === 'asc' || event.target.value === 'desc') {
      setSortByName(event.target.value);
    } else {
      setSortByAttendance(event.target.value);
    }
  };

  // handle chnage attandance in sorting
  const handleChangeAttendance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendance(event.target.value);
    setSortByName('');
  };

  const handleApplySort = () => {
    handleSorting(sortByName, sortByAttendance);
    handleCloseModal();
  };

  return (
    <ModalComponent
      open={isModalOpen}
      onClose={handleCloseModal}
      heading={t('COMMON.SORT_BY')}
      handleApplySort={handleApplySort}
      btnText={t('COMMON.APPLY')}
    >
      <Divider
        style={{
          backgroundColor: theme.palette.warning['400'],
          marginBottom: '10px',
          marginTop: '15px',
        }}
      />
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel
              style={{ color: theme.palette.warning['400'] }}
              component="legend"
            >
              {t('COMMON.ATTENDANCE')}
            </FormLabel>
            <RadioGroup
              aria-label="sortByAttendance"
              name="sortByAttendance"
              value={sortByAttendance}
              onChange={handleChangeAttendance}
            >
              <FormControlLabel
                labelPlacement="start"
                value="pre"
                control={<Radio sx={{ ml: '80px' }} />}
                label={t('ATTENDANCE.PRESENT')}
              />
              <FormControlLabel
                labelPlacement="start"
                value="abs"
                control={<Radio sx={{ ml: '80px' }} />}
                label={t('ATTENDANCE.ABSENT')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel
              style={{ color: theme.palette.warning['400'] }}
              component="legend"
            >
              {t('COMMON.NAMES')}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              //           name="controlled-radio-buttons-group"
              //           value={sortByName}
              //           onChange={handleChangeSort}
              aria-label="sortByName"
              name="sortByName"
              value={sortByName}
              onChange={handleChangeSort}
            >
              <FormControlLabel
                labelPlacement="start"
                value="asc"
                control={<Radio sx={{ ml: '80px' }} />}
                label={t('COMMON.A_TO_Z')}
              />

              <FormControlLabel
                labelPlacement="start"
                value="desc"
                control={<Radio sx={{ ml: '80px' }} />}
                label={t('COMMON.Z_TO_A')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Divider
        style={{
          backgroundColor: theme.palette.warning['400'],
          marginBottom: '10px',
          marginTop: '15px',
        }}
      />
    </ModalComponent>
  );
};

export default SortingModal;

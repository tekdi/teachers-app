import * as React from 'react';
import ReactGA from 'react-ga4';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material';

import Divider from '@mui/material/Divider';
import ModalComponent from './Modal';
import { Padding } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface sortCardProps {
  handleSorting: (
    sortByName: string,
    sortByAttendance: string,
    sortByClassesMissed: string,
    sortByAttendanceNumber: string
  ) => void;
  handleCloseModal: () => void;
  isModalOpen: boolean;
  routeName: string;
}

const SortingModal: React.FC<sortCardProps> = ({
  handleSorting,
  isModalOpen,
  handleCloseModal,
  routeName,
}) => {
  const [sortByName, setSortByName] = React.useState('');
  const [sortByAttendance, setSortByAttendance] = React.useState('');
  const [sortByClassesMissed, setSortByClassesMissed] = React.useState('');
  const [sortByAttendanceNumber, setSortByAttendanceNumber] =
    React.useState('');
  const { t } = useTranslation();
  const theme = useTheme<any>();

  // handle changes names from sorting
  const handleSortByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortByAttendance('');
    setSortByClassesMissed('');
    setSortByAttendanceNumber('');
    // if (event.target.value === 'asc' || event.target.value === 'desc') {
    setSortByName(event.target.value);
    // }
    //  else {
    //   setSortByAttendance(event.target.value);
    // }
  };

  const handleSortByAttendance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendance(event.target.value);
    setSortByName('');
    setSortByClassesMissed('');
    setSortByAttendanceNumber('');
  };

  const handleSortByAttendanceNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendanceNumber(event.target.value);
    setSortByName('');
    setSortByClassesMissed('');
    setSortByAttendance('');
  };

  const handleSortByClassesMissed = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByClassesMissed(event.target.value);
    setSortByAttendance('');
    setSortByName('');
    setSortByAttendanceNumber('');
  };

  const handleApplySort = () => {
    handleSorting(
      sortByName,
      sortByAttendance,
      sortByClassesMissed,
      sortByAttendanceNumber
    );
    ReactGA.event('sort-by-applied', {
      sortingBasis: [
        sortByName,
        sortByAttendance,
        sortByClassesMissed,
        sortByAttendanceNumber,
      ],
    });
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
          backgroundColor: theme.palette.warning.A100,
        }}
      />
      <Grid container sx={{ padding: '10px 20px 0' }} spacing={2}>
        {routeName == '/attendance-overview' ? (
          <>
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel
                  style={{
                    color: theme.palette.warning['400'],
                  }}
                  className="fs-12 fw-500"
                  component="legend"
                >
                  {t('COMMON.ATTENDANCE')}
                </FormLabel>
                <RadioGroup
                  aria-label="sortByAttendanceNumber"
                  name="sortByAttendanceNumber"
                  value={sortByAttendanceNumber}
                  onChange={handleSortByAttendanceNumber}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value="high"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.HIGH_TO_LOW')}
                    className="modal_label"
                  />
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value="low"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.LOW_TO_HIGH')}
                    className="modal_label"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={1}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel
                  style={{ color: theme.palette.warning['400'] }}
                  component="legend"
                  className="fs-12 fw-500"
                >
                  {t('COMMON.CLASS_MISSED')}
                </FormLabel>
                <RadioGroup
                  aria-label="sortByClassesMissed"
                  name="sortByClassesMissed"
                  value={sortByClassesMissed}
                  onChange={handleSortByClassesMissed}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value="more"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.HIGH_TO_LOW')}
                    className="modal_label"
                  />
                  <FormControlLabel
                    sx={{ justifyContent: 'space-between' }}
                    labelPlacement="start"
                    value="less"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.LOW_TO_HIGH')}
                    className="modal_label"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>{' '}
          </>
        ) : (
          <Grid item xs={12} mt={1}>
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <FormLabel
                style={{ color: theme.palette.warning['400'] }}
                component="legend"
                className="fs-12 fw-500"
              >
                {t('COMMON.ATTENDANCE')}
              </FormLabel>
              <RadioGroup
                aria-label="sortByAttendance"
                name="sortByAttendance"
                value={sortByAttendance}
                onChange={handleSortByAttendance}
              >
                <FormControlLabel
                  labelPlacement="start"
                  sx={{ justifyContent: 'space-between' }}
                  value="pre"
                  control={<Radio sx={{ ml: '80px' }} />}
                  label={t('ATTENDANCE.PRESENT')}
                  className="modal_label"
                />
                <FormControlLabel
                  labelPlacement="start"
                  sx={{ justifyContent: 'space-between' }}
                  value="abs"
                  control={<Radio sx={{ ml: '80px' }} />}
                  label={t('ATTENDANCE.ABSENT')}
                  className="modal_label"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} mt={1}>
          <FormControl component="fieldset" style={{ width: '100%' }}>
            <FormLabel
              style={{ color: theme.palette.warning['400'] }}
              component="legend"
              className="fs-12 fw-500"
            >
              {t('COMMON.NAMES')}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              aria-label="sortByName"
              name="sortByName"
              value={sortByName}
              onChange={handleSortByName}
            >
              <FormControlLabel
                labelPlacement="start"
                sx={{ justifyContent: 'space-between' }}
                value="asc"
                control={<Radio />}
                label={t('COMMON.A_TO_Z')}
                className="modal_label"
              />

              <FormControlLabel
                labelPlacement="start"
                sx={{ justifyContent: 'space-between' }}
                value="desc"
                control={<Radio />}
                label={t('COMMON.Z_TO_A')}
                className="modal_label"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Divider
        style={{
          backgroundColor: theme.palette.warning.A100,
          marginBottom: '10px',
          marginTop: '15px',
        }}
      />
    </ModalComponent>
  );
};

export default SortingModal;

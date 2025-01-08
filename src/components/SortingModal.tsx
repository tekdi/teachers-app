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
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ModalComponent from './Modal';
import { avgLearnerAttendanceLimit, lowLearnerAttendanceLimit } from '../../app.config';
import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';

interface sortCardProps {
  handleSorting?: (
    sortByName: string,
    sortByAttendance: string,
    // sortByClassesMissed: string,
    sortByAttendancePercentage: string,
    sortByAttendanceNumber: string,
    sortByStages: string
  ) => void;
  handleCloseModal: () => void;
  isModalOpen: boolean;
  routeName?: string;
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
  const [sortByAttendancePercentage, setSortByAttendancePercentage] = React.useState('');
  const [sortByAttendanceNumber, setSortByAttendanceNumber] =
    React.useState('');
    const [sortByStages, setSortByStages] = React.useState('');
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const boardStages = [
    { key: 'BOARD_SELECTION', value: 'board' },
    { key: 'SUBJECTS_SELECTION', value: 'subjects' },
    { key: 'REGISTRATION_NUMBER', value: 'registration' },
    { key: 'FEE_PAYMENT', value: 'fee' },
    { key: 'COMPLETED', value: 'completed' },
  ];

  // handle changes names from sorting
  const handleSortByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortByAttendance('');
    setSortByClassesMissed('');
    setSortByAttendancePercentage('')
    setSortByAttendanceNumber('');
    setSortByName(event.target.value);
    setSortByStages('');
  };

  const handleSortByAttendance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendance(event.target.value);
    setSortByName('');
    setSortByClassesMissed('');
    setSortByAttendancePercentage('');
    setSortByAttendanceNumber('');
    setSortByStages('');
  };

  const handleSortByAttendanceNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendanceNumber(event.target.value);
    setSortByName('');
    setSortByClassesMissed('');
    setSortByAttendancePercentage('');
    setSortByAttendance('');
    setSortByStages('');
  };

  // const handleSortByClassesMissed = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setSortByClassesMissed(event.target.value);
  //   setSortByAttendancePercentage('');
  //   setSortByAttendance('');
  //   setSortByName('');
  //   setSortByAttendanceNumber('');
  //   setSortByStages('');
  // };

  const handleSortByAttendancePercentage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByClassesMissed('');
    setSortByAttendancePercentage(event.target.value);
    setSortByAttendance('');
    setSortByName('');
    setSortByAttendanceNumber('');
    setSortByStages('');
  };

  const handleSortByStages = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSortByAttendanceNumber('');
    setSortByName('');
    setSortByClassesMissed('');
    setSortByAttendancePercentage('');
    setSortByAttendance('');
    setSortByName('');
    setSortByStages(event.target.value);
  };

  const handleApplySort = () => {
    if (handleSorting) {
      handleSorting(
        sortByName,
        sortByAttendance,
        // sortByClassesMissed,
        sortByAttendancePercentage,
        sortByAttendanceNumber,
        sortByStages
      );
      ReactGA.event('sort-by-applied', {
        sortingBasis: [
          sortByName,
          sortByAttendance,
          // sortByClassesMissed,
          sortByAttendancePercentage,
          sortByAttendanceNumber,
          sortByStages
        ],
      });
      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split("/")[0];
      const telemetryInteract = {
        context: {
          env: env,
          cdata: [],
        },
        edata: {
          id: 'sort-by-applied',

          type: Telemetry.CLICK,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
      telemetryFactory.interact(telemetryInteract);
    }
    handleCloseModal();
  };

  return (
    <ModalComponent
      open={isModalOpen}
      onClose={handleCloseModal}
      heading={routeName === '/board-enrollment' || '/attendance-overview' ? t('COMMON.FILTERS') : t('COMMON.SORT_BY')}
      handleApplySort={handleApplySort}
      btnText={t('COMMON.APPLY')}
    >
      <Divider
        style={{
          backgroundColor: theme.palette.warning.A100,
        }}
      />
      <Grid container sx={{ padding: '10px 20px 0' }} spacing={2}>
        {routeName === '/attendance-overview' ? (
          <>
            {/* <Grid item xs={12}>
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
            </Grid> */}
            {/* <Grid item xs={12} mt={1}>
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
            </Grid>{' '} */}
             <Grid item xs={12} mt={1}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel
                  style={{ color: theme.palette.warning['400'] }}
                  component="legend"
                  className="fs-12 fw-500"
                >
                  {t('COMMON.FILTER_BY_ATTENDANCE_PERCENTAGE')}
                </FormLabel>
                <RadioGroup
                  aria-label="sortByAttendancePercentage"
                  name="sortByAttendancePercentage"
                  value={sortByAttendancePercentage}
                  onChange={handleSortByAttendancePercentage}
                >
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value="more"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.MORE_THAN', { range: avgLearnerAttendanceLimit })}
                    className="modal_label"
                  />
                  <FormControlLabel
                    sx={{ justifyContent: 'space-between' }}
                    labelPlacement="start"
                    value="between"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.BETWEEN', { 
                      lowerLimit: lowLearnerAttendanceLimit, 
                      upperLimit: avgLearnerAttendanceLimit 
                    })}
                    className="modal_label"
                  />
                  <FormControlLabel
                    sx={{ justifyContent: 'space-between' }}
                    labelPlacement="start"
                    value="less"
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t('COMMON.LESS_THAN', { range: lowLearnerAttendanceLimit })}
                    className="modal_label"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>{' '}
          </>
        ) : null}

        {routeName === '/attendance-history' ? (
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
                aria-labelledby="demo-controlled-radio-buttons-group"
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
        ) : null}
        {routeName !== '/attendance-overview' ?
        (<Grid item xs={12} mt={1}>
          <FormControl component="fieldset" style={{ width: '100%' }}>
            <FormLabel
              style={{ color: theme.palette.warning['400'] }}
              component="legend"
              className="fs-12 fw-500"
            >
               {routeName === '/board-enrollment' ? t('COMMON.SORT_BY_NAMES') : t('COMMON.NAMES')}
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
        </Grid>): null}

        {routeName === '/board-enrollment' ? (
          <Grid item xs={12} mt={1}>
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <FormLabel
                style={{ color: theme.palette.warning['400'] }}
                component="legend"
                className="fs-12 fw-500"
              >
                {t('BOARD_ENROLMENT.FILTER_BY_CURRENT_STAGES')}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                aria-label="sortByStages"
                name="sortByStages"
                value={sortByStages}
                onChange={handleSortByStages}
              >
                {boardStages?.map((option) => (
                  <FormControlLabel
                    key={option.key}
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value={option.value}
                    control={<Radio sx={{ ml: '80px' }} />}
                    label={t(`BOARD_ENROLMENT.${option.key}`)}
                    className="modal_label"
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        ) : null}
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

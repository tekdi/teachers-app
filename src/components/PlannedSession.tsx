import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  TextField,
  styled,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Stack from '@mui/material/Stack';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { sessionMode } from '@/utils/app.constant';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

type mode = (typeof sessionMode)[keyof typeof sessionMode];

const PlannedSession = () => {
  const [mode, setMode] = useState<mode>(sessionMode.OFFLINE);

  const handleSessionModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as mode);
  };

  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54')
  );

  const handleChange = (newValue: Dayjs | null) => {
    setDate(newValue);
  };
  const CustomTimePicker = styled(TimePicker)(({ theme }) => ({
    '& .MuiInputAdornment-root': {
      display: 'none',
    },
  }));

  const { t } = useTranslation();
  const theme = useTheme<any>();

  return (
    <>
      <Box sx={{ padding: '10px 16px' }}>
        <Box>
          <FormControl>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{
                color: theme?.palette?.warning['A200'],
                fontSize: '12px',
                fontWeight: '400',
                marginTop: '10px',
              }}
            >
              {t('CENTER_SESSION.MODE_OF_SESSION')}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={mode}
              onChange={handleSessionModeChange}
            >
              <FormControlLabel
                value={sessionMode.OFFLINE}
                control={
                  <Radio style={{ color: theme?.palette?.warning['300'] }} />
                }
                label={
                  <span
                    style={{
                      color: theme?.palette?.warning['300'],
                      fontSize: '16px',
                    }}
                  >
                    {t('CENTER_SESSION.OFFLINE')}
                  </span>
                }
              />
              <FormControlLabel
                value={sessionMode.ONLINE}
                control={
                  <Radio style={{ color: theme?.palette?.warning['300'] }} />
                }
                label={
                  <span
                    style={{
                      color: theme?.palette?.warning['300'],
                      fontSize: '16px',
                    }}
                  >
                    {t('CENTER_SESSION.ONLINE')}
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel
              style={{ color: theme?.palette?.warning['A200'] }}
              id="demo-simple-select-label"
            >
              {t('CENTER_SESSION.SUBJECT')}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Subject"
              style={{ borderRadius: '4px' }}
            >
              {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
            </Select>
          </FormControl>
        </Box>

        {mode === sessionMode.ONLINE && (
          <>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t('CENTER_SESSION.MEETING_LINK')}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Meeting Link"
                >
                  {/* <MenuItem value={'Link1'}>Link 1</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  {t('CENTER_SESSION.MEETING_PASSCODE')}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Meeting Passcode"
                >
                  {/* <MenuItem value={'Passcode1'}>Passcode 1</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
          </>
        )}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ mt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <CustomTimePicker
                    label="Start Time"
                    value={date}
                    onChange={handleChange}
                    sx={{ borderRadius: '4px', fontSize: '2px' }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ mt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <CustomTimePicker
                    label="End Time"
                    value={date}
                    onChange={handleChange}
                    sx={{ borderRadius: '4px' }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ mt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      label="Start Date"
                      value={date}
                      onChange={handleChange}
                      format="DD MMM, YYYY"
                      sx={{ borderRadius: '4px' }}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ mt: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      label="End Time"
                      value={date}
                      onChange={handleChange}
                      format="DD MMM, YYYY"
                      sx={{ borderRadius: '4px' }}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            mt: 2,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '14px',
              color: theme?.palette?.secondary.main,
              fontWeight: '500',
            }}
          >
            {t('CENTER_SESSION.REMOVE_THIS_SESSION')}
          </Box>
          <DeleteOutlineIcon
            sx={{ fontSize: '18px', color: theme?.palette?.error.main }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Divider />
        </Box>

        <Divider />

        <Box mt={2.5} mb={2}>
          <Button
            sx={{
              border: `1px solid ${theme.palette.error.contrastText}`,
              borderRadius: '100px',
              height: '40px',
              width: '163px',
              color: theme.palette.error.contrastText,
            }}
            className="text-1E"
            endIcon={<AddIcon />}
          >
            {t('COMMON.SCHEDULE_NEW')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PlannedSession;

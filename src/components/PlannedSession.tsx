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
  Typography,
  styled,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { sessionMode, sessionType } from '@/utils/app.constant';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PlannedModalProps } from '@/utils/Interfaces';
import SessionMode from './SessionMode';
import Stack from '@mui/material/Stack';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import WeekDays from './WeekDays';

type mode = (typeof sessionMode)[keyof typeof sessionMode];
type type = (typeof sessionType)[keyof typeof sessionType];

interface Session {
  id?: number | string;
  selectedWeekDays?: string[];
}

const PlannedSession: React.FC<PlannedModalProps> = ({
  removeModal,
  clickedBox,
}) => {
  const [mode, setMode] = useState<mode>(sessionMode.OFFLINE);
  const [type, setType] = useState<type>(sessionType.REPEATING);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>();
  const [sessionBlocks, setSessionBlocks] = useState<Session[]>([
    { id: 0, selectedWeekDays: [] },
  ]);
  const handleSessionModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setMode(event.target.value as mode);
  };
  const handleSessionTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value as type);
    console.log(event.target.value);
  };

  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54')
  );

  const handleChange = (newValue: Dayjs | null) => {
    console.log(newValue);
    setDate(newValue);
  };
  const CustomTimePicker = styled(TimePicker)(({ theme }) => ({
    '& .MuiInputAdornment-root': {
      display: 'none',
    },
  }));

  const handleLinkChange = (event: any) => {
    console.log(event.target.value);
  };
  // const handleTimeChange = (event: any) => {
  //   console.log(event.target.value);
  // };
  const handlePasscodeChange = (event: any) => {
    console.log(event.target.value);
  };

  const { t } = useTranslation();
  const theme = useTheme<any>();

  const handleSelectionChange = (
    id: string | number | undefined,
    newSelectedDays: string[]
  ) => {
    if (id) {
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === id
            ? { ...block, selectedWeekDays: newSelectedDays }
            : block
        )
      );
    }
  };

  const handleAddSession = () => {
    setSessionBlocks([
      ...sessionBlocks,
      { id: sessionBlocks.length, selectedWeekDays: [] },
    ]);
  };

  const handleRemoveSession = (id: any) => {
    setSessionBlocks(sessionBlocks.filter((block) => block?.id !== id));
  };

  return (
    <Box overflow={'auto'}>
      {sessionBlocks.map((block, index) => (
        <Box sx={{ padding: '10px 16px' }}>
          <Box>
            <SessionMode
              mode={mode}
              handleSessionModeChange={handleSessionModeChange}
              sessions={{
                tile: t('CENTER_SESSION.MODE_OF_SESSION'),
                mode1: t('CENTER_SESSION.ONLINE'),
                mode2: t('CENTER_SESSION.OFFLINE'),
              }}
            />
          </Box>
          {clickedBox === 'PLANNED_SESSION' && (
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
                  label={t('CENTER_SESSION.SUBJECT')}
                  style={{ borderRadius: '4px' }}
                >
                  {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
          )}

          {mode === sessionMode.ONLINE && (
            <>
              {clickedBox === 'EXTRA_SESSION' && (
                <>
                  <Box
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme?.palette?.warning['300'],
                      mt: 1.5,
                    }}
                  >
                    {t('CENTER_SESSION.SET_UP')}
                  </Box>
                </>
              )}
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.MEETING_LINK')}
                  variant="outlined"
                  onChange={handleLinkChange}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.MEETING_PASSCODE')}
                  variant="outlined"
                  onChange={handlePasscodeChange}
                />
              </Box>
            </>
          )}
          {clickedBox === 'EXTRA_SESSION' && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['300'],
                }}
              >
                {t('CENTER_SESSION.SESSION_DETAILS')}
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{
                      color: theme?.palette?.warning['A200'],
                      background: theme?.palette?.warning['A400'],
                      paddingLeft: '2px',
                      paddingRight: '2px',
                    }}
                    id="demo-simple-select-label"
                  >
                    {t('CENTER_SESSION.SUBJECT_OPTIONAL')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={t('CENTER_SESSION.SUBJECT_OPTIONAL')}
                    style={{ borderRadius: '4px' }}
                  >
                    {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.SESSION_TITLE')}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}

          {clickedBox === 'EXTRA_SESSION' && (
            <>
              <Box sx={{ mt: 2 }}>
                <SessionMode
                  mode={type}
                  handleSessionModeChange={handleSessionTypeChange}
                  sessions={{
                    tile: t('CENTER_SESSION.TYPE_OF_SESSION'),
                    mode1: t('CENTER_SESSION.REPEATING'),
                    mode2: t('CENTER_SESSION.JUST_ONCE'),
                  }}
                />
                {type === sessionType.JUST && (
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label="Date"
                          value={date}
                          onChange={handleChange}
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Box>
                )}
              </Box>
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                <Box sx={{ mt: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CustomTimePicker
                      label={t('CENTER_SESSION.START_TIME')}
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
                      label={t('CENTER_SESSION.END_TIME')}
                      value={date}
                      onChange={handleChange}
                      sx={{ borderRadius: '4px' }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {type !== sessionType.JUST && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ overflow: 'none' }}>
                <Typography variant="h2" component="h2">
                  {t('COMMON.HELD_EVERY_WEEK_ON', {
                    days: block?.selectedWeekDays?.join(', '),
                  })}
                </Typography>
                <WeekDays
                  useAbbreviation={true}
                  selectedDays={block?.selectedWeekDays}
                  onSelectionChange={(newSelectedDays) => {
                    handleSelectionChange(block?.id, newSelectedDays);
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label={t('CENTER_SESSION.START_DATE')}
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
                          label={t('CENTER_SESSION.END_DATE')}
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
          )}
          {sessionBlocks.length > 1 && (
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
                  cursor: 'pointer',
                }}
                onClick={() => handleRemoveSession(block.id)}
              >
                {t('CENTER_SESSION.REMOVE_THIS_SESSION')}
              </Box>
              <DeleteOutlineIcon
                sx={{ fontSize: '18px', color: theme?.palette?.error.main }}
              />
            </Box>
          )}
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
              onClick={handleAddSession}
            >
              {t('CENTER_SESSION.ADD_SESSION')}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PlannedSession;

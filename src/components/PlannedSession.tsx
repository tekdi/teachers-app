import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { sessionModeConstant } from '@/utils/app.constant';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

type SessionMode =
  (typeof sessionModeConstant)[keyof typeof sessionModeConstant];

const PlannedSession = () => {
  const [sessionMode, setSessionMode] = useState<SessionMode>(
    sessionModeConstant.OFFLINE
  );

  const handleSessionModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSessionMode(event.target.value as SessionMode);
  };

  const { t } = useTranslation();
  const theme = useTheme<any>();

  return (
    <>
      <Box sx={{ padding: '10px 16px' }}>
        <Box>
          <FormControl>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ color: theme?.palette?.warning['300'] }}
            >
              {t('CENTER_SESSION.MODE_OF_SESSION')}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={sessionMode}
              onChange={handleSessionModeChange}
            >
              <FormControlLabel
                value={sessionModeConstant.OFFLINE}
                control={
                  <Radio style={{ color: theme?.palette?.warning['300'] }} />
                }
                label={
                  <span style={{ color: theme?.palette?.warning['300'] }}>
                    {t('CENTER_SESSION.OFFLINE')}
                  </span>
                }
              />
              <FormControlLabel
                value={sessionModeConstant.ONLINE}
                control={
                  <Radio style={{ color: theme?.palette?.warning['300'] }} />
                }
                label={
                  <span style={{ color: theme?.palette?.warning['300'] }}>
                    {t('CENTER_SESSION.ONLINE')}
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {t('CENTER_SESSION.SUBJECT')}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Subject"
            >
              {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
            </Select>
          </FormControl>
        </Box>

        {sessionMode === sessionModeConstant.ONLINE && (
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
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t('CENTER_SESSION.START_TIME')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Start Time"
                  >
                    {/* <MenuItem value={'Time1'}>Time 1</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box sx={{ my: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t('CENTER_SESSION.END_TIME')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="End Time"
                  >
                    {/* <MenuItem value={'Time2'}>Time 2</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t('CENTER_SESSION.START_DATE')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Start Date"
                  >
                    {/* <MenuItem value={'Date1'}>Date 1</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t('CENTER_SESSION.END_DATE')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="End Date"
                  >
                    {/* <MenuItem value={'Date2'}>Date 2</MenuItem> */}
                  </Select>
                </FormControl>
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

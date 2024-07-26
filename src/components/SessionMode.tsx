import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import React from 'react';
import { SessionModeProps } from '../utils/Interfaces';
import { sessionMode } from '@/utils/app.constant';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const SessionMode: React.FC<SessionModeProps> = ({
  handleSessionModeChange,
  mode,
  sessions,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  console.log('SessionMode Rendered with mode:', mode);

  return (
    <FormControl>
      <FormLabel
        id="session-mode-label"
        style={{
          color: theme?.palette?.warning['A200'],
          fontSize: '12px',
          fontWeight: '400',
          marginTop: '10px',
        }}
      >
        {sessions.tile}
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="session-mode-label"
        name="session-mode-group"
        value={mode}
        onChange={handleSessionModeChange}
      >
        <FormControlLabel
          value={sessions.mode2}
          control={<Radio style={{ color: theme?.palette?.warning['300'] }} />}
          label={
            <span
              style={{
                color: theme?.palette?.warning['300'],
                fontSize: '16px',
              }}
            >
              {sessions.mode2}
            </span>
          }
        />
        <FormControlLabel
          value={sessions.mode1}
          control={<Radio style={{ color: theme?.palette?.warning['300'] }} />}
          label={
            <span
              style={{
                color: theme?.palette?.warning['300'],
                fontSize: '16px',
              }}
            >
              {sessions.mode1}
            </span>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default SessionMode;

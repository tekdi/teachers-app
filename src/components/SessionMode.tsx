import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { SessionModeProps } from '../utils/Interfaces';
import { CenterType } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';

const SessionMode: React.FC<SessionModeProps> = ({
  handleSessionModeChange,
  mode,
  sessions,
  disabled,
  cohortType,
}) => {
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
          control={
            <Radio
              style={{
                color:
                  cohortType === CenterType.REMOTE || disabled
                    ? theme?.palette?.warning['400']
                    : theme?.palette?.warning['300'],
              }}
              disabled={cohortType === CenterType.REMOTE || disabled}
            />
          }
          label={
            <span
              style={{
                color:
                  cohortType === CenterType.REMOTE || disabled
                    ? theme?.palette?.warning['400']
                    : theme?.palette?.warning['300'],
                fontSize: '16px',
              }}
            >
              {toPascalCase(sessions.mode2)}
            </span>
          }
        />
        <FormControlLabel
          value={sessions.mode1}
          control={
            <Radio
              style={{
                color: disabled
                  ? theme?.palette?.warning['400']
                  : theme?.palette?.warning['300'],
              }}
              disabled={disabled}
            />
          }
          label={
            <span
              style={{
                color: disabled
                  ? theme?.palette?.warning['400']
                  : theme?.palette?.warning['300'],
                fontSize: '16px',
              }}
            >
              {toPascalCase(sessions.mode1)}
            </span>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default SessionMode;

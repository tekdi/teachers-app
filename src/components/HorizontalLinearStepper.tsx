import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useTheme } from '@mui/material/styles';
import { HorizontalLinearStepperProps } from '@/utils/Interfaces';
import { useTranslation } from 'react-i18next';

const steps: string[] = ['Board', 'Subjects', 'Registration', 'Fees'];

export default function HorizontalLinearStepper({
  activeStep,
}: HorizontalLinearStepperProps) {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const CustomStepIcon = (props: any) => {
    const { icon, active, completed } = props;

    if (completed) {
      return <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />;
    } else if (active) {
      return (
        <RadioButtonCheckedIcon sx={{ color: theme.palette.primary.main }} />
      );
    } else {
      return <RadioButtonUncheckedIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StepConnector />}
        sx={{
          justifyContent: 'space-between',
          '& .MuiStepLabel-alternativeLabel': {
            marginTop: '2px !important',
          },
          '& .MuiStep-root': {
            flex: '1',
            padding: 0,
          },
          '& .MuiStepConnector-root': {
            top: '16px',
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={index} completed={index < activeStep}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                '& .MuiStepLabel-label': {
                  marginBottom: '3px',
                  alignSelf: 'center',
                  fontSize: '11px',
                },
                '& .MuiStepLabel-iconContainer': {
                  alignItems: 'center',
                },
                fontSize: '11px !important',
                '& .MuiStepLabel-alternativeLabel': {
                  marginTop: '2px',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

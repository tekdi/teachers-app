import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector from '@mui/material/StepConnector';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
const steps: string[] = ['Board', 'Subjects', 'Registration'];

export default function HorizontalLinearStepper({activeStep}) {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  

  const CustomStepIcon = (props: any) => {
    const { icon, active, completed } = props;

    if (completed) {
      return <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />;
    } else if (active) {
      return <RadioButtonCheckedIcon sx={{ color: theme.palette.primary.main }} />;
    } else {
      return <RadioButtonUncheckedIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} connector={<StepConnector />}>
        {steps.map((label, index) => (
          <Step key={index} completed={index < activeStep}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                '& .MuiStepLabel-label': {
                  marginBottom: '3px',
                  alignSelf: 'center',
                  fontSize: '11px'
                },
                '& .MuiStepLabel-iconContainer': {
                  alignItems: 'center',
                },
                fontSize: '11px !important'
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

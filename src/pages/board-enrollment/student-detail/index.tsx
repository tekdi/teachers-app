import Header from '@/components/Header';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { logEvent } from '@/utils/googleAnalytics';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import HorizontalLinearStepper from '@/components/HorizontalLinearStepper';

const BoardEnrollmentDetail = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [checked, setChecked] = React.useState([false, false]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep < 2) {
        return prevActiveStep + 1;
      } else {
        return prevActiveStep;
      }
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep > 0) {
        return prevActiveStep - 1;
      } else {
        return prevActiveStep;
      }
    });
  };

  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked([isChecked, isChecked]);
  };

  const handleChildChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedChecked = [...checked];
      updatedChecked[index] = event.target.checked;
      setChecked(updatedChecked);
    };
  return (
    <>
      <Box>
        <Header />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            color: theme.palette.warning['A200'],
            padding: '15px 20px 5px',
          }}
          width={'100%'}
        >
          <KeyboardBackspaceOutlinedIcon
            onClick={handleBackEvent}
            cursor={'pointer'}
            sx={{ color: theme.palette.warning['A200'], marginTop: '18px' }}
          />
          <Box my={'1rem'} ml={'0.5rem'}>
            <Typography
              color={theme.palette.warning['A200']}
              textAlign={'left'}
              fontSize={'22px'}
              fontWeight={400}
            >
              Student Name {/*will come from Api */}
            </Typography>
            <Typography
              color={theme.palette.warning['A200']}
              textAlign={'left'}
              fontSize={'11px'}
              fontWeight={500}
            >
              Khapari Dharmu (Chimur, Chandrapur) {/*will come from Api */}
            </Typography>
          </Box>
        </Box>

        <Box px={'16px'}>
          <HorizontalLinearStepper activeStep={activeStep} />
        </Box>
        <Box
          sx={{
            border: '1px solid #D0C5B4',
            borderRadius: '16px',
            padding: '16px',
            mt: 3,
          }}
          mx={'16px'}
        >
          <Box>
            <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#969088' }}>
              Choose which Board the Learner is going to be enrolled in
            </Box>

            {activeStep === 0 && (
              <>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      pb: '15px',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #D0C5B4',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#1F1B13',
                      }}
                    >
                      ICSE
                    </Box>
                    <Radio
                      checked={selectedValue === 'a'}
                      onChange={handleChange}
                      value="a"
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'A' }}
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      pb: '15px',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #D0C5B4',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#1F1B13',
                      }}
                    >
                      CBSE
                    </Box>
                    <Radio
                      checked={selectedValue === 'b'}
                      onChange={handleChange}
                      value="b"
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'B' }}
                    />
                  </Box>
                </Box>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Box
                  sx={{
                    py: '10px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                >
                  <FormControlLabel
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row-reverse',
                      ml: 0,
                      mr: 0,
                      color: '#1F1B13'
                    }}
                    label="Parent"
                    control={
                      <Checkbox
                        checked={checked.every(Boolean)}
                        indeterminate={checked[0] !== checked[1]}
                        onChange={handleParentChange}
                        sx={{
                          color: '#1F1B13',
                          '&.Mui-checked': {
                            color: '#1F1B13',
                          },
                        }}
                      />
                    }
                  />
                </Box>
                <Box
                  sx={{
                    py: '10px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                >
                  <FormControlLabel
                    label="Mathematics"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row-reverse',
                      ml: 0,
                      mr: 0,
                      color: '#1F1B13'
                    }}
                    control={
                      <Checkbox
                        checked={checked[0]}
                        onChange={handleChildChange(0)}
                        sx={{
                          color: '#1F1B13',
                          '&.Mui-checked': {
                            color: '#1F1B13',
                          },
                        }}
                      />
                    }
                  />
                </Box>
                <Box
                  sx={{
                    py: '10px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                >
                  <FormControlLabel
                    label="Science"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row-reverse',
                      ml: 0,
                      mr: 0,
                      color: '#1F1B13'
                    }}
                    control={
                      <Checkbox
                        checked={checked[1]}
                        onChange={handleChildChange(1)}
                        sx={{
                          color: '#1F1B13',
                          '&.Mui-checked': {
                            color: '#1F1B13',
                          },
                        }}
                      />
                    }
                  />
                </Box>
              </>
            )}
          </Box>

          {activeStep === 2 && (
            <>

              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{ color: theme?.palette?.warning['A200'] }}
                    id="demo-simple-select-label"
                  >
                    Board Enrolment Number
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={'Board Enrolment Number'}
                    style={{ borderRadius: '4px' }}

                    value={'Board Enrolment Number'}
                  >

                    <MenuItem key="other" value="other">
                      {t('FORM.OTHER')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mt={2} sx={{ borderBottom: '1px solid #D0C5B4', pb: '10px' }}>
                <FormControl>
                  <FormLabel sx={{ fontSize: '12px', fontWeight: '400', color: '#4D4639' }} id="demo-row-radio-buttons-group-label">
                    Exam Fees Paid? (optional)
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      sx={{ color: '#1F1B13' }}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      sx={{ color: '#1F1B13' }}
                    />
                  </RadioGroup>
                </FormControl>

              </Box>


            </>
          )}

          {/* Button starts form here  */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                color: theme.palette.secondary.main,
                fontSize: '14px',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                border: '1px solid #1D1B201F',
                mt: '15px',
                width: '144px',
              }}
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              sx={{
                width: '144px',
                height: '40px',
                fontSize: '14px',
                fontWeight: '500',
                mt: '15px',
              }}
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Save & Next
            </Button>
          </Box>
          {/* Button end here  */}
        </Box>
      </Box>
      <Box
        sx={{
          color: '#7C766F',
          fontWeight: 500,
          fontSize: '12px',
          marginTop: 2,
          px: '16px',
        }}
      >
        “Save & Next” to save your progress. You can come back and change it
        anytime.
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default BoardEnrollmentDetail;

import React, { useState } from 'react';
import Header from '@/components/Header';
import { logEvent } from '@/utils/googleAnalytics';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

const CoursePlannerDetail = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // State to manage the expanded state of the accordions
  const [expanded, setExpanded] = useState<string | false>(false);
  const [allExpanded, setAllExpanded] = useState(false); // New state to track all accordions

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (!allExpanded) {
        setExpanded(isExpanded ? panel : false);
      }
    };

  const toggleAllAccordions = () => {
    if (allExpanded) {
      setExpanded(false);
    } else {
      setExpanded('panel1');
    }
    setAllExpanded(!allExpanded);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: theme.palette.warning['A200'],
          padding: '15px 16px 5px',
          gap: '15px',
        }}
        width={'100%'}
      >
        <KeyboardBackspaceOutlinedIcon
          onClick={handleBackEvent}
          cursor={'pointer'}
          sx={{ color: theme.palette.warning['A200'] }}
        />
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Box sx={{ width: '40px', height: '40px' }}>
                <CircularProgressbar
                  value={10}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: '#06A816',
                    trailColor: '#E6E6E6',
                    strokeLinecap: 'round',
                  })}
                />
              </Box>

              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontSize: '11px',
                    color: theme.palette.warning['300'],
                    fontWeight: '500',
                  }}
                >
                  10%
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                fontSize: '16px',
                color: theme.palette.warning['300'],
              }}
            >
              Mathematics {/*  will come from API */}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* <Box mt={3} px={'16px'}>
        <Box>calender UI will came here  </Box>
      </Box> */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          pr: '16px',
          alignItems: 'center',
        }}
        mt={2}
      >
        <Box
          sx={{
            fontSize: '12px',
            fontWeight: '500',
            color: theme.palette.warning['300'],
            cursor: 'pointer',
          }}
          onClick={toggleAllAccordions}
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </Box>
        <ArrowDropUpIcon
          sx={{
            transform: allExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: theme.palette.warning['300'],
          }}
        />
      </Box>
      <Box mt={2}>
        <Box
          sx={{
            borderRadius: '8px',
          }}
        >
          <Accordion
            expanded={expanded === 'panel1' || allExpanded}
            onChange={handleAccordionChange('panel1')}
            sx={{
              boxShadow: 'none',
              background: '#F1E7D9',
              border: 'none',
            }}
          >
            <AccordionSummary
              expandIcon={
                <ArrowDropUpIcon
                  sx={{
                    color: theme.palette.warning['300'],
                  }}
                />
              }
              aria-controls="panel1-content"
              id="panel1-header"
              className="accordion-summary"
              sx={{
                px: '16px',
                m: 0,
                '&.Mui-expanded': {
                  minHeight: '48px',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  pr: '5px',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <RadioButtonUncheckedIcon sx={{ fontSize: '15px' }} />
                  <Typography
                    fontWeight="500"
                    fontSize="14px"
                    color={theme.palette.warning['300']}
                  >
                    Topic 1 - Real Numbers {/* will came from API */}
                  </Typography>
                </Box>
                <Typography fontWeight="600" fontSize="12px" color="#7C766F">
                  Jan, Feb {/* will came from API */}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0' }}>
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                }}
              >
                <Box
                  sx={{
                    py: '10px',
                    px: '16px',
                    background: theme.palette.warning['A400'],
                    pt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: '400',
                        color: theme.palette.warning['300'],
                      }}
                    >
                      The Fundamental Theorem of Arithmetic{' '}
                      {/* will came from API */}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          padding: '5px',
                          background: '  #C1D6FF',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#4D4639',
                          borderRadius: '8px',
                        }}
                      >
                        JAN
                      </Box>
                      <CheckCircleOutlineIcon sx={{ fontSize: '20px' }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      mt: 0.8,
                    }}
                  >
                    <Box sx={{ fontSize: '12px', fontWeight: '500' }}>
                      5 {t('COURSE_PLANNER.RESOURCES')}
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                }}
              >
                <Box
                  sx={{
                    py: '10px',
                    px: '16px',
                    background: theme.palette.warning['A400'],
                    pt: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '16px',
                        fontWeight: '400',
                        color: theme.palette.warning['300'],
                      }}
                    >
                      Irrational Numbers
                      {/* will came from API */}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          padding: '5px',
                          background: '  #C1D6FF',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#4D4639',
                          borderRadius: '8px',
                        }}
                      >
                        JAN
                      </Box>
                      <CheckCircleOutlineIcon sx={{ fontSize: '20px' }} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      mt: 0.8,
                    }}
                  >
                    <Box sx={{ fontSize: '12px', fontWeight: '500' }}>
                      2 {t('COURSE_PLANNER.RESOURCES')}
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default CoursePlannerDetail;

import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRouter } from 'next/router';
import RemoveIcon from '@mui/icons-material/Remove';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { learnerAssessmentReport } from '@/services/UpdateAssesmentService';

interface AssessmentReportProp{
    isTitleRequired?: boolean
}

const AssessmentReport: React.FC<AssessmentReportProp> = ({ isTitleRequired }) => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();

  const [assessmentList, setAssessmentList] = React.useState([]);

  useEffect(() => {
    const res: any = learnerAssessmentReport();
    setAssessmentList(res);
  }, []);

  const handleAssessmentDetails = (userId: string) => {
    router.push(`${router.pathname}/user/${userId}`);
  };

  return (
    <Box sx={{ background: isTitleRequired?'#ffffff': '#FBF4E4', padding: isTitleRequired? '0px': '20px' }}>
        {isTitleRequired ? (
          <Typography
            sx={{
              color: theme.palette.warning['A200'],
              fontWeight: 600,
              fontSize: '16px',
              pb: '0.75rem'
            }}
            variant="h5"
            gutterBottom
          >
            {t('COMMON.ASSESSMENT_REPORT')}
          </Typography>
        ) : null}
        <Grid container spacing={2}>
          {assessmentList.map((assessment: any) => (
            <Grid item xs={12} sm={6} md={4} key={assessment.userId}>
              <Box
                sx={{
                  border: `1px solid ${theme?.palette?.warning['A100']}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderRadius: '8px',
                  gap: '5px',
                }}
                // onClick={() => handleAssessmentDetails(assessment.userId)}
              >
                <Box
                  sx={{
                    flexBasis: '20%',
                    background: theme?.palette?.primary?.light,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '7px',
                  }}
                >
                  {/* Todo : replaced with proper flag coming from backend  */}
                  {assessment.progress === 'Overall score :' ? (
                    <CheckCircleIcon
                      sx={{ color: theme.palette.warning[300] }}
                    />
                  ) : assessment.progress === 'Not Started' ? (
                    <RemoveIcon sx={{ color: theme.palette.warning[300] }} />
                  ) : assessment.progress === 'In Progress' ? (
                    <RadioButtonUncheckedIcon
                      sx={{ color: theme.palette.warning[300] }}
                    />
                  ) : null}
                </Box>
                <Box sx={{ flexBasis: '80%' }}>
                  <Box
                    sx={{
                      px: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '7px',
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          color: theme.palette.warning[300],
                          fontSize: '16px',
                          fontWeight: '400',
                        }}
                      >
                        {assessment.studentName}
                      </Box>
                      <Box
                        sx={{
                          gap: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            color: theme.palette.warning[300],
                            fontSize: '14px',
                            fontWeight: '500',
                            py: '2px',
                          }}
                        >
                          {assessment.progress}
                        </Box>
                        {assessment.progress === 'Overall score :' && (
                          <Box
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            {assessment.score}%
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <KeyboardArrowRightIcon
                      sx={{ color: theme.palette.warning[300] }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default AssessmentReport;

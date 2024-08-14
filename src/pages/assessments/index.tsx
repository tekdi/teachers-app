import Header from '@/components/Header';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import SortingModal from '@/components/SortingModal';
import { useRouter } from 'next/router';
import RemoveIcon from '@mui/icons-material/Remove';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { updateAssessment } from '@/services/UpdateAssesmentService';

const Assessments = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [assessmentList, setAssessmentList] = React.useState([]);

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 70, behavior: 'smooth' });
    }
  };

  // open modal of sort
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const res: any = updateAssessment();
    setAssessmentList(res);
  }, []);

  const handleAssessmentDetails = (userId: string) => {
    router.push(`${router.pathname}/user/${userId}`);
  };

  return (
    <>
      <Box>
        <Header />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: theme?.palette?.warning['A200'],
          padding: '20px 20px 5px',
        }}
        width="100%"
      >
        <Typography textAlign="left" fontSize="22px">
          {t('ASSESSMENTS.ASSESSMENTS')}
        </Typography>
      </Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <Paper
              component="form"
              className="100"
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '100px',
                background: theme.palette.warning.A700,
                boxShadow: 'none',
              }}
            >
              <InputBase
                ref={inputRef}
                sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                placeholder="Search.."
                inputProps={{ 'aria-label': t('ASSESSMENTS.SEARCH_STUDENT') }}
                onClick={handleScrollDown}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
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
                {t('ASSESSMENTS.CENTER')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('ASSESSMENTS.CENTER')}
                style={{ borderRadius: '4px' }}
              >
                {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px' }}>
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
                {t('ASSESSMENTS.ASSESSMENT_TYPE')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t('ASSESSMENTS.ASSESSMENT_TYPE')}
                style={{ borderRadius: '4px' }}
              >
                {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid
        sx={{
          mt: 2,
          px: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
        container
      >
        <Grid
          xs={8}
          item
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            color: theme?.palette?.warning['400'],
          }}
        >
          20/24 {t('ASSESSMENTS.COMPLETED_THE_ASSESSMENT')}
        </Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={4} item>
          <Button
            onClick={handleOpenModal}
            sx={{
              color: theme.palette.warning.A200,

              borderRadius: '10px',
              fontSize: '14px',
            }}
            endIcon={<ArrowDropDownSharpIcon />}
            size="small"
            variant="outlined"
          >
            {t('COMMON.SORT_BY').length > 7
              ? `${t('COMMON.SORT_BY').substring(0, 6)}...`
              : t('COMMON.SORT_BY')}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ background: '#FBF4E4', padding: '20px' }}>
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
                  background: theme.palette.warning['A400']
                }}
                onClick={() => handleAssessmentDetails(assessment.userId)}
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
      <SortingModal
        isModalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
      // handleSorting={handleSorting}
      // routeName={pathname}
      />
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

export default Assessments;

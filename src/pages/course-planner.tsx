import Header from '@/components/Header';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { getCoursePlanner } from '@/services/CoursePlannerService';
import { CoursePlannerData } from '@/utils/Interfaces';
import useCourseStore from '@/store/coursePlannerStore';
import { getCohortSearch } from '@/services/CohortServices';
import { CoursePlannerConstants } from '@/utils/app.constant';
import useStore from '@/store/store';
import { accessControl } from '../../app.config';
import withAccessControl from '@/utils/hoc/withAccessControl';
import NoDataFound from '@/components/common/NoDataFound';
import { toPascalCase } from '@/utils/Helper';

// Define a type for the course planner data

const CoursePlanner = () => {
  const [value, setValue] = React.useState(1);
  const [subjects, setSubjects] = React.useState<CoursePlannerData[]>([]);
  const [state, setState] = React.useState<string>('');
  const [board, setBoard] = React.useState<string>('');
  const [medium, setMedium] = React.useState<string>('');
  const [grade, setGrade] = React.useState<string>('');
  const [selectedValue, setSelectedValue] = React.useState('');

  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setSubject = useCourseStore((state) => state.setSubject);
  const store = useStore();

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 70, behavior: 'smooth' });
    }
  };

  const addQueryParams = (newParams: any) => {
    // Merge existing query params with new ones
    const updatedQuery = { ...router.query, ...newParams };

    // Update the URL without reloading the page
    router.push(
      {
        pathname: router.pathname,
        query: updatedQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCohortChange = (event: any) => {
    setSelectedValue(event.target.value);
    addQueryParams({ center: event.target.value });
  };

  useEffect(() => {
    if (store.cohorts.length > 0) {
      const cohortId = router.query.center
        ? router.query.center
        : store.cohorts[0].cohortId;
      
      addQueryParams({ center: cohortId });
      setSelectedValue(cohortId);
    }
  }, [store.cohorts]);

  useEffect(() => {
    const fetchCohortSearchResults = async () => {
      try {
        const data = await getCohortSearch({
          cohortId: selectedValue,
          limit: 20,
          offset: 0,
        });

        const cohortDetails = data?.result?.results?.cohortDetails?.[0];

        if (cohortDetails) {
          const arrayFields = [
            { label: CoursePlannerConstants.SUBJECT, setter: setSubjects },
          ];

          const stringFields = [
            { label: CoursePlannerConstants.STATES, setter: setState },
            { label: CoursePlannerConstants.BOARD, setter: setBoard },
            { label: CoursePlannerConstants.MEDIUM, setter: setMedium },
            { label: CoursePlannerConstants.GRADE, setter: setGrade },
          ];

          arrayFields.forEach(({ label, setter }) => {
            const field = cohortDetails.customFields.find(
              (field: any) => field.label === label
            );

            if (field?.value) {
              const valuesArray = field.value
                .split(',')
                .map((item: string) => item.trim());
              setter(valuesArray);
            } else if (label === CoursePlannerConstants.SUBJECT) {
              setter([]);
            }
          });

          stringFields.forEach(({ label, setter }) => {
            const field = cohortDetails.customFields.find(
              (field: any) => field.label === label
            );

            if (field?.value) {
              setter(field.value.trim());
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };

    if (selectedValue) {
      fetchCohortSearchResults();
    }
  }, [selectedValue]);

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: '#4D4639',
          padding: '20px 20px 5px',
        }}
        width="100%"
      >
        <Typography textAlign="left" fontSize="22px">
          {t('COURSE_PLANNER.COURSE_PLANNER')}
        </Typography>
      </Box>

      <Grid sx={{ display: 'flex', alignItems: 'center' }} container>
        <Grid item md={6} xs={12}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <Box sx={{ flexBasis: '70%' }}>
              <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  className="select-languages"
                  displayEmpty
                  value={selectedValue}
                  onChange={handleCohortChange}
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                  }}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                    },
                  }}
                >
                  {store.cohorts.map((cohort: any) => (
                    <MenuItem
                      key={cohort.cohortId}
                      value={cohort.cohortId}
                      className="text-truncate"
                    >
                      {toPascalCase(cohort?.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          {/* <Box sx={{ mt: 2, px: '20px' }}>
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
              sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
              placeholder="Search.."
              inputProps={{ 'aria-label': 'search student' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box> */}
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            width: '100%',
            '@media (max-width: 600px)': {
              display: 'flex',
              justifyContent: 'center',
            },
            borderBottom: `1px solid ${theme.palette.primary.contrastText}`,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              '& .MuiTab-root': {
                color: '#4D4639',
                padding: '0 20px',
              },
              '& .Mui-selected': {
                color: '#4D4639',
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '100px',
                height: '3px',
              },
              '& .MuiTabs-scroller': {
                overflowX: 'unset !important',
              },
            }}
          >
            <Tab value={1} label={t('COURSE_PLANNER.FOUNDATION_COURSE')} />
            <Tab value={2} label={t('COURSE_PLANNER.MAIN_COURSE')} />
          </Tabs>
        </Box>
        {value === 1 && (
          <Box sx={{ px: '16px', mt: 2 }}>
            <Box
              sx={{
                background: theme.palette.action.selected,
                py: '2px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <Grid container>
                {subjects?.length > 0 ? (
                  subjects.map((item: any) => (
                    <Grid key={item.id} item xs={12} sm={6} md={4}>
                      <Box
                        sx={{
                          border: `1px solid ${theme.palette.warning.A100}`,
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          margin: '14px',
                          background: theme.palette.warning['A400'],
                        }}
                        onClick={() => {
                          setSubject(item);
                          router.push({
                            pathname: '/course-planner-detail',
                            query: {
                              subject: item,
                              state: state,
                              board: board,
                              medium: medium,
                              grade: grade,
                            },
                          });
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'center',
                              }}
                            >
                              <Box
                                sx={{
                                  position: 'relative',
                                  display: 'inline-flex',
                                }}
                              >
                                {/* <Box sx={{ width: '40px', height: '40px' }}>
                                  <CircularProgressbar
                                    value={item.circular}
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
                                    {item.circular}%
                                  </Typography>
                                </Box> */}
                              </Box>

                              <Box
                                sx={{
                                  fontSize: '16px',
                                  color: theme.palette.warning['300'],
                                }}
                              >
                                {item}
                              </Box>
                            </Box>
                          </Box>
                          <Box>
                            <KeyboardArrowRightIcon
                              sx={{ color: theme.palette.warning['300'] }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <NoDataFound />
                )}
              </Grid>
            </Box>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Typography variant="h2">No Data Found</Typography>
          </Box>
        )}
      </Box>
    </Box>
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

export default withAccessControl(
  'accessCoursePlanner',
  accessControl
)(CoursePlanner);

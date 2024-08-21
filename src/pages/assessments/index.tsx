import CohortSelectionSection from '@/components/CohortSelectionSection';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import SortingModal from '@/components/SortingModal';
import { showToastMessage } from '@/components/Toastify';
import {
  getAssessmentStatus,
  getDoIdForAssessmentDetails,
} from '@/services/AssesmentService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { toPascalCase } from '@/utils/Helper';
import { ICohort } from '@/utils/Interfaces';
import { Role, Status } from '@/utils/app.constant';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Assessments = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [assessmentList, setAssessmentList] = React.useState([]);
  const [classId, setClassId] = React.useState('');
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);

  const [assessmentType, setAssessmentType] = React.useState<string>('pre');
  const [cohortMembers, setCohortMembers] = React.useState<any>([]);
  const [learnerList, setLearnerList] = React.useState<any>([]);
  const [testCompletionCount, setTestCompletionCount] = React.useState<any>({
    completionCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      setClassId(localStorage.getItem('classId') ?? '');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const getCohortMemberList = async () => {
      setIsLoading(true);
      try {
        const filters = {
          cohortId: classId,
          role: Role.STUDENT,
          status: [Status.ACTIVE],
        };
        const response = await getMyCohortMemberList({
          limit: 300,
          page: 0,
          filters,
        });
        const resp = response?.result?.userDetails;

        if (resp) {
          const userDetails = resp.map((user: any) => ({
            ...user,
            name: toPascalCase(user.name),
            userId: user.userId,
            // percentageString: '0%',
            // percentage: 0,
            // status: 'Not_Started',
          }));
          console.log(`userDetails`, userDetails);
          setCohortMembers(userDetails);
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      getCohortMemberList();
      console.log('call API', classId);
    }
  }, [classId]);

  useEffect(() => {
    const getDoIdForAssessmentReport = async () => {
      const stateName = localStorage.getItem('stateName') || 'Maharashtra';

      const filters = {
        program: ['Second chance'],
        se_boards: [stateName],
        // subject: [subjects || subject],
        assessment1: assessmentType === 'pre' ? 'Pre Test' : 'Post Test',
      };
      try {
        if (stateName) {
          if (filters) {
            setIsLoading(true);
            setLearnerList([]);
            setAssessmentList([]);
            const searchResults = await getDoIdForAssessmentDetails({
              filters,
            });

            if (searchResults?.responseCode === 'OK') {
              const result = searchResults?.result;
              if (result) {
                console.log(
                  'Result found from getDoIdForAssessmentDetails ',
                  result
                );
                if (result?.QuestionSet?.length > 0) {
                  const assessmentIds = result.QuestionSet.map((item: any) => {
                    return item?.IL_UNIQUE_ID;
                  });
                  console.log('assessmentIds', assessmentIds);
                  setAssessmentList(assessmentIds);
                } else {
                  setAssessmentList([]);
                }
              } else {
                console.log(
                  'NO Result found from getDoIdForAssessmentDetails '
                );
              }
            }
          } else {
            console.log('NO Data found from getDoIdForAssessmentDetails ');
          }
        } else {
          console.log('NO State Found');
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.error(
          'Error fetching getDoIdForAssessmentDetails results:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    getDoIdForAssessmentReport();
    console.log('call API', classId, assessmentType);
  }, [assessmentType]);

  useEffect(() => {
    const getAssessmentsForLearners = async () => {
      if (assessmentList?.length > 0) {
        try {
          const options = {
            userId: cohortMembers?.map((user: any) => user.userId),
            contentId: assessmentList,
            batchId: classId,
          };
          const assessmentStatus = await getAssessmentStatus(options);
          console.log('assessmentStatus', assessmentStatus);
          let completionCount = 0;
          if (assessmentStatus) {
            const userList = cohortMembers.map((user: any) => {
              const assessment = assessmentStatus?.find(
                (item: any) => item.userId === user.userId
              );

              if (assessment) {
                if (assessment?.status === 'Completed') {
                  completionCount++;
                }
                return {
                  ...user,
                  percentageString: assessment?.percentageString,
                  percentage: assessment?.percentage,
                  status: assessment?.status,
                };
              }
              return user;
            });
            console.log('userList', userList);
            setLearnerList(userList);
          }

          setTestCompletionCount({
            completionCount,
            totalCount: cohortMembers?.length,
          });

          setIsLoading(false);
          console.log('assessmentStatus', learnerList);
        } catch (e: any) {
          setIsLoading(false);
          console.log('Error in getAssessmentStatus', e);
        }
      }
    };
    if (assessmentList.length && cohortMembers.length) {
      getAssessmentsForLearners();
    }
  }, [assessmentList, cohortMembers]);

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

  const handleAssessmentDetails = (userId: string) => {
    router.push(`${router.pathname}/user/${userId}`);
  };

  const MemberListItemIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Not_Started':
        return <RemoveIcon sx={{ color: theme.palette.warning[300] }} />;
      case 'In_Progress':
        return (
          <RadioButtonUncheckedIcon
            sx={{ color: theme.palette.warning[300] }}
          />
        );
      case 'Completed':
        return <CheckCircleIcon sx={{ color: theme.palette.warning[300] }} />;
      default:
        return null;
    }
  };

  const ProgressStatus = ({
    status,
    percentage,
  }: {
    status: string;
    percentage: string | number;
  }) => {
    let color = 'black';
    percentage = Number(percentage);
    if (percentage < 33) {
      color = 'red';
    } else if (percentage >= 33 && percentage < 66) {
      color = 'orange';
    } else if (percentage >= 66) {
      color = 'green';
    }

    switch (status) {
      case 'Not_Started':
        return <Box>Not Started</Box>;
      case 'In_Progress':
        return <Box>In Progress</Box>;
      case 'Completed':
        return (
          <Box>
            Overall Score: <span style={{ color: color }}>{percentage}%</span>
          </Box>
        );
      default:
        return null;
    }
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
          <Box sx={{ mt: 2, px: '20px', width: '100%' }}>
            {/* <FormControl fullWidth>
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
              </Select>
            </FormControl> */}
            <Box className="w-100 d-md-flex">
              <CohortSelectionSection
                classId={classId}
                setClassId={setClassId}
                userId={userId}
                setUserId={setUserId}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                loading={loading}
                setLoading={setLoading}
                cohortsData={cohortsData}
                // setBlockName={() => { }}
                setCohortsData={setCohortsData}
                manipulatedCohortData={manipulatedCohortData}
                setManipulatedCohortData={setManipulatedCohortData}
                isManipulationRequired={false}
                isCustomFieldRequired={true}
                showFloatingLabel={true}
              />
            </Box>
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
                onChange={(e) => setAssessmentType(e.target.value)}
                defaultValue={'pre'}
                value={assessmentType}
              >
                <MenuItem value={'pre'}>{t('PROFILE.PRE_TEST')}</MenuItem>
                <MenuItem value={'post'}>{t('PROFILE.POST_TEST')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      {isLoading && (
        <Box sx={{ display: 'flex', width: '100%', mt: 2, flexDirection: 'column', alignItems: 'center' }}>
          <Loader showBackdrop={false} loadingText="Loading" />
        </Box>
      )}

      {!isLoading && !assessmentList?.length && (
        <Box sx={{ mt: 2, px: '20px' }}>
          <Typography textAlign="center" fontSize="16px">
            {t('ASSESSMENTS.NO_ASSESSMENTS_FOUND')}
          </Typography>
        </Box>
      )}

      {!isLoading && learnerList?.length > 0 && (
        <>
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
              {`${testCompletionCount.completionCount}/${testCompletionCount.totalCount}`}{' '}
              {t('ASSESSMENTS.COMPLETED_THE_ASSESSMENT')}
            </Grid>
            <Grid
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
              xs={4}
              item
            >
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
              {learnerList?.map((member: any) => (
                <Grid item xs={12} sm={6} md={4} key={member?.userId}>
                  <Box
                    sx={{
                      border: `1px solid ${theme?.palette?.warning['A100']}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      gap: '5px',
                      background: theme.palette.warning['A400'],
                    }}
                    onClick={() => handleAssessmentDetails(member?.userId)}
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

                      <MemberListItemIcon status={member.status} />
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
                            {member?.name}
                          </Box>
                          <Box
                            sx={{
                              gap: '4px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <ProgressStatus
                              status={member?.status}
                              percentage={member?.percentage}
                            />
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
          />
        </>
      )}
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

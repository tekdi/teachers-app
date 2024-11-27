import AssessmentReportCard from '@/components/AssessmentReportCard';
import AssessmentSortModal from '@/components/AssessmentSortModal';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import SearchBar from '@/components/Searchbar';
import { showToastMessage } from '@/components/Toastify';
import NoDataFound from '@/components/common/NoDataFound';
import {
  getAssessmentStatus,
  getDoIdForAssessmentDetails,
} from '@/services/AssesmentService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { toPascalCase } from '@/utils/Helper';
import { ICohort } from '@/utils/Interfaces';
import { AssessmentStatus, Role, Status, Telemetry } from '@/utils/app.constant';
import withAccessControl from '@/utils/hoc/withAccessControl';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { accessControl, AssessmentType, AttendanceAPILimit, Program } from '../../../app.config';
import { useDirection } from '../../hooks/useDirection';
import { telemetryFactory } from '@/utils/telemetry';

const DEFAULT_STATUS_ORDER = {
  [AssessmentStatus.NOT_STARTED]: 0,
  [AssessmentStatus.IN_PROGRESS]: 1,
  [AssessmentStatus.COMPLETED]: 2,
};

const Assessments = () => {
  const theme = useTheme<any>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const { dir, isRTL } = useDirection();
  const [assessmentList, setAssessmentList] = useState([]);
  const [classId, setClassId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    useState<Array<ICohort>>(cohortsData);

  const [assessmentType, setAssessmentType] = useState<string>('pre');
  const [cohortMembers, setCohortMembers] = useState<any>([]);
  const [learnerList, setLearnerList] = useState<any>([]);
  const [filteredLearnerList, setFilteredLearnerList] = useState<any>([]);
  const [testCompletionCount, setTestCompletionCount] = useState<any>({
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
      resetValues();
      setIsLoading(true);
      try {
        const filters = {
          cohortId: classId,
          role: Role.STUDENT,
          status: [Status.ACTIVE],
        };
        const response = await getMyCohortMemberList({
          limit: AttendanceAPILimit,
          page: 0,
          filters,
        });
        const resp = response?.result?.userDetails;

        if (resp) {
          const userDetails = resp.map((user: any) => ({
            ...user,
            name: toPascalCase(user.name),
            userId: user.userId,
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
      const stateName = localStorage.getItem('stateName');

      const filters = {
        program: [Program],
        boards: [stateName],
        // subject: [subjects || subject],
        assessmentType:
          assessmentType === 'pre'
            ? AssessmentType.PRE_TEST
            : AssessmentType.POST_TEST,
      };
      try {
        if (stateName) {
          if (filters) {
            setIsLoading(true);
            setLearnerList([]);
            setFilteredLearnerList([]);
            setAssessmentList([]);

            const searchResults = await queryClient.fetchQuery({
              queryKey: ['contentSearch', { filters }],
              queryFn: () => getDoIdForAssessmentDetails({ filters }),
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
      try {
        const options = {
          userId: cohortMembers?.map((user: any) => user.userId),
          courseId: assessmentList, // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId: assessmentList,
          contentId: assessmentList,
          // batchId: classId,
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
              if (assessment?.status === AssessmentStatus.COMPLETED) {
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
          setFilteredLearnerList(userList);
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
    };
    if (assessmentList?.length && cohortMembers?.length) {
      getAssessmentsForLearners();
    }
  }, [assessmentList, cohortMembers]);

  const resetValues = () => {
    setFilteredLearnerList([]);
    setLearnerList([]);
    setCohortMembers([]);
    setTestCompletionCount({ completionCount: 0, totalCount: 0 });
  };

  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (term.length > 0) {
      const filteredList = learnerList?.filter((item: any) => {
        return item?.name?.toLowerCase().includes(term.toLowerCase());
      });
      setFilteredLearnerList(filteredList);
    } else {
      setFilteredLearnerList(learnerList);
    }
  };

  // open modal of sort
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const sortByStatus = (status: string) => {
    // const filteredList = learnerList?.filter((item: any) => {
    //   return item?.status === status;
    // });
    const statusOrder: any = { ...DEFAULT_STATUS_ORDER };

    if (status && Object.prototype.hasOwnProperty.call(statusOrder, status)) {
      statusOrder[status] = -1; // Make the prioritized status the highest
      // Adjust other statuses to ensure correct order
      let orderIndex = 0;
      for (const key in statusOrder) {
        if (key !== status) {
          statusOrder[key] = orderIndex++;
        }
      }
    }

    // Sort based on the adjusted order
    const sortedList = learnerList.sort(
      (a: any, b: any) => statusOrder[a.status] - statusOrder[b.status]
    );
    setFilteredLearnerList(sortedList);
  };

  const sortByMarks = (order: string) => {
    let list = [...learnerList];
    list.sort((a: any, b: any) => Number(a.percentage) - Number(b.percentage));
    if (order === 'asc') {
      list = list.reverse();
    }
    setFilteredLearnerList(list);
  };

  const sortByNames = (order: string) => {
    const list = [...learnerList];
    if (order === 'A_To_Z') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredLearnerList(list);
  };

  const handleSorting = (selectedValue: {
    sortByKey: string;
    sortByValue: string;
  }) => {
    setModalOpen(false);
    console.log('selectedValues', selectedValue);

    switch (selectedValue.sortByKey) {
      case 'attendanceStatus':
        sortByStatus(selectedValue.sortByValue);
        break;
      case 'marksObtained':
        sortByMarks(selectedValue.sortByValue);
        break;
      case 'names':
        sortByNames(selectedValue.sortByValue);
        break;
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
          alignItems: 'center',
          color: theme?.palette?.warning['A200'],
          padding: '20px 20px 5px',
        }}
        width="100%"
      >
        <Typography fontSize="22px">{t('ASSESSMENTS.ASSESSMENTS')}</Typography>
      </Box>
      <SearchBar onSearch={handleSearch} placeholder="Search..." />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px', width: '100%' }}>
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
                setCohortsData={setCohortsData}
                manipulatedCohortData={manipulatedCohortData}
                setManipulatedCohortData={setManipulatedCohortData}
                isManipulationRequired={false}
                isCustomFieldRequired={true}
                showFloatingLabel={true}
                showDisabledDropDown={true}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, px: '20px', width: '100%' }}>
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
                style={{
                  borderRadius: '4px',
                }}
                onChange={(e) => 
                  {setAssessmentType(e.target.value)
                    const windowUrl = window.location.pathname;
                    const cleanedUrl = windowUrl.replace(/^\//, '');
              
        
                    const telemetryInteract = {
                      context: {
                        env: 'assessments',
                        cdata: [],
                      },
                      edata: {
                        id: 'filter-by-assessment-type:'+e.target.value,
                        type: Telemetry.CLICK,
                        subtype: '',
                        pageid: cleanedUrl
                      },
                    };
                    telemetryFactory.interact(telemetryInteract);
                  
                  }}
                defaultValue={'pre'}
                value={assessmentType}
              >
                <MenuItem value={'pre'} style={{ textAlign: 'right' }}>
                  {t('PROFILE.PRE_TEST')}
                </MenuItem>
                <MenuItem value={'post'} style={{ textAlign: 'right' }}>
                  {t('PROFILE.POST_TEST')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mt: 2,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Loader showBackdrop={false} loadingText="Loading" />
        </Box>
      )}

      {!isLoading && !assessmentList?.length && <NoDataFound />}

      {!isLoading &&
        !!assessmentList?.length &&
        !!filteredLearnerList?.length && (
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
              {testCompletionCount.totalCount > 0 && (
                <span>
                  {`${testCompletionCount.completionCount}/${testCompletionCount.totalCount}`}{' '}
                  {t('ASSESSMENTS.COMPLETED_THE_ASSESSMENT')}
                </span>
              )}
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
                className="one-line-text"
              >
                {t('COMMON.SORT_BY')}
              </Button>
            </Grid>
          </Grid>
        )}
      {!isLoading && filteredLearnerList?.length > 0 && (
        <Box sx={{ background: '#FBF4E4', padding: '20px' }}>
          <Grid container spacing={2}>
            {filteredLearnerList?.map((member: any) => (
              <AssessmentReportCard
                key={member.userId}
                assessmentStatus={member.status}
                cardTitle={member.name}
                overallPercentage={member.percentage}
                userId={member.userId}
                classId={classId}
                assessmentType={assessmentType}
              />
            ))}
          </Grid>
        </Box>
      )}
      {!isLoading &&
        !filteredLearnerList?.length &&
        !!assessmentList?.length && <NoDataFound />}

      <AssessmentSortModal
        open={modalOpen}
        onClose={handleCloseModal}
        modalTitle={t('COMMON.SORT_BY')}
        btnText={t('COMMON.APPLY')}
        onFilterApply={handleSorting}
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

export default withAccessControl(
  'accessAssessments',
  accessControl
)(Assessments);

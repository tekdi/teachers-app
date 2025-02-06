import CohortSelectionSection from '@/components/CohortSelectionSection';
import Header from '@/components/Header';
import { getCohortSearch } from '@/services/CohortServices';
import coursePlannerStore from '@/store/coursePlannerStore';
import useStore from '@/store/store';
import taxonomyStore from '@/store/taxonomyStore';
import { CoursePlannerConstants, limit, Telemetry } from '@/utils/app.constant';
import {
  filterAndMapAssociationsNew,
  findCommonAssociations,
  getAssociationsByCodeNew,
  getOptionsByCategory,
} from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { CoursePlannerData, ICohort } from '@/utils/Interfaces';
import { telemetryFactory } from '@/utils/telemetry';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl, COURSE_TYPE, frameworkId } from '../../../app.config';
import { useDirection } from '../../hooks/useDirection';
import Loader from '@/components/Loader';

const CoursePlanner = () => {
  const [value, setValue] = React.useState('');
  const [subjects, setSubjects] = React.useState<CoursePlannerData[]>([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const setStateassociations = coursePlannerStore(
    (state) => state.setStateassociations
  );
  const setArray = taxonomyStore((state) => state.setArray);
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [framework, setFramework] = useState<any[]>([]);
  const setState = taxonomyStore((state) => state.setState);
  const setBoard = taxonomyStore((state) => state.setBoard);

  const [boardOptions, setBoardOptions] = useState<any[]>([]);
  const [boardAssociations, setBoardAssociations] = useState<any[]>([]);
  const setMedium = taxonomyStore((state) => state.setMedium);
  const [mediumOptions, setMediumOptions] = useState<any[]>([]);
  const [mediumAssociations, setMediumAssociations] = useState<any[]>([]);
  const setGrade = taxonomyStore((state) => state.setGrade);
  const [gradeOptions, setGradeOptions] = useState<any[]>([]);
  const [gradeAssociations, setGradeAssociations] = useState<any[]>([]);
  const setType = taxonomyStore((state) => state.setType);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const userStateName = localStorage.getItem('stateName');
  const store = useStore();
  const tStore = taxonomyStore();
  const [stateOption, setStateOption] = useState<any[]>([]);
  const [stateAssociations, setStateAssociations] = useState<any[]>([]);
  const setTaxonomySubject = taxonomyStore((state) => state.setTaxonomySubject);
  const [classId, setClassId] = useState('');
  const [boardNew, setBoardNew] = useState('');
  const [mediumNew, setMediumNew] = useState('');
  const [gradeNew, setGradeNew] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stateName, setStateName] = useState(true);
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    useState<Array<ICohort>>(cohortsData);

  useEffect(() => {
    const subjects = localStorage.getItem('overallCommonSubjects');
    if (subjects) {
      try {
        const parsedData = JSON.parse(subjects)?.sort();
        setSubjects(parsedData);
      } catch (error) {
        console.error('Failed to parse subjects from localStorage:', error);
      }
    } else {
      console.log('No subjects found in localStorage.');
      setSelectedValue('');
    }
  }, []);

  useEffect(() => {
    const fetchCohortSearchResults = async () => {
      setLoading(true);
      setState('');
      setBoard('');
      setMedium('');
      setGrade('');

      try {
        const data = await getCohortSearch({
          cohortId: selectedValue,
          limit: limit,
          offset: 0,
        });

        const cohortDetails = data?.result?.results?.cohortDetails?.[0];

        if (cohortDetails) {
          // const arrayFields = [
          //   { label: CoursePlannerConstants.SUBJECT, setter: setSubject },
          // ];

          const boardField = cohortDetails?.customFields?.find(
            (field: any) => field?.label === 'BOARD'
          );
          const mediumField = cohortDetails?.customFields?.find(
            (field: any) => field?.label === 'MEDIUM'
          );
          const gradeField = cohortDetails?.customFields?.find(
            (field: any) => field?.label === 'GRADE'
          );
          setBoardNew(boardField?.value);
          setMediumNew(mediumField?.value);
          setGradeNew(gradeField?.value);

          const stringFields = [
            // { label: CoursePlannerConstants.STATES, setter: setState },
            { label: CoursePlannerConstants.BOARD, setter: setBoard },
            { label: CoursePlannerConstants.MEDIUM, setter: setMedium },
            { label: CoursePlannerConstants.GRADE, setter: setGrade },
          ];

          stringFields.forEach(({ label, setter }) => {
            const field = cohortDetails.customFields.find(
              (field: any) => field.label === label
            );

            if (field && field.value) {
              setter(field.value.trim());
            }
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };

    if (selectedValue.length) {
      fetchCohortSearchResults();
    }
  }, [selectedValue]);

  useEffect(() => {
    const fetchTaxonomyResultsOne = async () => {
      try {
        // Define the URL for the API
        const url = `/api/framework/v1/read/${frameworkId}`;

        // Use axios to fetch data from the API
        const response = await axios.get(url);
        const boardData = response.data;

        const frameworks = boardData?.result?.framework;

        //       // Get states options
        //       const getStates = getOptionsByCategory(frameworks, 'state');

        // Set the frameworks state
        setFramework(frameworks);
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };

    fetchTaxonomyResultsOne();
  }, [selectedValue, boardNew]);

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

  useEffect(() => {
    if (classId) {
      setSelectedValue(classId);
      addQueryParams({ center: classId });
    }
  }, [classId]);

  useEffect(() => {
    if (store.cohorts.length > 0) {
      const cohortId = router.query.center
        ? router.query.center
        : store.cohorts[0].cohortId;

      addQueryParams({ center: cohortId });
      setSelectedValue(cohortId);
      setType(tStore.type || COURSE_TYPE.FOUNDATION_COURSE);
    }
  }, [store.cohorts]);

  useEffect(() => {
    const fetchTaxonomyResults = async () => {
      try {
        // const StateName = tStore?.state;

        console.log(boardNew, mediumNew, gradeNew);

        const url = `/api/framework/v1/read/${frameworkId}`;

        // Use axios to fetch data from the API
        const response = await axios.get(url);
        const boardData = response.data;

        const frameworks = boardData?.result?.framework;

        const getBoards = await getOptionsByCategory(frameworks, 'board');
        console.log(getBoards);
        const matchBoard = getBoards?.find(
          (item: any) => item.name === boardNew
        );
        console.log(matchBoard);
        const getMedium = getOptionsByCategory(frameworks, 'medium');
        const matchMedium = getMedium.find(
          (item: any) => item.name === mediumNew
        );
        console.log(matchMedium);
        const getGrades = getOptionsByCategory(frameworks, 'gradeLevel');
        const matchGrade = getGrades.find(
          (item: any) => item.name === gradeNew
        );
        console.log(matchGrade);
        const getCourseTypes = getOptionsByCategory(frameworks, 'courseType');
        const courseTypes = getCourseTypes?.map((type: any) => type.name);
        setTypeOptions(courseTypes);
        console.log(courseTypes);

        const courseTypesAssociations = getCourseTypes?.map((type: any) => {
          return {
            code: type.code,
            name: type.name,
            associations: type.associations,
          };
        });

        console.log(courseTypesAssociations);

        const courseSubjectLists = courseTypesAssociations.map(
          (courseType: any) => {
            const commonAssociations =
              matchBoard?.associations?.filter(
                (assoc: any) =>
                  matchMedium?.associations.some(
                    (item: any) => item.code === assoc.code
                  ) &&
                  matchGrade?.associations.some(
                    (item: any) => item.code === assoc.code
                  )
              ) || [];

            const getSubjects = getOptionsByCategory(framework, 'subject');

            const subjectAssociations = commonAssociations?.filter(
              (assoc: any) =>
                getSubjects.map((item: any) => assoc.code === item?.code)
            );
            return {
              courseTypeName: courseType?.name,
              courseType: courseType?.code,
              subjects: subjectAssociations?.map(
                (subject: any) => subject?.name
              ),
            };
          }
        );
        const matchedCourse = courseSubjectLists.find(
          (course: any) => course.courseTypeName === tStore.type
        );

        const matchingSubjects = matchedCourse
          ? matchedCourse.subjects?.sort()
          : [];

        const uniqueSubjects = matchingSubjects.filter(
          (value: any, index: any, self: string | any[]) => {
            return self.indexOf(value) === index;
          }
        );

        setSubjects(uniqueSubjects);

        // setSubjects(matchingSubjects);
        localStorage.setItem(
          'overallCommonSubjects',
          JSON.stringify(matchingSubjects)
        );
        // setSubjectLists(courseSubjectLists);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    fetchTaxonomyResults();
  }, [value, selectedValue, classId, boardNew, mediumNew, gradeNew]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string;

    setValue(newValue);
    setType(newValue);

    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: 'change-filter:' + event.target.value,

        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const isBoardEmpty = !tStore.board;
  const isMediumEmpty = !tStore.medium;
  const isGradeEmpty = !tStore.grade;

  const emptyFields = [];

  if (isBoardEmpty) emptyFields.push(CoursePlannerConstants.BOARD_SMALL);
  if (isMediumEmpty) emptyFields.push(CoursePlannerConstants.MEDIUM_SMALL);
  if (isGradeEmpty) emptyFields.push(CoursePlannerConstants.GRADE_SMALL);

  const anyFieldsEmpty = emptyFields.length > 0;

  const redirectTODetailsPage = (item: any) => {
    if (tStore.type) {
      setTaxonomySubject(item);
      router.push({
        pathname: `/curriculum-planner/center/${selectedValue}`,
      });
    }
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>

      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <Box
        sx={{
          display: 'flex',
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
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="course-type-select-label">
                {' '}
                {t('COURSE_PLANNER.COURSE_TYPE')}
              </InputLabel>
              <Select
                labelId="course-type-select-label"
                id="course-type-select"
                value={tStore?.type || COURSE_TYPE.FOUNDATION_COURSE}
                onChange={handleChange}
                label="Course Type"
                sx={{
                  fontSize: '14px',
                  background: '#fff',
                }}
                disabled={!tStore.board || !tStore.medium || !tStore.grade} // Disable if any field is empty
              >
                {typeOptions?.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ m: 3 }}>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              background: theme.palette.action.selected,
              py: '2px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <Grid container>
              {anyFieldsEmpty ? (
                <Box sx={{ ml: 2, p: 2 }}>
                  <Typography variant="h2">
                    {`No assigned ${emptyFields.join(', ')} for selected Center`}
                  </Typography>
                </Box>
              ) : subjects?.length > 0 ? (
                subjects.map((item: any) => (
                  <Grid key={item.code} item xs={12} sm={12} md={6} lg={4}>
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.warning.A100}`,
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'pointer',
                        margin: '14px',
                        background: theme.palette.warning['A400'],
                      }}
                      onClick={() => redirectTODetailsPage(item)}
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
                            ></Box>

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
                            sx={{
                              color: theme.palette.warning['300'],
                              transform: isRTL ? ' rotate(180deg)' : 'unset',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Box sx={{ ml: 2, p: 2 }}>
                  <Typography variant="h2">
                    {t('ASSESSMENTS.NO_SUBJECT_FOUND')}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>
        </Box>
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

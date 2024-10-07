import Header from '@/components/Header';
import { getCohortSearch } from '@/services/CohortServices';
import coursePlannerStore from '@/store/coursePlannerStore';
import useStore from '@/store/store';
import taxonomyStore from '@/store/taxonomyStore';
import { CoursePlannerConstants } from '@/utils/app.constant';
import {
  filterAndMapAssociationsNew,
  findCommonAssociations,
  getAssociationsByCodeNew,
  getOptionsByCategory,
  toPascalCase,
} from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { CoursePlannerData, ICohort } from '@/utils/Interfaces';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl, frameworkId } from '../../app.config';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import { useDirection } from '../hooks/useDirection';

const CoursePlanner = () => {
  const [value, setValue] = React.useState('');
  const [subjects, setSubjects] = React.useState<CoursePlannerData[]>([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const setStateassociations = coursePlannerStore(
    (state) => state.setStateassociations
  );
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
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
  const [typeAssociations, setTypeAssociations] = useState<any[]>([]);
  const userStateName = localStorage.getItem('stateName');
  const store = useStore();
  const tStore = taxonomyStore();
  const [stateOption, setStateOption] = useState<any[]>([]);
  const [stateAssociations, setStateAssociations] = useState<any[]>([]);
  const setTaxonomySubject = taxonomyStore((state) => state.setTaxonomySubject);
  const [classId, setClassId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    useState<Array<ICohort>>(cohortsData);

  const handleChange = (event: any) => {
    setValue(event.target.value);
    setType(event.target.value);
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

  const handleCohortChange = (event: any) => {
    setSelectedValue(event.target.value);
    addQueryParams({ center: event.target.value });
  };

  useEffect(() => {
    if (classId) {
      setSelectedValue(classId);
      addQueryParams({ center: classId });
    }
  }, [classId]);

  useEffect(() => {
    const subjects = localStorage.getItem('overallCommonSubjects');
    if (subjects) {
      try {
        const parsedData = JSON.parse(subjects);
        setSubjects(parsedData);
      } catch (error) {
        console.error('Failed to parse subjects from localStorage:', error);
      }
    } else {
      console.log('No subjects found in localStorage.');
      setSubjects([]);
    }
  }, []);

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
      setLoading(true);
      setState('');
      setBoard('');
      setMedium('');
      setGrade('');

      try {
        const data = await getCohortSearch({
          cohortId: selectedValue,
          limit: 20,
          offset: 0,
        });

        const cohortDetails = data?.result?.results?.cohortDetails?.[0];

        if (cohortDetails) {
          // const arrayFields = [
          //   { label: CoursePlannerConstants.SUBJECT, setter: setSubject },
          // ];

          const stringFields = [
            { label: CoursePlannerConstants.STATES, setter: setState },
            { label: CoursePlannerConstants.BOARD, setter: setBoard },
            { label: CoursePlannerConstants.MEDIUM, setter: setMedium },
            { label: CoursePlannerConstants.GRADE, setter: setGrade },
          ];

          // arrayFields.forEach(({ label, setter }) => {
          //   const field = cohortDetails.customFields.find(
          //     (field: any) => field.label === label
          //   );

          //   if (field && field.value) {
          //     const valuesArray = field.value
          //       .split(',')
          //       .map((item: string) => item.trim());
          //     setter(valuesArray);
          //   } else if (label === CoursePlannerConstants.SUBJECT) {
          //     setter([]);
          //   }
          // });

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

    fetchCohortSearchResults();
  }, [selectedValue]);

  useEffect(() => {
    const fetchTaxonomyResults = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUNBIRDSAAS_API_URL}/api/framework/v1/read/${frameworkId}`;
        const boardData = await fetch(url).then((res) => res.json());
        console.log(boardData?.result?.framework);
        const frameworks = boardData?.result?.framework;
        const getStates = getOptionsByCategory(frameworks, 'state');

        setFramework(frameworks);
        const matchingState = getStates.find(
          (state: any) => state.name === userStateName
        );
        if (matchingState) {
          setStateOption([matchingState]);
          setStateAssociations(matchingState.associations);

          const getBoards = await getOptionsByCategory(frameworks, 'board');
          if (getBoards && matchingState) {
            const commonBoards = getBoards
              .filter((item1: { code: any }) =>
                matchingState.associations.some(
                  (item2: { code: any; category: string }) =>
                    item2.code === item1.code && item2.category === 'board'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1.name,
                code: item1.code,
                associations: item1.associations,
              }));
            setBoardOptions(commonBoards);
            const getMedium = await getOptionsByCategory(framework, 'medium');
            const boardAssociations = getAssociationsByCodeNew(
              boardOptions,
              tStore?.board
            );

            setBoardAssociations(boardAssociations);

            const commonMediumInState = getMedium
              .filter((item1: { code: string }) =>
                stateAssociations.some(
                  (item2: { code: string; category: string }) =>
                    item2.code === item1.code && item2.category === 'medium'
                )
              )
              .map(
                (item1: {
                  name: string;
                  code: string;
                  associations: any[];
                }) => ({
                  name: item1.name,
                  code: item1.code,
                  associations: item1.associations,
                })
              );

            const commonMediumInBoard = getMedium
              .filter((item1: { code: any }) =>
                boardAssociations.some(
                  (item2: { code: any; category: string }) =>
                    item2.code === item1.code && item2.category === 'medium'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1.name,
                code: item1.code,
                associations: item1.associations,
              }));
            console.log(`commonMediumInState`, commonMediumInState);
            console.log(`commonMediumInBoard`, commonMediumInBoard);

            const commonMediumData = findCommonAssociations(
              commonMediumInState,
              commonMediumInBoard
            );
            setMediumOptions(commonMediumData);

            const getGrades = await getOptionsByCategory(
              framework,
              'gradeLevel'
            );
            const mediumAssociations = getAssociationsByCodeNew(
              mediumOptions,
              tStore?.medium
            );
            console.log('boardAssociations', stateAssociations);
            setMediumAssociations(mediumAssociations);

            const commonGradeInState = await getGrades
              .filter((item1: { code: string }) =>
                stateAssociations.some(
                  (item2: { code: string; category: string }) =>
                    item2.code === item1.code && item2.category === 'gradeLevel'
                )
              )
              .map(
                (item1: {
                  name: string;
                  code: string;
                  associations: any[];
                }) => ({
                  name: item1.name,
                  code: item1.code,
                  associations: item1.associations,
                })
              );

            const commonGradeInBoard = await getGrades
              .filter((item1: { code: any }) =>
                boardAssociations.some(
                  (item2: { code: any; category: string }) =>
                    item2.code === item1.code && item2.category === 'gradeLevel'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1.name,
                code: item1.code,
                associations: item1.associations,
              }));

            const commonGradeInMedium = await getGrades
              .filter((item1: { code: any }) =>
                mediumAssociations.some(
                  (item2: { code: any; category: string }) =>
                    item2.code === item1.code && item2.category === 'gradeLevel'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1.name,
                code: item1.code,
                associations: item1.associations,
              }));
            console.log(`commonGradeInState`, commonGradeInState);
            console.log(`commonGradeInMedium`, commonGradeInMedium);

            const commonGradeInStateBoard = findCommonAssociations(
              commonGradeInState,
              commonGradeInBoard
            );
            const overAllCommonGrade = findCommonAssociations(
              commonGradeInStateBoard,
              commonGradeInMedium
            );
            setGradeOptions(overAllCommonGrade);

            const gradeAssociations = getAssociationsByCodeNew(
              gradeOptions,
              tStore?.grade
            );
            setGradeAssociations(gradeAssociations);
            const type = await getOptionsByCategory(framework, 'courseType');
            console.log(type);

            const commonTypeInState = filterAndMapAssociationsNew(
              'courseType',
              type,
              stateAssociations,
              'code'
            );
            const commonTypeInBoard = filterAndMapAssociationsNew(
              'courseType',
              type,
              boardAssociations,
              'code'
            );
            const commonTypeInMedium = filterAndMapAssociationsNew(
              'courseType',
              type,
              mediumAssociations,
              'code'
            );
            const commonTypeInGrade = filterAndMapAssociationsNew(
              'courseType',
              type,
              gradeAssociations,
              'code'
            );

            const commonTypeData = findCommonAssociations(
              commonTypeInState,
              commonTypeInBoard
            );
            const commonType2Data = findCommonAssociations(
              commonTypeInMedium,
              commonTypeInGrade
            );
            const commonType3Data = findCommonAssociations(
              commonTypeData,
              commonType2Data
            );

            console.log(`commonTypeOverall`, commonType3Data);
            setTypeOptions(commonType3Data);
            // setType(commonType3Data);

            const typeAssociations = getAssociationsByCodeNew(
              typeOptions,
              tStore?.type
            );
            setTypeAssociations(typeAssociations);
            const subject = await getOptionsByCategory(framework, 'subject');

            console.log(subject);

            const commonSubjectInState = filterAndMapAssociationsNew(
              'subject',
              subject,
              stateAssociations,
              'code'
            );
            const commonSubjectInBoard = filterAndMapAssociationsNew(
              'subject',
              type,
              boardAssociations,
              'code'
            );
            const commonSubjectInMedium = filterAndMapAssociationsNew(
              'subject',
              subject,
              mediumAssociations,
              'code'
            );
            const commonSubjectInGrade = filterAndMapAssociationsNew(
              'subject',
              subject,
              gradeAssociations,
              'code'
            );
            const commonSubjectInType = filterAndMapAssociationsNew(
              'subject',
              subject,
              typeAssociations,
              'code'
            );

            const findCommonAssociationsNew = (
              array1: any[],
              array2: any[]
            ) => {
              return array1.filter((item1: { code: any }) =>
                array2.some((item2: { code: any }) => item1.code === item2.code)
              );
            };

            const findOverallCommonSubjects = (arrays: any[]) => {
              const nonEmptyArrays = arrays.filter(
                (array: string | any[]) => array && array.length > 0
              );

              if (nonEmptyArrays.length === 0) return [];

              let commonSubjects = nonEmptyArrays[0];

              for (let i = 1; i < nonEmptyArrays.length; i++) {
                commonSubjects = findCommonAssociationsNew(
                  commonSubjects,
                  nonEmptyArrays[i]
                );

                if (commonSubjects.length === 0) return [];
              }

              return commonSubjects;
            };

            const arrays = [
              commonSubjectInState,
              commonSubjectInBoard,
              commonSubjectInMedium,
              commonSubjectInGrade,
              commonSubjectInType,
            ];

            const overallCommonSubjects =
              await findOverallCommonSubjects(arrays);

            localStorage.setItem(
              'overallCommonSubjects',
              JSON.stringify(overallCommonSubjects)
            );
            setSubjects(overallCommonSubjects);
          }
        }
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };

    fetchTaxonomyResults();
  }, [value, selectedValue]);

  const isStateEmpty = !tStore.state;
  const isBoardEmpty = !tStore.board;
  const isMediumEmpty = !tStore.medium;
  const isGradeEmpty = !tStore.grade;

  const emptyFields = [];
  if (isStateEmpty) emptyFields.push(CoursePlannerConstants.STATES_SMALL);
  if (isBoardEmpty) emptyFields.push(CoursePlannerConstants.BOARD_SMALL);
  if (isMediumEmpty) emptyFields.push(CoursePlannerConstants.MEDIUM_SMALL);
  if (isGradeEmpty) emptyFields.push(CoursePlannerConstants.GRADE_SMALL);

  const anyFieldsEmpty = emptyFields.length > 0;

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

      {/* <Grid sx={{ display: 'flex', alignItems: 'center' }} container>
        <Grid item md={6} xs={12}>
          <Box sx={{ mt: 2, px: '20px' }}>
            <Box sx={{ flexBasis: '70%' }}>
              <FormControl
                className="drawer-select"
                sx={{ width: '100%' }}
                variant="outlined"
              >
                <InputLabel id="select-center-label">Select Centers</InputLabel>
                <Select
                  labelId="select-center-label"
                  id="select-center"
                  value={selectedValue}
                  onChange={handleCohortChange}
                  label="Select Centers"
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
      </Grid> */}

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
              <InputLabel id="course-type-select-label">Course Type</InputLabel>
              <Select
                labelId="course-type-select-label"
                id="course-type-select"
                value={tStore?.type}
                onChange={handleChange}
                label="Course Type"
                sx={{ fontSize: '14px' }}
                disabled={
                  !tStore.state ||
                  !tStore.board ||
                  !tStore.medium ||
                  !tStore.grade
                } // Disable if any field is empty
              >
                <MenuItem value={'Foundation Course'}>
                  {t('COURSE_PLANNER.FOUNDATION_COURSE')}
                </MenuItem>
                <MenuItem value={'Main Course'}>
                  {t('COURSE_PLANNER.MAIN_COURSE')}
                </MenuItem>
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
                    {`No assigned ${emptyFields.join(', ')}`}
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
                      onClick={() => {
                        setTaxonomySubject(item.name);
                        router.push({
                          pathname: '/course-planner-detail',
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
                                  value={item.circular || 0}
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
                                  {item.circular || 0}%
                                </Typography>
                              </Box> */}
                            </Box>

                            <Box
                              sx={{
                                fontSize: '16px',
                                color: theme.palette.warning['300'],
                              }}
                            >
                              {item.name}
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

import CohortSelectionSection from '@/components/CohortSelectionSection';
import Header from '@/components/Header';
import { getCohortSearch } from '@/services/CohortServices';
import coursePlannerStore from '@/store/coursePlannerStore';
import useStore from '@/store/store';
import taxonomyStore from '@/store/taxonomyStore';
import { CoursePlannerConstants, Telemetry } from '@/utils/app.constant';
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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl, COURSE_TYPE, frameworkId } from '../../../app.config';
import { useDirection } from '../../hooks/useDirection';
import { types } from 'node:util';
import axios from 'axios';

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
  const [boardNew, setBoardNew] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stateName, setStateName] = useState(true);
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    useState<Array<ICohort>>(cohortsData);

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

          const boardField = cohortDetails?.customFields?.find(
            (field: any) => field?.label === 'BOARD'
          );
          console.log(boardField?.value);
          setBoardNew(boardField?.value);

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

    if (selectedValue.length) {
      fetchCohortSearchResults();
    }
  }, [selectedValue, subjects]);

  useEffect(() => {
    const fetchTaxonomyResultsOne = async () => {
      try {
        // Define the URL for the API
        const url = `/api/framework/v1/read/${frameworkId}`;

        // Use axios to fetch data from the API
        const response = await axios.get(url);
        const boardData = response.data;

        console.log(boardData?.result?.framework);
        const frameworks = boardData?.result?.framework;

        // Get states options
        const getStates = getOptionsByCategory(frameworks, 'state');

        console.log(getStates);

        // Set the frameworks state
        setFramework(frameworks);

        const matchingState = getStates.find(
          (state: any) => state.name === userStateName
        );

        if (matchingState) {
          console.log(matchingState);

          setStateOption([matchingState]);
          setStateAssociations(matchingState?.associations);
          console.log('FIRST TIME API', matchingState);

          // Get boards options
          const getBoards = await getOptionsByCategory(frameworks, 'board');
          if (getBoards && matchingState) {
            console.log('FIRST TIME API', getBoards);

            const commonBoards = await getBoards
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

            console.log('FIRST TIME API', commonBoards);
            setBoardOptions(commonBoards);

            // Fetch medium options
            const getMedium = frameworks?.categories
              ?.find((category: any) => category?.code === 'medium')
              ?.terms?.map((term: any) => ({
                name: term?.name,
                code: term?.code,
                associations: term?.associations,
              }));

            console.log('FIRST TIME API', commonBoards);
            console.log(boardNew);
            const boardAssociations =
              (await commonBoards?.find((item: any) => item?.name === boardNew)
                ?.associations) || [];
            setBoardAssociations(boardAssociations);
            console.log('FIRST TIME API', boardAssociations);

            // Filter medium based on state
            const commonMediumInState = await getMedium
              ?.filter((item1: { code: string }) =>
                matchingState?.associations?.some(
                  (item2: { code: string; category: string }) =>
                    item2?.code === item1?.code && item2?.category === 'medium'
                )
              )
              .map(
                (item1: {
                  name: string;
                  code: string;
                  associations: any[];
                }) => ({
                  name: item1?.name,
                  code: item1?.code,
                  associations: item1?.associations,
                })
              );

            const commonMediumInBoard = getMedium
              ?.filter((item1: { code: any }) =>
                boardAssociations?.some(
                  (item2: { code: any; category: string }) =>
                    item2.code === item1?.code && item2?.category === 'medium'
                )
              )
              ?.map((item1: { name: any; code: any; associations: any }) => ({
                name: item1?.name,
                code: item1?.code,
                associations: item1?.associations,
              }));

            console.log(`commonMediumInState`, commonMediumInState);
            console.log(`commonMediumInBoard`, commonMediumInBoard);

            const commonMediumData = findCommonAssociations(
              commonMediumInState,
              commonMediumInBoard
            );

            console.log(commonMediumData);

            setMediumOptions(commonMediumData);

            // Fetch grades options
            const getGrades = await frameworks?.categories
              ?.find((category: any) => category?.code === 'gradeLevel')
              ?.terms?.map((term: any) => ({
                name: term?.name,
                code: term?.code,
                associations: term?.associations,
              }));

            console.log(getGrades);

            const mediumAssociations = frameworks?.categories
              ?.find((category: any) => category?.code === 'medium')
              ?.terms?.map((term: any) => ({
                name: term?.name,
                code: term?.code,
                associations: term?.associations,
              }));
            console.log('boardAssociations', mediumAssociations);
            setMediumAssociations(mediumAssociations);

            const commonGradeInState = await getGrades
              ?.filter((item1: { code: string }) =>
                matchingState?.associations?.some(
                  (item2: { code: string; category: string }) =>
                    item2?.code === item1?.code &&
                    item2?.category === 'gradeLevel'
                )
              )
              ?.map(
                (item1: {
                  name: string;
                  code: string;
                  associations: any[];
                }) => ({
                  name: item1?.name,
                  code: item1?.code,
                  associations: item1?.associations,
                })
              );

            const commonGradeInBoard = await getGrades
              ?.filter((item1: { code: any }) =>
                boardAssociations?.some(
                  (item2: { code: any; category: string }) =>
                    item2?.code === item1?.code &&
                    item2?.category === 'gradeLevel'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1?.name,
                code: item1?.code,
                associations: item1?.associations,
              }));

            const commonGradeInMedium = await getGrades
              ?.filter((item1: { code: any }) =>
                mediumAssociations?.some(
                  (item2: { code: any; category: string }) =>
                    item2?.code === item1?.code &&
                    item2?.category === 'gradeLevel'
                )
              )
              .map((item1: { name: any; code: any; associations: any }) => ({
                name: item1?.name,
                code: item1?.code,
                associations: item1?.associations,
              }));
            console.log(`commonGradeInBoards`, commonGradeInBoard);
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
            console.log(overAllCommonGrade);

            setGradeOptions(overAllCommonGrade);

            const gradeAssociations = getAssociationsByCodeNew(
              overAllCommonGrade,
              tStore?.grade
            );

            console.log(gradeAssociations);

            setGradeAssociations(gradeAssociations);

            // Fetch course type options
            const type = await frameworks?.categories
              ?.find((category: any) => category?.code === 'courseType')
              ?.terms?.map((term: any) => ({
                name: term?.name,
                code: term?.code,
                associations: term?.associations,
              }));
            console.log(type);

            const associationsMap = {
              state: stateAssociations,
              board: boardAssociations,
              medium: mediumAssociations,
              grade: gradeAssociations,
            };

            const commonTypes = Object.entries(associationsMap).reduce(
              (result, [key, associations]) => {
                result[key] = filterAndMapAssociationsNew(
                  'courseType',
                  type,
                  associations,
                  'code'
                );
                return result;
              },
              {} as Record<string, any[]>
            );

            // Access individual results
            const commonTypeInState = commonTypes.state;
            const commonTypeInBoard = commonTypes.board;
            const commonTypeInMedium = commonTypes.medium;
            const commonTypeInGrade = commonTypes.grade;

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
          }
        } else {
          // setStateName(false);
        }
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };

    fetchTaxonomyResultsOne();
  }, [boardNew]);

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
          typeOptions,
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

        const findCommonAssociationsNew = (array1: any[], array2: any[]) => {
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

        const overallCommonSubjects = await findOverallCommonSubjects(arrays);

        localStorage.setItem(
          'overallCommonSubjects',
          JSON.stringify(overallCommonSubjects)
        );
        setSubjects(overallCommonSubjects);
        setArray(overallCommonSubjects);
      } catch (error) {
        console.error('Failed to fetch cohort search results:', error);
      }
    };
    fetchTaxonomyResults();
  }, [value, typeOptions, selectedValue]);

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

  const redirectTODetailsPage = (item: any) => {
    if (tStore.type) {
      setTaxonomySubject(item.name);
      router.push({
        pathname: `/course-planner/center/${selectedValue}`,
      });
    }
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
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
              <InputLabel id="course-type-select-label">Course Type</InputLabel>
              <Select
                labelId="course-type-select-label"
                id="course-type-select"
                value={tStore?.type}
                onChange={handleChange}
                label="Course Type"
                sx={{
                  fontSize: '14px',
                }}
                disabled={
                  !tStore.state ||
                  !tStore.board ||
                  !tStore.medium ||
                  !tStore.grade ||
                  stateName == false
                } // Disable if any field is empty
              >
                {typeOptions?.map((item: any) => (
                  <MenuItem key={item?.name} value={item?.name}>
                    {item?.name}
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

import AddLearnerModal from '@/components/AddLeanerModal';
import DateRangePopup from '@/components/DateRangePopup';
import Header from '@/components/Header';
import LearnersListItem from '@/components/LearnersListItem';
import Loader from '@/components/Loader';
import StudentStatsCard from '@/components/StudentStatsCard';
import { showToastMessage } from '@/components/Toastify';
import { getFormRead } from '@/hooks/useFormRead';
import {
  classesMissedAttendancePercentList,
  getCohortAttendance,
} from '@/services/AttendanceService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { getUserDetails } from '@/services/ProfileService';
import useStore from '@/store/store';
import {
  FormContext,
  FormContextType,
  getMenuItems,
  limit,
  Role,
  Status,
} from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import {
  extractAddress,
  formatSelectedDate,
  getUserDetailsById,
  mapFieldIdToValue,
  toPascalCase,
  translateString,
} from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import {
  AssessmentReportProp,
  CohortAttendancePercentParam,
  CustomField,
  OverallAttendance,
  UpdateCustomField,
} from '@/utils/Interfaces';
import {
  ArrowBack as ArrowBackIcon,
  CreateOutlined as CreateOutlinedIcon,
  East as EastIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ComponentType, useEffect, useState } from 'react';
import {
  accessControl,
  AttendanceAPILimit
} from '../../../app.config';
import { isEliminatedFromBuild } from '../../../featureEliminationUtil';
import { useDirection } from '../../hooks/useDirection';
let AssessmentReport: ComponentType<AssessmentReportProp> | null = null;

if (!isEliminatedFromBuild('AssessmentReport', 'component')) {
  AssessmentReport = dynamic(
    () => import('../../components/AssessmentReport'),
    {
      ssr: false,
    }
  );
}

interface LearnerProfileProp {
  reloadState?: boolean;
  setReloadState?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearnerProfile: React.FC<LearnerProfileProp> = ({
  reloadState,
  setReloadState,
}) => {
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
  const theme = useTheme<any>();
  const today = new Date();
  const router = useRouter();
  const { userId }: any = router.query;
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserUserName, setSelectedUserUserName] = useState("");
  const [assesmentData, setAssesmentData] = useState<any>(null);
  const [test, setTest] = React.useState('Pre Test');
  const [subject, setSubject] = React.useState('English');
  const [customFieldsData, setCustomFieldsData] = useState<UpdateCustomField[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<any | null>(null);
  const [isFromDate, setIsFromDate] = useState(
    formatSelectedDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000))
  );
  const [submittedOn, setSubmittedOn] = useState();
  const [overallAttendance, setOverallAttendance] =
    useState<OverallAttendance>();
  const [currentDayMonth, setCurrentDayMonth] = React.useState<string>('');
  const [selectedValue, setSelectedValue] = React.useState<any>('');
  const [numberOfDaysAttendanceMarked, setNumberOfDaysAttendanceMarked] =
    useState(0);
  const [dateRange, setDateRange] = React.useState<Date | string>('');
  const [classId, setClassId] = React.useState('');
  const [totalMaxScore, setTotalMaxScore] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [address, setAddress] = useState('');
  const [uniqueDoId, setUniqueDoId] = useState('');
  const [isError, setIsError] = React.useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isLearnerDeleted, setIsLearnerDeleted] =
    React.useState<boolean>(false);
  const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [cohortId, setCohortId] = React.useState('');
  const [userDetails, setUserDetails] = React.useState<{
    status: any;
    statusReason: any;
    cohortMembershipId: any;
  } | null>(null);

  useEffect(() => {
    setSelectedValue(currentDayMonth);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('learnerId', userId);
      setCohortId(localStorage.getItem('classId') || '');
    }
  }, []);

  const handleReload = () => {
    setReload((prev) => !prev);
  };

  const handleDateRangeSelected = ({ fromDate, toDate }: any) => {
    setIsFromDate(fromDate);
    getAttendanceData(fromDate, toDate);
  };

  const menuItems = getMenuItems(t, dateRange, currentDayMonth);

  const handleOpenAddLearnerModal = () => {
    setOpenAddLearnerModal(true);
  };

  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
  };

  const mapFields = (formFields: any, response: any) => {
    response.userData.phone_number=response.userData.mobile
    const initialFormData: any = {};
    formFields.fields.forEach((item: any) => {
      const userData = response?.userData;
      const customFieldValue = userData?.customFields?.find(
        (field: any) => field.fieldId === item.fieldId
      );
      const getValue = (data: any, field: any) => {
        if (item.default) {
          return item.default;
        }
        if (item?.isMultiSelect) {
          if (data[item.name] && item?.maxSelections > 1) {
            return [field?.value];
          } else if (item?.type === 'checkbox') {
            return String(field?.value).split(',');
          } else {
            return field?.value.toLowerCase();
          }
        } else {
          if (item?.type === 'numeric') {
            return parseInt(String(field?.value));
          } else if (item?.type === 'text') {
            return String(field?.value);
          } else if (item?.type === 'radio') {
            if (typeof field?.value === 'string') {
              return field?.value?.replace(/_/g, ' ').toLowerCase();
            }
            return field?.value.toLowerCase();
          }
        }
      };
      if (item.coreField) {
        if (item?.isMultiSelect) {
          if (userData[item.name] && item?.maxSelections > 1) {
            initialFormData[item.name] = [userData[item.name]];
          } else if (item?.type === 'checkbox') {
            initialFormData[item.name] = String(userData[item.name]).split(',');
          } else {
            initialFormData[item.name] = userData[item.name];
          }
        } else if (item?.type === 'numeric') {
          initialFormData[item.name] = Number(userData[item.name]);
        } else if (item?.type === 'text' && userData[item.name]) {
          initialFormData[item.name] = String(userData[item.name]);
        } else {
          if (userData[item.name]) {
            initialFormData[item.name] = userData[item.name];
          }
        }
      } else {

        if (customFieldValue) {
          const fieldValue = getValue(userData, customFieldValue); 
          if (fieldValue) {
            initialFormData[item.name] = fieldValue;
          }
        }
      }
    });
    return initialFormData;
  };

  const fetchDataAndInitializeForm = async () => {
    try {
      const response = await getUserDetails(userId, true);
      setSelectedUserUserName(response?.result?.userData?.username);
      setSelectedUserEmail(response?.result?.userData?.email);
   



      const formFields = await getFormRead(
        FormContext.USERS,
        FormContextType.STUDENT
      );
      setFormData(mapFields(formFields, response?.result));
    } catch (error) {
      console.error('Error fetching data or initializing form:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchDataAndInitializeForm();

      if (cohortId) {
        const page = 0;
        const filters = { cohortId: cohortId };
        try {
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.userDetails;
          if (resp) {
            const result = getUserDetailsById(resp, userId);
            setUserDetails(result);
          }
        } catch (error) {
          console.error('Error fetching cohort member list:', error);
        }
      }
    };

    fetchData();
  }, [userId, reload, cohortId]);

  const getAttendanceData = async (fromDates: any, toDates: any) => {
    const filters: any = {
      userId: userId,
    };

    // Conditionally add fromDate and toDate to filters if selectedValue doesn't match the specific condition
    if (
      selectedValue !==
      t('DASHBOARD.AS_OF_TODAY_DATE', { day_date: currentDayMonth })
    ) {
      filters.fromDate = fromDates;
      filters.toDate = toDates;
    }

    const response = await classesMissedAttendancePercentList({
      filters,
      facets: ['userId'],
    });
    if (response?.responseCode === 200) {
      const userData = response?.data?.result?.userId[userId];
      setOverallAttendance(userData);
    }
  };

  // ger user information
  const fetchUserDetails = async () => {
    setLoading(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      const user: any = userId;

      try {
        if (user) {
          const response = await getUserDetails(user, true);

          if (response?.responseCode === 200) {
            const data = response;
            if (data) {
              const coreFieldData = data?.result?.userData;
              let fullName = "";

              if (coreFieldData?.firstName) {
                fullName += toPascalCase(coreFieldData.firstName);
              }
              
              if (coreFieldData?.middleName) {
                fullName += (fullName ? " " : "") + toPascalCase(coreFieldData.middleName);
              }
              
              if (coreFieldData?.lastName) {
                fullName += (fullName ? " " : "") + toPascalCase(coreFieldData.lastName);
              }
              
              setUserName(fullName);
              const fields: CustomField[] =
                data?.result?.userData?.customFields;
              if (fields?.length > 0) {
                setAddress(
                  extractAddress(
                    fields,
                    'STATES',
                    'DISTRICTS',
                    'BLOCKS',
                    'label',
                    'value',
                    toPascalCase
                  )
                );
              }
              const fieldIdToValueMap: { [key: string]: string } =
                mapFieldIdToValue(fields);

              const fetchFormData = async () => {
                try {
                  const response = await getFormRead(
                    FormContext.USERS,
                    FormContextType.STUDENT
                  );
                  if (response) {    


                    const mergeData = (
                      fieldIdToValueMap: { [key: string]: string },
                      response: any
                    ): any => {
                      response.fields.forEach(
                        (field: {
                          name: any;
                          fieldId: string | number;
                          value: string;
                          coreField: number;
                        }) => {
                          if (
                            field.fieldId &&
                            fieldIdToValueMap[field.fieldId]
                          ) {
                            // Update field value from fieldIdToValueMap if fieldId is available
                            field.value =
                              fieldIdToValueMap[field.fieldId] || '-';
                          } else if (field.coreField === 1) {
                            // Set field value from fieldIdToValueMap if coreField is 1 and fieldId is not in the map
                            field.value = coreFieldData[field.name] || '-';
                          }
                        }
                      );
                      return response;
                    };

                    const mergedProfileData = mergeData(
                      fieldIdToValueMap,
                      response
                    );
                    if (mergedProfileData) {
                      // const nameField = mergedProfileData.fields.find(
                      //   (field: { name: string }) => field.name === 'name'
                      // );
                      const customDataFields = mergedProfileData?.fields;
                      if (customDataFields?.length > 0) {
                        setCustomFieldsData(customDataFields);
                      }
                    }
                  } else {
                    console.log('No data Found');
                  }
                } catch (error) {
                  console.error('Error fetching form data:', error);
                }
              };
              fetchFormData();
            } else {
              setLoading(false);
              console.log('No data Found');
            }
          } else {
            console.log('No Response Found');
          }
        }
        setIsError(false);
      } catch (error) {
        setIsError(true);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
        console.error('Error fetching  user details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [reload]);

  const learnerDetailsByOrder = [...customFieldsData]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((field) => (field.order ?? 0) <= 12)
    ?.map((field) => {
      const getSelectedOption = (field: any) => {
        return (
          field?.options?.find(
            (option: any) => option?.value === field?.value?.[0]
          ) || '-'
        );
      };

      if (
        field.type === 'drop_down' ||
        field.type === 'radio' ||
        field.type === 'dropdown' ||
        (field.type === 'Radio' && field.options && field.value.length)
      ) {
        const selectedOption = getSelectedOption(field);
        return {
          ...field,
          displayValue:
            selectedOption !== '-'
              ? selectedOption.label
              : field?.value
                ? translateString(t, field?.value)
                : '-',
        };
      }
      return {
        ...field,
        displayValue: field?.value ? toPascalCase(field?.value) : '-',
      };
    });

  //------ Test Report API Integration------

  // const handleChangeTest = (event: SelectChangeEvent) => {
  //   const test = event?.target?.value;
  //   setTest(test);
  //   ReactGA.event('pre-post-test-selected', { testTypeSelected: test });
  //   getDoIdForAssessmentReport(test, subject);
  // };

  // const handleChangeSubject = (event: SelectChangeEvent) => {
  //   const subject = event?.target?.value;
  //   setSubject(event?.target?.value);
  //   ReactGA.event('select-subject-learner-details-page', {
  //     subjectSelected: subject,
  //   });
  //   getDoIdForAssessmentReport(test, subject);
  // };

  // const getDoIdForAssessmentReport = async (
  //   tests: string,
  //   subjects: string
  // ) => {
  //   // const stateName = localStorage.getItem('stateName');

  //   const stateName: any = address?.split(',')[0];
  //   const filters = {
  //     program: [Program],
  //     se_boards: [stateName ?? ''],
  //     subject: [subjects || subject],
  //     assessment1: tests || test,
  //   };
  //   try {
  //     if (stateName) {
  //       if (filters) {
  //         setLoading(true);
  //         const searchResults = await getDoIdForAssessmentDetails({ filters });

  //         if (searchResults?.responseCode === 'OK') {
  //           const result = searchResults?.result;
  //           if (result) {
  //             const QuestionSet = result?.QuestionSet?.[0];
  //             const getUniqueDoId = QuestionSet?.IL_UNIQUE_ID;
  //             setUniqueDoId(getUniqueDoId);
  //             testReportDetails(getUniqueDoId);
  //           } else {
  //             console.log('NO Result found from getDoIdForAssessmentDetails ');
  //           }
  //         }
  //       } else {
  //         console.log('NO Data found from getDoIdForAssessmentDetails ');
  //       }
  //     } else {
  //       console.log('NO State Found');
  //     }
  //     setIsError(false);
  //   } catch (error) {
  //     setIsError(true);
  //     showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
  //     console.error(
  //       'Error fetching getDoIdForAssessmentDetails results:',
  //       error
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const testReportDetails = async (do_Id: string) => {
  //   const cohortId = localStorage.getItem('classId');
  //   const filters = {
  //     userId: userId,
  //     courseId: do_Id,
  //     // batchId: cohortId, // user cohort id
  //     contentId: do_Id, // do_Id
  //   };
  //   const pagination = {
  //     pageSize: 1,
  //     page: 1,
  //   };
  //   const sort = {
  //     field: 'userId',
  //     order: 'asc',
  //   };

  //   if (do_Id) {
  //     const response = await getAssessmentList({
  //       sort,
  //       pagination,
  //       filters,
  //     });

  //     if (response?.responseCode === 200) {
  //       setLoading(true);
  //       const result = response.result;
  //       if (result) {
  //         setSubmittedOn(result[0]?.createdOn);
  //         setTotalMaxScore(result[0]?.totalMaxScore);
  //         setTotalScore(result[0]?.totalScore);
  //         const questionValues = getQuestionValues(result);
  //         setAssesmentData(questionValues?.questions); // Use the parsed questions
  //         setLoading(false);
  //       } else {
  //         setUniqueDoId('');
  //         console.log('No Data Found');
  //       }
  //     } else {
  //       setUniqueDoId('');
  //       console.log('getAssessmentList data', response?.response?.statusText);
  //     }
  //   } else {
  //     console.log('No Do Id Found');
  //   }
  // };

  // function getQuestionValues(response: any) {
  //   const questionValues: any = {
  //     totalMaxScore: 0,
  //     totalScore: 0,
  //     length: response.length,
  //     questions: [],
  //     totalQuestions: 0,
  //   };

  //   response.forEach((assessment: any) => {
  //     const assessmentSummary = JSON.parse(assessment.assessmentSummary);
  //     let questionNumber = 1;
  //     assessmentSummary?.forEach((section: any) => {
  //       section?.data?.forEach((question: any, index: number) => {
  //         const questionValue: any = {
  //           question: `Q${questionNumber}`,
  //           mark_obtained: question.score,
  //           totalMarks: question.item.maxscore,
  //         };
  //         questionValues.totalMaxScore += question.item.maxscore;
  //         questionValues.totalScore += question.score;
  //         questionValues.questions.push(questionValue);
  //         questionNumber++;
  //       });
  //     });
  //   });

  //   questionValues.totalQuestions = questionValues.questions.length;
  //   return questionValues;
  // }
  // questionValues
  // const questionValues = getQuestionValues(assesmentData);

  // all function call when page render
  // useEffect(() => {
  //   const class_Id = localStorage.getItem('classId') || '';
  //   setClassId(class_Id);

  //   // const today = new Date();
  //   const formatDate = (date: Date) => date.toISOString().split('T')[0];
  //   const toDay = formatDate(today);

  //   getAttendanceData(isFromDate, toDay);
  //   fetchUserDetails();
  //   // testReportDetails();
  //   getDoIdForAssessmentReport(test, subject);
  // }, [address]);

  const getLearnerAttendance = () => {
    router.push('/learner-attendance-history');
  };

  // //-------Edit Learner Profile------------------

  //----- code for Attendance Marked out of 7 days  ------------
  useEffect(() => {
    const getAttendanceMarkedDays = async () => {
      // const today = new Date();
      const todayFormattedDate = formatSelectedDate(new Date());
      const lastSeventhDayDate = new Date(
        today.getTime() - 6 * 24 * 60 * 60 * 1000
      );
      const lastSeventhDayFormattedDate = formatSelectedDate(
        new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
      );

      const endDay = today.getDate();
      const endDayMonth = today.toLocaleString('default', { month: 'long' });
      setCurrentDayMonth(`(${endDay} ${endDayMonth})`);
      const startDay = lastSeventhDayDate.getDate();
      const startDayMonth = lastSeventhDayDate.toLocaleString('default', {
        month: 'long',
      });
      if (startDayMonth === endDayMonth) {
        setDateRange(`(${startDay}-${endDay} ${endDayMonth})`);
      } else {
        setDateRange(`(${startDay} ${startDayMonth}-${endDay} ${endDayMonth})`);
      }

      const cohortAttendanceData: CohortAttendancePercentParam = {
        limit: AttendanceAPILimit,
        page: 0,
        filters: {
          scope: 'student',
          fromDate: lastSeventhDayFormattedDate,
          toDate: todayFormattedDate,
          contextId: classId,
        },
        facets: ['attendanceDate'],
        sort: ['present_percentage', 'asc'],
      };
      const res = await getCohortAttendance(cohortAttendanceData);
      const response = res?.data?.result?.attendanceDate;
      if (response) {
        setNumberOfDaysAttendanceMarked(Object.keys(response)?.length);
      } else {
        setNumberOfDaysAttendanceMarked(0);
      }
    };
    if (classId) {
      getAttendanceMarkedDays();
    }
  }, [
    classId,
    selectedValue ===
      t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
        date_range: dateRange,
      }),
  ]);

  const handleLearnerDelete = () => {
    setIsLearnerDeleted(true);
  };


  return (
    <>
      <Header />
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}

      <Grid container spacing={2} padding={'20px 18px'}>
        <Grid item>
          <Box
            onClick={() => {
              window.history.back();
              logEvent({
                action: 'back-button-clicked-learner-detail-page',
                category: 'Learner Detail Page',
                label: 'Back Button Clicked',
              });
            }}
          >
            <ArrowBackIcon
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '1.5rem',
                cursor: 'pointer',
                transform: isRTL ? ' rotate(180deg)' : 'unset',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Box>
            <Typography
              style={{
                letterSpacing: '0.1px',
                marginBottom: '2px',
              }}
              fontSize={'22px'}
              fontWeight={'400'}
              lineHeight={'28px'}
              color={theme.palette.warning['A200']}
            >
              {userName}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontSize: '12px',
              }}
            >
              {address}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box>
            {userDetails && isActiveYear && (
              <LearnersListItem
                type={Role.STUDENT}
                key={userId}
                userId={userId}
                learnerName={userName}
                cohortMembershipId={userDetails.cohortMembershipId}
                isDropout={userDetails.status === Status.DROPOUT}
                statusReason={userDetails.statusReason}
                reloadState={reloadState ?? false}
                setReloadState={setReloadState ?? (() => {})}
                onLearnerDelete={handleLearnerDelete}
                isFromProfile={true}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {isActiveYear && (
        <Box>
          <Box padding={'22px 18px'} className="linerGradient br-md-8">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '5px',
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.warning['300'],
                  fontWeight: 500,
                  fontSize: '14px',
                }}
                variant="h6"
                gutterBottom
              >
                {t('ATTENDANCE.ATTENDANCE_OVERVIEW')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Typography
                  sx={{
                    color: theme.palette.secondary.main,
                    marginRight: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                  variant="h6"
                  gutterBottom
                  onClick={getLearnerAttendance}
                >
                  {t('PROFILE.VIEW_DAY_WISE')}
                </Typography>
                <EastIcon
                  fontSize="inherit"
                  sx={{
                    color: theme.palette.secondary.main,
                    marginBottom: '5px',
                    transform: isRTL ? ' rotate(180deg)' : 'unset',
                    marginTop: '5px',
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: '10px' }}>
              <Box>
                <DateRangePopup
                  menuItems={menuItems}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                  onDateRangeSelected={handleDateRangeSelected}
                  dateRange={dateRange}
                />
              </Box>
            </Box>
            <Box
              sx={{
                // background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
                borderRadius: theme.spacing(3),
                boxShadow: 'none',
              }}
            >
              <Box sx={{ mt: 2 }}>
                {selectedValue ===
                  t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
                    date_range: dateRange,
                  }) || selectedValue === '' ? (
                  <Typography
                    color={theme.palette.warning['400']}
                    fontSize={'0.75rem'}
                    fontWeight={'500'}
                    // pt={'1rem'}
                  >
                    {t('ATTENDANCE.ATTENDANCE_MARKED_OUT_OF_DAYS', {
                      count: numberOfDaysAttendanceMarked,
                    })}
                  </Typography>
                ) : null}
                <Box
                  gap={1}
                  sx={{
                    bgcolor: 'transparent',
                    justifyContent: 'center',
                    display: 'flex',
                    marginTop: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StudentStatsCard
                        label1={t('COMMON.ATTENDANCE') + ' (%)'}
                        value1={`${Math.round(overallAttendance?.present_percentage || 0)}%`}
                        label2={false}
                        value2=""
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StudentStatsCard
                        label1={t('COMMON.CLASS_MISSED')}
                        value1={overallAttendance?.absent || 0}
                        label2={false}
                        value2=""
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        boxShadow={'none'}
        overflow={'auto'}
        sx={{
          background: 'linear-gradient(180deg, #FFFDF6 0%, #F8EFDA 100%)',
        }}
        p={'15px'}
      >
        <Typography
          fontWeight={'500'}
          fontSize={'16px'}
          lineHeight={'28px'}
          color={theme.palette.warning['A200']}
        >
          {t('PROFILE.LEARNER_DETAILS')}
        </Typography>

        <Box
        // sx={{
        //   '@media (min-width: 900px)': {
        //     display: 'flex',
        //     gap: '15px',
        //     flexDirection: 'row-reverse',
        //     alignItems: 'center',
        //   },
        // }}
        >
          {isActiveYear && (
            <Button
              sx={{
                fontSize: '14px',
                lineHeight: '20px',
                minWidth: 'fit-content',
                padding: '10px 24px 10px 16px',
                gap: '8px',
                borderRadius: '100px',
                marginTop: '10px',
                flex: '1',
                textAlign: 'center',
                color: theme.palette.warning.A200,
                border: `1px solid #4D4639`,
              }}
              onClick={handleOpenAddLearnerModal}
            >
              <Typography
                variant="h3"
                style={{
                  letterSpacing: '0.1px',
                  textAlign: 'left',
                  marginBottom: '2px',
                }}
                fontSize={'14px'}
                fontWeight={'500'}
                lineHeight={'20px'}
              >
                {t('PROFILE.EDIT_PROFILE')}
              </Typography>
              <Box>
                <CreateOutlinedIcon sx={{ fontSize: '14px' }} />
              </Box>
            </Button>
          )}

          {openAddLearnerModal && (
            <div>
              <AddLearnerModal
                open={openAddLearnerModal}
                onClose={handleCloseAddLearnerModal}
                formData={formData}
                isEditModal={true}
                userId={userId}
                onReload={handleReload}
                learnerEmailId={selectedUserEmail}
                learnerUserName={selectedUserUserName}
              />
            </div>
          )}

          <Box
            mt={2}
            sx={{
              flex: '1',
              border: '2px solid',
              borderColor: '#FFECB3',
              padding: '15px',
              // '@media (min-width: 900px)': {
              //   minWidth: '30%',
              //   width: '30%',
              // },
            }}
            minWidth={'100%'}
            borderRadius={'12px'}
            border={'1px'}
            bgcolor="warning.A400"
            display="flex"
            flexDirection="row"
            padding="15px"
          >
            <Grid container spacing={4}>
              {learnerDetailsByOrder?.map(
                (
                  item: {
                    label?: string;
                    displayValue?: string;
                    order?: number;
                  },
                  i: number
                ) => {
                  const labelText = item.label
                    ? t(`FORM.${item?.label?.toUpperCase()}`, item?.label)
                    : item?.label;

                  return (
                    <Grid item xs={6} key={i}>
                      {/* question */}
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.warning.main,
                        }}
                        margin={0}
                      >
                        {labelText}
                      </Typography>

                      {/* value */}
                      <Typography
                        variant="h4"
                        margin={0}
                        sx={{
                          wordBreak: 'break-word',
                          fontSize: '16px',
                          color: theme.palette.warning['A200'],
                        }}
                      >
                        {item?.displayValue}
                      </Typography>
                    </Grid>
                  );
                }
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
      {!isEliminatedFromBuild('AssessmentReport', 'component') &&
        AssessmentReport && isActiveYear && (
          <Box padding={2}>
            <Card
              sx={{
                borderRadius: theme.spacing(3),
                boxShadow: 'none',
                border: '1px solid #D0C5B4',
              }}
            >
              <CardContent>
                <AssessmentReport classId={cohortId} userId={userId} />
              </CardContent>
            </Card>
          </Box>
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withAccessControl(
  'accessLearnerProfile',
  accessControl
)(LearnerProfile);

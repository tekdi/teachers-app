import {
  ArrowBack as ArrowBackIcon,
  East as EastIcon,
} from '@mui/icons-material';
import {
  AssesmentListService,
  getDoIdForAssesmentDetails,
} from '@/services/AssesmentService';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { LearnerData, UserData, updateCustomField } from '@/utils/Interfaces';
import Menu, { MenuProps } from '@mui/material/Menu';
import React, { useEffect, useState } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { editEditUser, getUserDetails } from '@/services/ProfileService';

import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DateRangePopup from '@/components/DateRangePopup';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import MarksObtainedCard from '@/components/MarksObtainedCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Header from '../components/Header';
// import { formatDate, getTodayDate } from '../utils/Helper';
import StudentStatsCard from '@/components/StudentStatsCard';
import { classesMissedAttendancePercentList } from '@/services/AttendanceService';
import { format } from 'date-fns';
import { getTodayDate } from '@/utils/Helper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ToastMessage from '@/components/ToastMessage';

// import { UserData, updateCustomField } from '../utils/Interfaces';

interface QuestionValue {
  question: string;
  mark_obtained: number;
  totalMarks: number;
}
interface QuestionValues {
  totalMaxScore: number;
  totalScore: number;
  length: number;
  questions: QuestionValue[];
}
const LearnerProfile: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const router = useRouter();
  const { userId }: any = router.query;

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('learnerId', userId);
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  // const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<object>({});
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [currentDate, setCurrentDate] = React.useState(getTodayDate);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [selectedValue, setSelectedValue] = useState('');
  const [assesmentData, setAssesmentData] = useState<any>(null);
  const [questionData, setQuestionData] = useState([]);
  const [age, setAge] = React.useState('');
  const [test, setTest] = React.useState('Pre Test');
  const [subject, setSubject] = React.useState('English');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [customFieldsData, setCustomFieldsData] = useState<updateCustomField[]>(
    []
  );
  interface OverallAttendance {
    absent?: any; // Adjust the type according to your actual data
    present?: any;
    absent_percentage: any;
    present_percentage: any;
    // Add other properties as needed
  }
  const [isFromDate, setIsFromDate] = useState(getTodayDate());
  const [isToDate, setIsToDate] = useState(getTodayDate());
  const [submittedOn, setSubmitedOn] = useState();
  const [overallAttendance, setOverallAttendance] =
    useState<OverallAttendance>();
  const [selectedValue, setSelectedValue] = React.useState<string>(
    t('COMMON.AS_OF_TODAY')
  );
  const open = Boolean(anchorEl);
  const [totalMaxScore, setTotalMaxScore] = useState('');
  const [totalScore, setTotalScore] = useState('');

  const [unitName, setUnitName] = useState('');
  const [blockName, setBlockName] = useState('');
  const [uniqueDoId, setUniqueDoId] = useState('');
  const [anchorElOption, setAnchorElOption] =
    React.useState<null | HTMLElement>(null);
  const openOption = Boolean(anchorElOption);
  const [isError, setIsError] = React.useState<boolean>(false);

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const handleClickOption = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOption(event.currentTarget);
  };

  const handleCloseOption = () => {
    setAnchorElOption(null); // Set anchorElOption to null to close the menu
  };

  const handleDateRangeSelected = ({ fromDate, toDate }: any) => {
    setIsFromDate(fromDate);
    setIsToDate(toDate);
    getAttendaceData(fromDate, toDate);
    // Handle the date range values as needed
  };
  const menuItems = [
    t('COMMON.LAST_SEVEN_DAYS'),
    t('COMMON.AS_OF_TODAY'),
    t('COMMON.LAST_MONTH'),
    t('COMMON.LAST_SIX_MONTHS'),
    t('COMMON.CUSTOM_RANGE'),
  ];

  const getAttendaceData = async (fromDates: any, toDates: any) => {
    let fromDate = fromDates;
    let toDate = toDates;
    let filters = {
      // contextId: classId,
      fromDate,
      toDate,
      userId: userId,
      // scope: 'student',
    };
    const response = await classesMissedAttendancePercentList({
      filters,
      facets: ['userId'],
    });
    if (response?.statusCode === 200) {
      const userData = response?.data.result.userId[userId];
      setOverallAttendance(userData);

      // if (setOverallAttendance)
    }
  };

  // find Address
  const getFieldValue = (data: any, label: string) => {
    const field = data.find((item: any) => item.label === label);
    return field ? field.value[0] : null;
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
            const data = response?.result;
            if (data) {
              const userData = data?.userData;

              setUserData(userData);

              const customDataFields = userData?.customFields;
              if (customDataFields?.length > 0) {
                setCustomFieldsData(customDataFields);
                const unitName = getFieldValue(customDataFields, 'Unit Name');
                setUnitName(unitName);

                const blockName = getFieldValue(customDataFields, 'Block Name');
                setBlockName(blockName);

                setUserName(userData?.name);
                setContactNumber(userData?.mobile);
                setLoading(false);
              }
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
        setLoading(false);
        console.error('Error fetching  user details:', error);
      }
    }
  };

  // data by order to show on basic details

  // const learnerDetailsByOrder = [...customFieldsData]
  //   .sort((a, b) => a.order - b.order)
  //   .filter((field) => field.order <= 12);

  const learnerDetailsByOrder = [...customFieldsData]
    ?.sort((a, b) => a.order - b.order)
    ?.filter((field) => field.order <= 12)
    ?.map((field) => {
      if (
        field.type === 'drop_down' ||
        field.type === 'radio' ||
        field.type === 'dropdown' ||
        (field.type === 'Radio' && field.options && field.value.length)
      ) {
        const selectedOption = field?.options?.find(
          (option: any) => option.value === field.value[0]
        );
        return {
          ...field,
          displayValue: selectedOption ? selectedOption?.label : field.value[0],
        };
      }
      return {
        ...field,
        displayValue: field.value[0],
      };
    });

  // address find
  const address = [unitName, blockName, userData?.district]
    ?.filter(Boolean)
    ?.join(', ');

  //------ Test Report API Integration------

  const handleChangeTest = (event: SelectChangeEvent) => {
    const test = event.target.value;
    setTest(test);
    getDoIdForAssesmentReport(test, subject);
  };

  const handleChangeSubject = (event: SelectChangeEvent) => {
    const subject = event.target.value;
    setSubject(event.target.value);
    getDoIdForAssesmentReport(test, subject);
  };

  const getDoIdForAssesmentReport = async (tests: string, subjects: string) => {
    const steteName = localStorage.getItem('stateName');
    const filters = {
      program: ['Second chance'],
      se_boards: [steteName ? steteName : ''],
      subject: [subjects ? subjects : subject],
      assessment1: tests ? tests : test,
    };

    try {
      if (steteName) {
        if (filters) {
          const searchResults = await getDoIdForAssesmentDetails({ filters });

          if (searchResults?.responseCode === 'OK') {
            const result = searchResults?.result;
            if (result) {
              setLoading(true);

              const QuestionSet = result?.QuestionSet?.[0];
              const getUniqueDoId = QuestionSet?.IL_UNIQUE_ID;
              setUniqueDoId(getUniqueDoId);
              testReportDetails(getUniqueDoId);
              setLoading(false);
            } else {
              console.log('NO Result found from getDoIdForAssesmentDetails ');
            }
          }
        } else {
          console.log('NO Data found from getDoIdForAssesmentDetails ');
        }
      } else {
        console.log('NO State Found');
      }
      setIsError(false);
    } catch (error) {
      setIsError(true);
      console.error(
        'Error fetching getDoIdForAssesmentDetails results:',
        error
      );
    }
  };

  const testReportDetails = async (do_Id: string) => {
    const cohortId = localStorage.getItem('cohortId');
    let filters = {
      userId: userId,
      courseId: do_Id,
      batchId: cohortId, // user cohort id
      contentId: do_Id, // do_Id
    };
    let pagination = {
      pageSize: 1,
      page: 1,
    };
    let sort = {
      field: 'userId',
      order: 'asc',
    };

    if (do_Id) {
      const response = await AssesmentListService({
        sort,
        pagination,
        filters,
      });

      if (response?.responseCode === 200) {
        setLoading(true);
        const result = response.result;
        if (result) {
          setSubmitedOn(result[0]?.createdOn);
          setTotalMaxScore(result[0]?.totalMaxScore);
          setTotalScore(result[0]?.totalScore);
          const questionValues = getQuestionValues(result);
          setAssesmentData(questionValues?.questions); // Use the parsed questions
          setLoading(false);
        } else {
          setUniqueDoId('');
          console.log('No Data Found');
        }
      } else {
        setUniqueDoId('');
        console.log(
          'AssesmentListService data',
          response?.response?.statusText
        );
      }
    } else {
      console.log('No Do Id Found');
    }
  };

  function getQuestionValues(response: any) {
    const questionValues: any = {
      totalMaxScore: 0,
      totalScore: 0,
      length: response.length,
      questions: [],
      totalQuestions: 0,
    };

    response.forEach((assessment: any) => {
      const assessmentSummary = JSON.parse(assessment.assessmentSummary);
      let questionNumber = 1;
      assessmentSummary?.forEach((section: any) => {
        section?.data?.forEach((question: any, index: number) => {
          const questionValue: any = {
            question: `Q${questionNumber}`,
            mark_obtained: question.score,
            totalMarks: question.item.maxscore,
          };
          questionValues.totalMaxScore += question.item.maxscore;
          questionValues.totalScore += question.score;
          questionValues.questions.push(questionValue);
          questionNumber++;
        });
      });
    });

    questionValues.totalQuestions = questionValues.questions.length;
    return questionValues;
  }
  // questionValues
  // const questionValues = getQuestionValues(assesmentData);

  // all function call when page render
  useEffect(() => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    let toDay = formatDate(today);

    getAttendaceData(toDay, toDay);
    fetchUserDetails();
    // testReportDetails();
    getDoIdForAssesmentReport(test, subject);
  }, []);

  const getLearnerAttendance = () => {
    router.push('/learner-attendance-history');
  };

  //-------Edit Learner Profile------------------

  //fields  for edit popup by order

  const filteredSortedForEdit = [...customFieldsData]
    ?.filter((field) => field.isEditable)
    ?.sort((a, b) => a.order - b.order);

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [userName, setUserName] = useState<any | null>(null);
  const [contactNumber, setContactNumber] = useState<any | null>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
  const style = {
    position: 'absolute',
    top: '50%',
    maxWidth: 300, // Maximum width for responsiveness
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? 700 : 400,
    bgcolor: theme.palette.warning.A400,
    p: 4,
    textAlign: 'center',
    '@media (max-width: 768px)': {
      width: '95%', // Adjust width for smaller screens
      padding: '15px', // Adjust padding for smaller screens
    },
    height: '75vh',
  };

  const [formData, setFormData] = useState<{
    userData: LearnerData;
    customFields: { fieldId: string; type: string; value: string[] | string }[];
  }>({
    userData: {
      name: userName || '',
    },
    customFields: customFieldsData?.map((field) => ({
      fieldId: field.fieldId,
      type: field.type,
      value: field.value,
    })),
  });

  useEffect(() => {
    setFormData({
      userData: {
        name: userName || '',
      },
      customFields: customFieldsData?.map((field) => ({
        fieldId: field.fieldId,
        type: field.type,
        value: field.value,
      })),
    });
  }, [userData, customFieldsData]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId ? { ...field, value: [value] } : field
      ),
    }));
  };

  const handleCheckboxChange = (
    fieldId: string,
    optionName: string,
    isChecked: boolean
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId
          ? {
              ...field,
              value: isChecked
                ? [...(field.value as string[]), optionName]
                : (field.value as string[]).filter(
                    (item) => item !== optionName
                  ),
            }
          : field
      ),
    }));
  };

  const handleDropdownChange = (fieldId: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId ? { ...field, value: [value] } : field
      ),
    }));
  };

  const handleRadioChange = (fieldId: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      customFields: prevState.customFields.map((field) =>
        field.fieldId === fieldId ? { ...field, value: [value] } : field
      ),
    }));
  };

  const [hasErrors, setHasErrors] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z_ ]/g, '');

    setFormData((prevData) => ({
      ...prevData,
      userData: {
        ...prevData.userData,
        name: sanitizedValue,
      },
    }));

    setHasErrors(!sanitizedValue.trim());
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    const user_id = userId;
    const data = {
      userData: formData?.userData,
      customFields: formData?.customFields?.map((field) => ({
        fieldId: field.fieldId,
        // type: field.type,
        value: Array.isArray(field?.value)
          ? field?.value?.length > 0
            ? field?.value
            : ''
          : field?.value,
      })),
    };
    let userDetails = data;
    try {
      if (userId) {
        const response = await editEditUser(user_id, userDetails);

        if (response.responseCode !== 200 || response.params.err) {
          throw new Error(
            response.params.errmsg ||
              'An error occurred while updating the user.'
          );
        }

        handleClose();

        console.log(response.params.successmessage);
        fetchUserDetails();
        setIsError(false);
        setLoading(false);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error:', error);
    }
  };

  const FieldComponent = ({
    data,
    label,
    size,
  }: {
    data: any;
    label: string;
    size: number;
  }) => (
    <Grid item xs={size}>
      {/* question */}
      <Typography variant="h4" sx={{ fontSize: '12px' }} margin={0}>
        {label}
      </Typography>

      {/* value */}
      <Typography
        variant="h4"
        margin={0}
        sx={{
          wordBreak: 'break-word',
          fontSize: '16px',
        }}
        color={theme.palette.warning['A200']}
      >
        {data}
      </Typography>
    </Grid>
  );

  let contactNumberAdded = false;
  return (
    <>
      <Header />
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}

      <Grid container spacing={2} alignItems="flex-start" padding={'20px 18px'}>
        <Grid item>
          <Box onClick={() => window.history.back()}>
            <ArrowBackIcon
              sx={{
                color: (theme.palette.warning as any)['A200'],
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Box>
            <Typography
              style={{
                letterSpacing: '0.1px',
                textAlign: 'left',
                marginBottom: '2px',
              }}
              fontSize={'22px'}
              fontWeight={'400'}
              lineHeight={'28px'}
              color={theme.palette.warning['A200']}
            >
              {userData?.name}
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
          <Box
            aria-label="more"
            id="demo-customized-button"
            aria-controls={openOption ? 'demo-customized-menu' : undefined}
            aria-expanded={openOption ? 'true' : undefined}
            aria-haspopup="true"
          >
            {/* ---- comment for temp------------
             <Box onClick={handleClickOption}>
              <MoreVertIcon />
            </Box> */}

            <Box>
              {/* <Button
                id="demo-customized-button"
                aria-controls={openOption ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openOption ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClickOption}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Options
              </Button> */}

              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorElOption}
                open={openOption}
                onClose={handleCloseOption}
              >
                <MenuItem onClick={handleCloseOption} disableRipple>
                  {t('COMMON.MARK_DROP_OUT')}
                </MenuItem>
                <MenuItem onClick={handleCloseOption} disableRipple>
                  {t('COMMON.REMOVE')}
                </MenuItem>
              </StyledMenu>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box padding={'22px 18px'} className="linerGradient">
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}
        >
          <Typography
            sx={{
              color: (theme.palette.warning as any)['300'],
              fontWeight: 500,
              fontSize: '14px',
            }}
            variant="h6"
            gutterBottom
          >
            {t('ATTENDANCE.ATTENDANCE_OVERVIEW')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              }}
            />
          </Box>
        </Box>

        <Box>
          <Box>
            <DateRangePopup
              menuItems={menuItems}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              onDateRangeSelected={handleDateRangeSelected}
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
            {/* <Typography
              sx={{
                color: '#7C766F',
              }}
              fontSize={'12px'}
              fontWeight={'500'}
              lineHeight={'16px'}
            >
              Attendance Marked : 3 out of last 7 days
            </Typography>  */}
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
                    label1={t('COMMON.ATTENDANCE') + '%'}
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
        <Button
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            minWidth: '100%',
            padding: '10px 24px 10px 16px',
            gap: '8px',
            borderRadius: '100px',
            marginTop: '10px',
            flex: '1',
            textAlign: 'center',
            color: theme.palette.warning.A200,
            border: `1px solid ${theme.palette.warning.A200}`,
            borderColor: theme.palette.warning['A100'],
          }}
          onClick={handleOpen}
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
        <Box
          mt={2}
          sx={{
            flex: '1',
            border: '2px solid',
            borderColor: '#FFECB3',
            padding: '15px',
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
            <FieldComponent
              size={12}
              label={t('PROFILE.FULL_NAME')}
              data={userName}
            />

            {learnerDetailsByOrder &&
              learnerDetailsByOrder.map((item: any, i: number) => (
                <React.Fragment key={i}>
                  <Grid item xs={6}>
                    {/* question */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: '12px',
                        color: theme.palette.warning.main,
                      }}
                      margin={0}
                    >
                      {item?.label && item.name
                        ? t(`FIELDS.${item.name.toUpperCase()}`, item.label)
                        : item.label}
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

                  {item?.order === 3 && !contactNumberAdded && (
                    <React.Fragment>
                      <FieldComponent
                        size={6}
                        label={'Contact Number'}
                        data={contactNumber}
                      />
                      {(contactNumberAdded = true)}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
          </Grid>
        </Box>
      </Box>

      <Box padding={2}>
        <Card
          sx={{
            borderRadius: theme.spacing(3),
            boxShadow: 'none',
            border: '1px solid #D0C5B4',
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: (theme.palette.warning as any)['A200'],
                fontWeight: 600,
                fontSize: '13px',
              }}
              variant="h5"
              gutterBottom
            >
              {t('COMMON.TEST_REPORT')}
            </Typography>
            <Box padding={0}>
              <FormControl fullWidth sx={{ margin: 1, marginLeft: 0 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  {t('PROFILE.TEST')}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={test}
                  label="test"
                  onChange={handleChangeTest}
                >
                  <MenuItem value={'Post Test'}>
                    {t('PROFILE.POST_TEST')}
                  </MenuItem>
                  <MenuItem value={'Pre Test'}>
                    {t('PROFILE.PRE_TEST')}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ margin: 1, marginLeft: 0 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  {t('PROFILE.SUBJECT')}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={subject}
                  label="Subject"
                  onChange={handleChangeSubject}
                >
                  <MenuItem value={'English'}>{t('PROFILE.ENGLISH')}</MenuItem>
                  <MenuItem value={'Math'}>{t('PROFILE.MATH')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {uniqueDoId ? (
              <Box
                sx={{
                  background: '#F8EFE7',
                  p: 2,
                }}
              >
                <Box>
                  <Typography variant="h5">
                    {t('PROFILE.SUBMITTED_ON')} :{' '}
                    {submittedOn
                      ? format(new Date(submittedOn), 'dd MMMM, yyyy')
                      : ''}
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={1}>
                  <Typography variant="h3" fontWeight={'bold'}>
                    {t('PROFILE.MARK_OBTAINED')}
                  </Typography>
                  <Typography variant="h4" fontWeight={'bold'}>
                    {totalScore ? totalScore : '0'}/
                    {totalMaxScore ? totalMaxScore : '0'}
                  </Typography>
                </Box>
                <Divider />
                <Box mt={1}>
                  <Typography variant="h5">
                    {t('PROFILE.TOTAL_QUESTIONS')} :{assesmentData?.length}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <MarksObtainedCard data={assesmentData} />
                </Box>
              </Box>
            ) : (
              <Box mt={2}>
                <Typography textAlign={'center'}>
                  {t('COMMON.NO_DATA_FOUND')}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Modal
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal"
        aria-describedby="edit-profile-description"
      >
        <Box
          sx={style}
          gap="10px"
          display="flex"
          flexDirection="column"
          borderRadius={'1rem'}
        >
          {loading && (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h2"
              style={{
                textAlign: 'left',
                color: theme.palette.warning.A200,
              }}
            >
              {t('PROFILE.EDIT_PROFILE')}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              style={{
                justifyContent: 'flex-end',
              }}
            >
              <CloseIcon cursor="pointer" />
            </IconButton>
          </Box>
          <Box
            style={{
              overflowY: 'auto',
            }}
            id="modal-modal-description"
          >
            {/* <Box
              sx={{
                flex: '1',
                textAlign: 'center',
                marginLeft: '5%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              borderRadius={'12px'}
              border={'1px'}
              bgcolor={theme.palette.warning.A400}
              display="flex"
              flexDirection="column"
            >
              <Image
                src={user_placeholder_img}
                alt="user"
                height={100}
                width={100}
                style={{ alignItems: 'center' }}
              />

              <Box>
                <input
                  id=""
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Button
                  sx={{
                    minWidth: '100%',
                    padding: '10px 24px 10px 16px',
                    borderRadius: '12px',
                    marginTop: '10px',
                    flex: '1',
                    textAlign: 'center',
                    border: '1px solid ',
                  }}
                  disabled // commment for temp
                  onClick={handleClickImage}
                >
                  {t('PROFILE.UPDATE_PICTURE')}
                </Button>
              </Box>
            </Box> */}
            <TextField
              sx={{ marginTop: '20px' }}
              fullWidth
              name="name"
              label={t('PROFILE.FULL_NAME')}
              variant="outlined"
              value={formData.userData.name}
              inputProps={{
                pattern: '^[A-Za-z_ ]+$', // Only allow letters, underscores, and spaces
                title: t('PROFILE.AT_REQUIRED_LETTER'),
                required: true,
              }}
              error={!formData.userData.name.trim()} // Show error if the input is empty
              helperText={
                !formData.userData.name.trim() && t('PROFILE.ENTER_NAME')
              }
              onChange={handleInputChange}
            />

            {filteredSortedForEdit
              ?.filter((field) => field.isEditable)
              ?.map((field) => (
                <Grid item xs={12} key={field.fieldId}>
                  {field.type === 'text' ? (
                    <TextField
                      type="text"
                      sx={{ marginTop: '20px' }}
                      fullWidth
                      name={field.name}
                      // label={field.label}
                      label={
                        field?.label && field.name
                          ? t(`FIELDS.${field.name.toUpperCase()}`, field.label)
                          : field.label
                      }
                      variant="outlined"
                      inputProps={{
                        pattern: '^[A-Za-z_ ]+$', // Only allow letters, underscores, and spaces
                        title: 'At least one letter or underscore is required',
                        required: true,
                      }}
                      value={
                        formData.customFields.find(
                          (f) => f.fieldId === field.fieldId
                        )?.value[0] || ''
                      }
                      onChange={(e) => {
                        handleFieldChange(field.fieldId, e.target.value);
                      }}
                    />
                  ) : field.type === 'numeric' ? (
                    <TextField
                      type="number"
                      sx={{ marginTop: '20px' }}
                      fullWidth
                      name={field.name}
                      // label={field.label}
                      label={
                        field?.label && field.name
                          ? t(`FIELDS.${field.name.toUpperCase()}`, field.label)
                          : field.label
                      }
                      variant="outlined"
                      value={
                        formData.customFields.find(
                          (f) => f.fieldId === field.fieldId
                        )?.value[0] || ''
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d{0,4}$/.test(inputValue)) {
                          handleFieldChange(field.fieldId, inputValue);
                        }
                      }}
                    />
                  ) : field.type === 'checkbox' ? (
                    <Box marginTop={3}>
                      <Typography
                        textAlign={'start'}
                        variant="h4"
                        margin={0}
                        color={theme.palette.warning.A200}
                      >
                        {field?.label && field.name
                          ? t(`FIELDS.${field.name.toUpperCase()}`, field.label)
                          : field.label}
                        {/* {field.label} */}
                      </Typography>
                      {field.options?.map((option: any) => (
                        <FormGroup key={option.value}>
                          <FormControlLabel
                            sx={{ color: theme.palette.warning[300] }}
                            control={
                              <Checkbox
                                color="default"
                                checked={(
                                  formData?.customFields.find(
                                    (f) => f.fieldId === field.fieldId
                                  )?.value || []
                                )?.includes(option.value)}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    field.fieldId,
                                    option.value,
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={option.label}
                          />
                        </FormGroup>
                      ))}
                    </Box>
                  ) : field.type === 'drop_down' ||
                    field.type === 'dropdown' ? (
                    <Box marginTop={3} textAlign={'start'}>
                      <FormControl fullWidth>
                        <InputLabel id={`select-label-${field.fieldId}`}>
                          {field?.label && field.name
                            ? t(
                                `FIELDS.${field.name.toUpperCase()}`,
                                field.label
                              )
                            : field.label}
                          {/* {field.label} */}
                        </InputLabel>
                        <Select
                          labelId={`select-label-${field.fieldId}`}
                          id={`select-${field.fieldId}`}
                          value={
                            formData?.customFields?.find(
                              (f) => f.fieldId === field.fieldId
                            )?.value[0] || ''
                          }
                          // label={field.label}
                          label={
                            field?.label && field.name
                              ? t(
                                  `FIELDS.${field.name.toUpperCase()}`,
                                  field.label
                                )
                              : field.label
                          }
                          onChange={(e) =>
                            handleDropdownChange(field.fieldId, e.target.value)
                          }
                        >
                          {field?.options?.map((option: any) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : field.type === 'radio' || field.type === 'Radio' ? (
                    <Box marginTop={3}>
                      <Typography
                        textAlign={'start'}
                        variant="h4"
                        margin={0}
                        color={theme.palette.warning.A200}
                      >
                        {field?.label && field.name
                          ? t(`FIELDS.${field.name.toUpperCase()}`, field.label)
                          : field.label}
                        {/* {field.label} */}
                      </Typography>
                      <RadioGroup
                        name={field.fieldId}
                        value={
                          formData?.customFields.find(
                            (f) => f.fieldId === field.fieldId
                          )?.value[0] || ''
                        }
                        onChange={(e) =>
                          handleRadioChange(field.fieldId, e.target.value)
                        }
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          color={theme.palette.warning.A200}
                        >
                          {field?.options?.map((option: any) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio color="default" />}
                              label={option.label}
                            />
                          ))}
                        </Box>
                      </RadioGroup>
                    </Box>
                  ) : null}
                </Grid>
              ))}
            <Box></Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              sx={{
                minWidth: '100%',
                color: theme.palette.warning.A200,
                boxShadow: 'none',
              }}
              onClick={handleSubmit}
              variant="contained"
              disabled={hasErrors}
            >
              {t('COMMON.SAVE')}
            </Button>
          </Box>
        </Box>
      </Modal>
      {isError && <ToastMessage message={t('COMMON.SOMETHING_WENT_WRONG')} />}
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

export default LearnerProfile;

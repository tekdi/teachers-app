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
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import React, { useEffect, useState } from 'react';
import { UserData, updateCustomField } from '@/utils/Interfaces';
import { alpha, styled, useTheme } from '@mui/material/styles';

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DateRangePopup from '@/components/DateRangePopup';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import MarksObtainedCard from '@/components/MarksObtainedCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import Header from '../components/Header';
// import { formatDate, getTodayDate } from '../utils/Helper';
import StudentStatsCard from '@/components/StudentStatsCard';
import { classesMissedAttendancePercentList } from '@/services/AttendanceService';
// import { Link, useParams } from 'react-router-dom';
import { getTodayDate } from '@/utils/Helper';
import { getUserDetails } from '@/services/ProfileService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

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

  const [userData, setUserData] = useState<UserData | null>(null);
  // const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<object>({});
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [currentDate, setCurrentDate] = React.useState(getTodayDate);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [selectedValue, setSelectedValue] = useState('');
  const [assesmentData, setAssesmentData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [age, setAge] = React.useState('');
  const [test, setTest] = React.useState('Pre Test');
  const [subject, setSubject] = React.useState('English');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
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

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [unitName, setUnitName] = useState('');
  const [blockName, setBlockName] = useState('');
  const [uniqueDoId, setUniqueDoId] = useState('');
  const [anchorElOption, setAnchorElOption] =
    React.useState<null | HTMLElement>(null);
  const openOption = Boolean(anchorElOption);

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
    t('COMMON.AS_OF_LAST_WEEK'),
    t('COMMON.LAST_MONTH'),
    t('COMMON.LAST_SIX_MONTHS'),
    t('COMMON.CUSTOM_RANGE'),
  ];

  const getAttendaceData = async (fromDates: any, toDates: any) => {
    console.log('dates', fromDates, toDates);
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
      console.log('response for userData', response?.data?.result);
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
    if (typeof window !== 'undefined' && window.localStorage) {
      const user: any = userId;

      try {
        if (user) {
          const response = await getUserDetails(user, true);

          console.log('response userId', response);
          if (response?.responseCode === 200) {
            const data = response?.result;
            console.log('data', data);
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
              }
            } else {
              console.log('No data Found');
            }
          } else {
            console.log('No Response Found');
          }
        }
      } catch (error) {
        console.error('Error fetching  user details:', error);
      }
    }
  };

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
      if (filters) {
        const searchResults = await getDoIdForAssesmentDetails({ filters });

        if (searchResults?.responseCode === 'OK') {
          const result = searchResults?.result;
          if (result) {
            const QuestionSet = result?.QuestionSet?.[0];
            const getUniqueDoId = QuestionSet?.IL_UNIQUE_ID;
            setUniqueDoId(getUniqueDoId);
            console.log('results:', getUniqueDoId);
            testReportDetails(getUniqueDoId);
          } else {
            console.log('NO Result found from getDoIdForAssesmentDetails ');
          }
        }
      } else {
        console.log('NO Data found from getDoIdForAssesmentDetails ');
      }
    } catch (error) {
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

    const response = await AssesmentListService({ sort, pagination, filters });
    console.log('statusCode', response?.response);
    if (response?.response?.status === 200) {
      if (response) {
        const result = response?.result;
        if (result?.length > 0) {
          const data = result;
          setSubmitedOn(data?.createdOn);
          setAssesmentData(data);
          console.log('Data', data);
        } else {
        }
      } else {
        console.log('No Data Found');
      }
    } else {
      setUniqueDoId('');
      console.log('AssesmentListService data', response?.response?.statusText);
    }
  };

  function getQuestionValues(data: any) {
    const questionValues: any = {
      totalMaxScore: 0,
      totalScore: 0,
      length: data.length,
      questions: [],
      totalQuestions: 0,
    };

    data?.forEach((item: any) => {
      item?.assessmentSummary?.forEach((summary: any) => {
        let questionNumber = 1;
        summary?.data?.forEach((question: any) => {
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
  const questionValues = getQuestionValues(assesmentData);

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

  return (
    <>
      <Header />

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
              variant="h3"
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontSize: '22px',
              }}
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
            <Box onClick={handleClickOption}>
              <MoreVertIcon />
            </Box>

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
                  Mark as Drop Out
                </MenuItem>
                <MenuItem onClick={handleCloseOption} disableRipple>
                  Remove
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
            <Typography
              sx={{
                color: '#7C766F',
              }}
              fontSize={'12px'}
              fontWeight={'500'}
              lineHeight={'16px'}
            >
              Attendance Marked : 3 out of last 7 days
            </Typography>
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
                    label1="Attendance %"
                    value1={`${Math.round(overallAttendance?.present_percentage || 0)}%`}
                    label2={false}
                    value2="5"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StudentStatsCard
                    label1="Class missed"
                    value1={overallAttendance?.absent || 0}
                    label2={false}
                    value2="5"
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
          sx={{ color: '#4D4639' }}
        >
          {t('PROFILE.LEARNER_DETAILS')}
        </Typography>
        <Button
          sx={{
            minWidth: '100%',
            padding: '10px 24px 10px 16px',
            gap: '8px',
            borderRadius: '20px',
            marginTop: '10px',
            flex: '1',
            textAlign: 'center',
            color: 'black',
            border: '1px solid black',
            borderColor: 'black',
            backgroundColor: 'warning.A400',
            '&:hover': {
              backgroundColor: 'warning.A400',
            },
          }}
          startIcon={<CreateOutlinedIcon />}
          onClick={handleOpenEdit}
        >
          {t('PROFILE.EDIT_PROFILE')}
        </Button>
        <Box
          mt={2}
          sx={{
            flex: '1',
            border: '2px solid',
            borderColor: '#FFECB3',
            padding: '10px',
          }}
          minWidth={'100%'}
          borderRadius={'12px'}
          border={'1px'}
          bgcolor="warning.A400"
          display="flex"
          flexDirection="row"
        >
          <Grid container spacing={4}>
            {customFieldsData &&
              customFieldsData?.map((item: any, i: number) => (
                <Grid item xs={6} key={i}>
                  {/*  question */}
                  <Typography variant="h4" margin={0}>
                    {item?.label}
                  </Typography>

                  {/* value  */}
                  <Typography
                    variant="h4"
                    margin={0}
                    sx={{
                      wordBreak: 'break-word',
                    }}
                    color={'#4D4639'}
                  >
                    {item?.value}
                  </Typography>
                </Grid>
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
            <Box>
              <FormControl fullWidth sx={{ m: 1, gap: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Test
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={test}
                  label="test"
                  onChange={handleChangeTest}
                >
                  {/* <MenuItem value="">
                    <em>Select Value</em>
                  </MenuItem> */}
                  <MenuItem value={'Post Test'}>Post Test</MenuItem>
                  <MenuItem value={'Pre Test'}>Pre Test</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1, gap: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Subject
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={subject}
                  label="Subject"
                  onChange={handleChangeSubject}
                >
                  {/* <MenuItem value="">
                    <em>Select Value</em>
                  </MenuItem> */}
                  <MenuItem value={'English'}>English</MenuItem>
                  <MenuItem value={'Math'}>Math</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {uniqueDoId ? (
              <Box
                sx={{
                  background:
                    'linear-gradient(180deg, #FFFDF6 0%, #F8EFDA 100%)',
                  p: 2,
                }}
              >
                <Box>
                  <Typography variant="h5">
                    {t('PROFILE.SUBMITTED_ON')} : {submittedOn}
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={1}>
                  <Typography variant="h3" fontWeight={'bold'}>
                    {t('PROFILE.MARK_OBTAINED')}
                  </Typography>
                  <Typography variant="h4" fontWeight={'bold'}>
                    {/* 60/70 */}
                  </Typography>
                </Box>
                <Divider />
                <Box mt={1}>
                  <Typography variant="h5">
                    {t('PROFILE.TOTAL_QUESTIONS')} :
                    {questionValues?.questions?.length}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <MarksObtainedCard data={questionValues?.questions} />
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

      {/* <Modal
        open={openModal}
        onClose={handleCloseModal}
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
          <Box>
            <Grid container>
              <Grid item xs={6}>
                <Typography textAlign={'left'}>{t('DATA_RANAGE')}</Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <CloseIcon onClick={handleCloseModal} />
              </Grid>
            </Grid>
          </Box>
          <Divider sx={dividerStyle} />
          <MenuList dense>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                selected={selectedIndex === index}
                // onClick={() => handleMenuItemClick(index, item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '32px',
                }}
              >
                {selectedIndex === index && (
                  <ListItemIcon
                    sx={{
                      position: 'absolute',
                      left: '8px',
                      minWidth: 'auto',
                    }}
                  >
                    <Check fontSize="small" />
                  </ListItemIcon>
                )}
                {item}
              </MenuItem>
            ))}
          </MenuList>
          <Divider sx={dividerStyle} />
          <Button variant="contained">Apply</Button>
        </Box>
      </Modal> */}
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

import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
  Divider,
  Grid,
  IconButton,
  Modal,
  useMediaQuery,
  Button,
  List,
  ListItemButton,
  ListItemText,
  MenuList,
  ListItemIcon,
  TextField,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check,
  East as EastIcon,
} from '@mui/icons-material';
import { useTheme, Theme } from '@mui/material/styles';

import { useTranslation } from 'next-i18next';
// import { UserData, updateCustomField } from '../utils/Interfaces';

// import Header from '../components/Header';
// import { formatDate, getTodayDate } from '../utils/Helper';
import StudentStatsCard from '@/components/StudentStatsCard';
import CustomSelect from '@/components/CustomSelect';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { getUserDetails } from '@/services/ProfileService';
import WeekDays from '@/components/WeekDays';
import MarksObtainedCard from '@/components/MarksObtainedCard';
import { AssesmentListService } from '@/services/AssesmentService';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { formatDate, getTodayDate } from '@/utils/Helper';
import { GetStaticPaths } from 'next';
import { UserData, updateCustomField } from '@/utils/Interfaces';

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
  const { userId } = router.query;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<any>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<object>({});
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [currentDate, setCurrentDate] = React.useState(getTodayDate);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [assesmentData, setAssesmentData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [age, setAge] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [customFieldsData, setCustomFieldsData] = useState<updateCustomField[]>(
    []
  );
  const [submittedOn, setSubmitedOn] = useState();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    // set""AnchorEl(event.currentTarget);
    alert('drawer');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  //   const handleListItemClick = (
  //     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //     index: Number
  //   ) => {
  //     setSelectedIndex(index);
  //   };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const dividerStyle = {
    width: '100%', // Make the divider full width
    marginBottom: '10px', // Optional: Add some spacing below the divider
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? 500 : 400,
    bgcolor: 'warning.A400',
    p: 4,
    textAlign: 'center',
    height: 'auto',
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  const handleChangeSubject = (event: SelectChangeEvent) => {
    setSubject(event.target.value);
  };

  const handleMenuItemClick = (index: any, value: any) => {
    setSelectedIndex(index);
    setSelectedValue(value);
    console.log('Selected Value:', value); // You can use this value as needed
  };

  const menuItems = [
    'Last 7 Days(18 - 25 may)',
    'As Of Today, 25 may',
    'Last Month',
    'Last 6 Month',
    'Custom Range',
  ];

  const fetchUserDetails = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user: any = userId;

      try {
        if (user) {
          const response = await getUserDetails(user, true);

          if (response?.statusCode === 200) {
            const data = response?.data;
            if (data) {
              const userData = data?.userData;

              setUserData(userData);
              console.log('userData', userData);
              const customDataFields = userData?.customFields;
              if (customDataFields?.length > 0) {
                setCustomFieldsData(customDataFields);
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

  const testReportDetails = async () => {
    let filters = {
      userId: '4bc64b4d-c3c6-4a23-b9f3-15c70ed8ffb6',
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
  };

  function getQuestionValues(data: any) {
    const questionValues: any = {
      totalMaxScore: 0,
      totalScore: 0,
      length: data.length,
      questions: [],
    };

    data.forEach((item: any) => {
      item.assessmentSummary?.forEach((summary: any) => {
        const parsedData = JSON.parse(summary.data);
        let questionNumber = 1;
        parsedData.forEach((section: any) => {
          section.data.forEach((question: any, index: any) => {
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
    });

    return questionValues;
  }

  // Usage example
  const questionValues = getQuestionValues(assesmentData);

  useEffect(() => {
    fetchUserDetails();
    testReportDetails();
  }, []);

  const handleGoBack = () => {
    router.push('/attendance-overview');
  };

  return (
    <>
      <Header />
      <Grid container spacing={2} alignItems="flex-start" mt={3}>
        <Grid item>
          <Button onClick={handleGoBack}>
            <ArrowBackIcon
              sx={{
                color: (theme.palette.warning as any)['A200'],
                fontSize: '1.5rem',
              }}
            />
          </Button>
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
              {userData?.district}
              {userData?.state}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Box
        padding={2}
        sx={{ background: 'linear-gradient(180deg, #FFFDF6 0%, #F8EFDA 100%)' }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              color: (theme.palette.warning as any)['A200'],
              fontWeight: 500,
              fontSize: '15px',
            }}
            variant="h6"
            gutterBottom
          >
            Attendance Overview
          </Typography>
          <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                color: theme.palette.secondary.main,
                marginRight: '4px',
                fontSize: '14px',
              }}
              variant="h6"
              gutterBottom
            >
              View Day-Wise
            </Typography>
            <EastIcon
              fontSize="inherit"
              sx={{
                color: theme.palette.secondary.main,
                marginBottom: '5px',
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item sx={{ flex: 1 }}>
            <FormControl fullWidth sx={{ m: 1 }}>
              <Select
                sx={{ height: '32px' }}
                value={selectedValue}
                displayEmpty
                onClick={handleOpenModal}
                inputProps={{ readOnly: true }}
              >
                <MenuItem value="" disabled>
                  Select an option
                </MenuItem>
                <MenuItem value={selectedValue}>
                  {selectedValue ? selectedValue : 'Select an option'}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Card
          sx={{
            background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
            borderRadius: theme.spacing(3),
            boxShadow: 'none',
          }}
        >
          <CardContent>
            <Typography> {t('COMMON.OVERALL_ATTENDANCE')}</Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
                fontWeight: 500,
              }}
              variant="h6"
              gutterBottom
            >
              {'As of today' + ' ' + formatDate(currentDate)}
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
              <Grid container display={'flex'} justifyContent={'space-between'}>
                <Grid item xs={5}>
                  <StudentStatsCard
                    label1="Attendance %"
                    value1={`${Math.round(attendanceReport?.average?.average_attendance_percentage || 0)}%`}
                    label2={false}
                    value2="5"
                  />
                </Grid>
                <Grid item xs={5}>
                  <StudentStatsCard
                    label1="Class missed"
                    value1={'6'}
                    label2={false}
                    value2="5"
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        boxShadow={'none'}
        mt={'10px'}
        overflow={'auto'}
        sx={{
          background: 'linear-gradient(180deg, #FFFDF6 0%, #F8EFDA 100%)',
        }}
        p={'15px'}
      >
        <Typography
          fontWeight={'500'}
          fontSize={'16px'}
          sx={{ color: theme.palette.warning.main }}
        >
          Learner Details
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
            // bgcolor: theme.palette.secondary.light,
            // background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
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
                {' '}
                {/* Adjusted minWidth here */}
                <InputLabel id="demo-simple-select-helper-label">
                  Test
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select Value</em>
                  </MenuItem>
                  <MenuItem value={'test'}>Test</MenuItem>
                  <MenuItem value={'pre_test'}>Pre Test</MenuItem>
                  <MenuItem value={'post_test'}>Post Test</MenuItem>
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
                  <MenuItem value="">
                    <em>Select Value</em>
                  </MenuItem>
                  <MenuItem value={'test'}>English</MenuItem>
                  <MenuItem value={'pre_test'}>Marathi</MenuItem>
                  <MenuItem value={'post_test'}>Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                background: 'linear-gradient(180deg, #FFFDF6 0%, #F8EFDA 100%)',
                p: 2,
              }}
            >
              {/* {assesmentData && assesmentData?.map((item, i) => {})}{' '} */}
              <Box>
                <Typography variant="h5">
                  Submitted On : {submittedOn}
                </Typography>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'} mt={1}>
                <Typography variant="h3" fontWeight={'bold'}>
                  Mark Obtained
                </Typography>
                <Typography variant="h4" fontWeight={'bold'}>
                  60/70
                </Typography>
              </Box>
              <Divider />
              <Box mt={1}>
                <Typography variant="h5">Total Questions : 15</Typography>
              </Box>
              <Box mt={2}>
                <MarksObtainedCard data={questionValues?.questions} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Modal
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
                onClick={() => handleMenuItemClick(index, item)}
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
      </Modal>
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

import Header from '@/components/Header';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import EastIcon from '@mui/icons-material/East';
import HorizontalLinearStepper from '@/components/HorizontalLinearStepper';
import PieChartGraph from '@/components/PieChartGraph';
import { boardEnrollment } from '@/services/BoardEnrollmentServics';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import { ICohort, user } from '@/utils/Interfaces';
import { toPascalCase } from '@/utils/Helper';
import { showToastMessage } from '@/components/Toastify';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import CenterSessionModal from '@/components/CenterSessionModal';
import SortingModal from '@/components/SortingModal';

const BoardEnrollment = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const [boardEnrollmentList, setBoardEnrollmentList] = useState<any>([]);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [blockName, setBlockName] = React.useState<string>('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<user>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const res = boardEnrollment();
    setBoardEnrollmentList(res);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setClassId(localStorage.getItem('classId') ?? '');
      const classId = localStorage.getItem('classId') ?? '';
      localStorage.setItem('cohortId', classId);
      setLoading(false);
      if (token) {
        router.push('/board-enrollment');
      } else {
        router.push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (classId) {
          const limit = 300;
          const page = 0;
          const filters = { cohortId: classId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.userDetails || [];

          if (resp) {
            const selectedDateStart = new Date();
            selectedDateStart.setHours(0, 0, 0, 0);
            const nameUserIdArray = resp
              .filter((entry: any) => {
                const createdAtDate = new Date(entry.createdAt);
                createdAtDate.setHours(0, 0, 0, 0);
                return createdAtDate <= selectedDateStart;
              })
              .map((entry: any) => ({
                userId: entry.userId,
                name: toPascalCase(entry.name),
                memberStatus: entry.status,
                createdAt: entry.createdAt,
              }));
            console.log(`nameUserIdArray`, nameUserIdArray);
            setDisplayStudentList(nameUserIdArray);
          } else {
            setDisplayStudentList([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getCohortMemberList();
  }, [classId]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          px: '16px',
          color: theme.palette.warning['A200'],
          fontSize: '22px',
          fontWeight: '400',
          mt: 3,
        }}
      >
        {t('BOARD_ENROLMENT.BOARD_ENROLLMENT')}
      </Box>

      <Grid container>
        <Grid item xs={12} md={8} lg={6}>
          <Box sx={{ px: '16px', mt: 2 }}>
            <Paper
              component="form"
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
                placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                inputProps={{ 'aria-label': t('ASSESSMENTS.SEARCH_STUDENT') }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ px: '16px' }}>
        <Grid container sx={{ mt: '20px', alignItems: 'flex-end' }}>
          <Grid item xs={8}>
            <Box>
              {/* <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                  }}
                >
                  <MenuItem value="All Centers">
                    All Centers 
                  </MenuItem>
                </Select>
              </FormControl> */}
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
                blockName={blockName}
                setBlockName={setBlockName}
                isCustomFieldRequired={true}
              />
            </Box>
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
              {t('COMMON.FILTERS')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <PieChartGraph />

      <Grid container sx={{ my: 4, px: '16px' }} spacing={2}>
        {boardEnrollmentList.map((item: any, index: any) => {
          return (
            <Grid key={index} item xs={12} md={6} lg={6} xl={4}>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.warning['A100']}`,
                  minHeight: '143px',
                  borderRadius: '8px',
                }}
                onClick={() => {
                  item.isDropout
                    ? handleOpen()
                    : router.push(`/board-enrollment/student-detail`);
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: '12px 16px 0',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: item.isDropout
                        ? theme.palette.warning['400']
                        : theme.palette.warning['300'],
                    }}
                  >
                    {item.studentName}
                  </Box>
                  <EastIcon
                    sx={{
                      color: item.isDropout
                        ? theme.palette.warning['400']
                        : theme.palette.warning['300'],
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    color: theme.palette.warning['400'],
                    fontWeight: '500',
                    fontSize: '12px',
                    mt: 0.5,
                    px: '16px',
                  }}
                >
                  {item.center}
                </Box>
                {item.isDropout ? (
                  <Box
                    mt={2}
                    sx={{
                      background: theme.palette.error.light,
                      p: '4px 8px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: theme.palette.warning['300'],
                      fontWeight: '500',
                      gap: '5px',
                      mb: '12px',
                      mx: '16px',
                    }}
                  >
                    {t('COMMON.DROPPED_OUT')}{' '}
                    <InfoOutlinedIcon
                      sx={{
                        color: theme.palette.warning['300'],
                        fontSize: '22px',
                      }}
                    />
                  </Box>
                ) : (
                  <Box mt={2} pb={'12px'}>
                    <HorizontalLinearStepper activeStep={activeStep} />
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
        <CenterSessionModal
          open={open}
          handleClose={handleClose}
          title={t('COMMON.DROPPED_OUT')}
        >
          <Box sx={{ p: '16px' }}>
            <Box
              sx={{
                color: theme.palette.warning['400'],
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {t('COMMON.REASON_FOR_DROPOUT')}
            </Box>
            <Box
              sx={{
                color: theme.palette.warning['300'],
                fontSize: '16px',
                fontWeight: 500,
                mt: '8px',
              }}
            >
              Migration {/*will come from API */}
            </Box>
          </Box>
        </CenterSessionModal>

        <SortingModal
          isModalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
          // handleSorting={handleSorting}
          // routeName={pathname}
        />
      </Grid>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default BoardEnrollment;

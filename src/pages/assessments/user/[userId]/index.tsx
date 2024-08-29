import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { showToastMessage } from '@/components/Toastify';
import {
  getAssessmentStatus,
  getDoIdForAssessmentDetails,
} from '@/services/AssesmentService';
import { getUserDetails } from '@/services/ProfileService';
import { AssessmentStatus } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import {
  format2DigitDate,
  toPascalCase
} from '@/utils/Helper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';
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
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentType, Program } from '../../../../../app.config';

const statusKeyMap: any = {
  [AssessmentStatus.COMPLETED]: 'ASSESSMENTS.COMPLETED',
  [AssessmentStatus.IN_PROGRESS]: 'ASSESSMENTS.IN_PROGRESS',
  [AssessmentStatus.NOT_STARTED]: 'ASSESSMENTS.NOT_STARTED',
};

function AssessmentsDetails() {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentTypeParam = searchParams.get('assessmentType');
  const centerId = searchParams.get('center');
  const params = useParams<{ userId: string }>();
  const [assessmentType, setAssessmentType] = useState<string>(
    assessmentTypeParam ?? 'pre'
  );
  const [assessmentList, setAssessmentList] = useState([]);
  const [subject, setSubject] = useState<any>([]);
  const [assessmentInfo, setAssessmentInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };

  useEffect(() => {
    logEvent({
      action: 'page-loaded-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Page Loaded',
    });
  }, []);

  useEffect(() => {
    const getDoIdForAssessmentReport = async () => {
      const stateName = localStorage.getItem('stateName');

      const filters = {
        program: [Program],
        se_boards: [stateName],
        // subject: [subjects || subject],
        assessment1: assessmentType === 'pre' ? AssessmentType.PRE_TEST : AssessmentType.POST_TEST,
      };
      try {
        if (stateName) {
          if (filters) {
            setIsLoading(true);
            setAssessmentList([]);
            setSubject([]);
            setAssessmentInfo({});
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
                    return {
                      subject: item?.name,
                      identifier: item?.IL_UNIQUE_ID,
                    };
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
  }, [assessmentType]);

  useEffect(() => {
    const getAssessmentsForLearners = async () => {
      try {
        const options = {
          userId: [params.userId],
          contentId: assessmentList.map(
            (item: any) => item.identifier
          ) as string[],
          batchId: centerId as string,
        };
        const assessmentStatus = await getAssessmentStatus(options);
        console.log('assessmentStatus', assessmentStatus);
        if (assessmentStatus?.length) {
          const info = assessmentStatus[0];

          if (info?.assessments?.length) {
            const { totalObtainedScore, totalMaxScore } =
              info.assessments.reduce(
                (acc: any, item: any) => {
                  acc.totalObtainedScore += item.totalScore;
                  acc.totalMaxScore += item.totalMaxScore;
                  return acc;
                },
                { totalObtainedScore: 0, totalMaxScore: 0 }
              );

            info.totalObtainedScore = totalObtainedScore;
            info.totalMaxScore = totalMaxScore;

            const currentAssessmentList: any = assessmentList.map(
              (item: any) => {
                const assessment = info.assessments.find(
                  (assessment: any) => assessment.contentId === item.identifier
                );

                if (assessment) {
                  assessment.updatedOn = format2DigitDate(assessment.updatedOn);
                }
                return assessment ? { ...item, ...assessment } : item;
              }
            );

            setSubject(currentAssessmentList);
          } else {
            setSubject(assessmentList);
          }
          setAssessmentInfo(assessmentStatus[0]);
          console.log('userList', assessmentStatus);
        }
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        console.log('Error in getAssessmentStatus', e);
      }
    };
    if (assessmentList.length) {
      getAssessmentsForLearners();
    }
  }, [assessmentList]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await getUserDetails(params.userId);
        console.log('response', response);
        if (response?.result?.userData) {
          setUserDetails(response?.result?.userData);
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.error('Error fetching getAssessmentStatus results:', error);
      }
    };

    if (params?.userId) {
      getUserInfo();
    }
  }, [params]);

  const handleAssessmentSubjectDetails = (
    subjectId: string,
    subject: string,
    updatedOn: string
  ) => {
    if (updatedOn) {
      const fullPath = router.asPath;
      const [basePath, queryString] = fullPath.split('?');
      const newRoute = `/subject/${subjectId}`;
      let newFullPath = `${basePath}${newRoute}`;

      if (queryString) {
        newFullPath = `${newFullPath}?${queryString}&assessmentName=${subject}`;
      }
      router.push(newFullPath);
    } else {
      showToastMessage(t('ASSESSMENTS.ASSESSMENT_NOT_STARTED_YET'), 'error');
    }
  };

  const getStatusIcon = (status: AssessmentStatus) => {
    const style = { color: theme.palette.warning['300'], fontSize: '22px' };
    switch (status) {
      case AssessmentStatus.COMPLETED:
        return <CheckCircleIcon sx={style} />;
      case AssessmentStatus.IN_PROGRESS:
        return <RadioButtonUncheckedIcon sx={style} />;
      case AssessmentStatus.NOT_STARTED:
        return <RemoveIcon sx={style} />;
      default:
        return null;
    }
  };

  const getTrackingStatus = () => {
    if (assessmentInfo?.status === AssessmentStatus.IN_PROGRESS) {
      return `(${t('ASSESSMENTS.NUMBER_OUT_OF_COMPLETED', { completedCount: assessmentInfo?.assessments?.length || 0, totalCount: assessmentList?.length })})`;
    }
    return '';
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: theme.palette.warning['A200'],
          padding: '15px 20px 5px',
        }}
        width={'100%'}
        onClick={handleBackEvent}
      >
        <KeyboardBackspaceOutlinedIcon
          cursor={'pointer'}
          sx={{ color: theme.palette.warning['A200'] }}
        />
        <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
          {toPascalCase(userDetails?.name)}
        </Typography>
      </Box>

      <Grid container>
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

      {assessmentInfo?.status && (
        <Box
          sx={{
            mt: 2,
            px: '16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {getStatusIcon(assessmentInfo?.status)}
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              color: theme.palette.warning['A200'],
            }}
          >
            {t(statusKeyMap[assessmentInfo.status])} {getTrackingStatus()}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          color: theme.palette.warning['300'],
          fontWeight: 500,
          fontSize: '14px',
          px: '16px',
        }}
      >
        {t('ASSESSMENTS.OVERALL_SCORE')}{': '}
        {assessmentInfo?.status === AssessmentStatus.COMPLETED && (
          <span>
            {`${assessmentInfo?.totalObtainedScore}/${assessmentInfo?.totalMaxScore}`}{' '}
            ({assessmentInfo?.percentageString})
          </span>
        )}
        {assessmentInfo?.status !== AssessmentStatus.COMPLETED && (
          <span> --</span>
        )}

      </Box>
      {subject?.length > 0 && (
        <Box
          sx={{
            mt: 2,
            background: '#FBF4E4',
            padding: '16px',
            cursor: 'pointer',
          }}
        >
          <Grid container spacing={2}>
            {subject?.map((assessment: any) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.identifier}>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.warning['A100']}`,
                    background: theme.palette.warning['A400'],
                    padding: '14px',
                    borderRadius: '8px',
                  }}
                  onClick={() =>
                    handleAssessmentSubjectDetails(
                      assessment?.identifier,
                      assessment?.subject,
                      assessment?.updatedOn
                    )
                  }
                >
                  <Box
                    sx={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: theme.palette.warning['300'],
                    }}
                  >
                    {assessment?.subject}
                  </Box>
                  {assessment?.updatedOn && (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        pt: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: theme.palette.warning['300'],
                        }}
                      >
                        {assessment?.totalScore}/{assessment?.totalMaxScore}
                      </Box>
                      <FiberManualRecordIcon
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.warning['400'],
                        }}
                      />
                      <Box
                        sx={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: theme.palette.warning['400'],
                        }}
                      >
                        {assessment?.updatedOn}
                      </Box>
                    </Box>
                  )}

                  {!assessment?.updatedOn && (
                    <em>{t('ASSESSMENTS.NOT_STARTED')}</em>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!isLoading && !assessmentList?.length && (
        <Box
          sx={{
            mt: 2,
            color: theme.palette.warning['300'],
            fontWeight: 500,
            fontSize: '14px',
            px: '16px',
            textAlign: 'center',
          }}
        >
          {t('ASSESSMENTS.NO_ASSESSMENTS_FOUND')}
        </Box>
      )}

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
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </Box>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export async function getStaticProps({
  params,
  locale,
}: {
  params: any;
  locale: string;
}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AssessmentsDetails;

import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import {
  getAssessmentStatus,
  getDoIdForAssessmentDetails,
} from '@/services/AssesmentService';
import { showToastMessage } from './Toastify';
import AssessmentReportCard from './AssessmentReportCard';
import { AssessmentType, Program } from '../../app.config';
import { useQueryClient } from '@tanstack/react-query';

interface AssessmentReportProp {
  classId: string;
  userId: string;
}

const AssessmentReport: React.FC<AssessmentReportProp> = ({
  classId,
  userId,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [preAssessmentList, setPreAssessmentList] = useState<string[]>([]);
  const [postAssessmentList, setPostAssessmentList] = useState<string[]>([]);
  const [assessmentData, setAssessmentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssessmentData = async (
    type: AssessmentType,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const stateName = localStorage.getItem('stateName');

    const filters = {
      program: [Program],
      se_boards: [stateName],
      assessmentType: type,
    };

    try {
      if (stateName && filters) {
        setIsLoading(true);
        setList([]);
        const searchResults = await queryClient.fetchQuery({
          queryKey: ['contentSearch', { filters }],
          queryFn: () => getDoIdForAssessmentDetails({ filters }),
        });

        if (searchResults?.responseCode === 'OK') {
          const result = searchResults?.result;
          if (result?.QuestionSet?.length > 0) {
            const assessmentIds = result.QuestionSet.map(
              (item: any) => item?.IL_UNIQUE_ID
            );
            setList(assessmentIds);
          } else {
            setList([]);
          }
        } else {
          console.log(`No Data found for ${type}`);
        }
      } else {
        console.log('NO State Found');
      }
    } catch (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      console.error(`Error fetching ${type} results:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessmentStatus = async (
    assessmentList: string[],
    type: AssessmentType
  ) => {
    if (assessmentList.length) {
      try {
        const options = {
          userId: [userId],
          courseId:assessmentList, // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId:assessmentList,
          contentId: assessmentList,
          //  batchId: classId,
        };
        const assessmentStatus = await getAssessmentStatus(options);
        if (assessmentStatus?.length) {
          const info = assessmentStatus[0];
          const newAssessmentData = {
            userId: info.userId,
            progress: info.status,
            score: parseFloat(info.percentage),
            type,
          };
          setAssessmentData((prevData) =>
            prevData.some((data) => data.type === type)
              ? prevData.map((data) =>
                  data.type === type ? newAssessmentData : data
                )
              : [...prevData, newAssessmentData]
          );
        }
      } catch (e: any) {
        console.error(`Error fetching ${type} status:`, e);
      }
    }
  };

  useEffect(() => {
    fetchAssessmentData(AssessmentType.PRE_TEST, setPreAssessmentList);
    fetchAssessmentData(AssessmentType.POST_TEST, setPostAssessmentList);
  }, [classId]);

  useEffect(() => {
    if (preAssessmentList.length) {
      fetchAssessmentStatus(preAssessmentList, AssessmentType.PRE_TEST);
    }
  }, [preAssessmentList]);

  useEffect(() => {
    if (postAssessmentList.length) {
      fetchAssessmentStatus(postAssessmentList, AssessmentType.POST_TEST);
    }
  }, [postAssessmentList]);

  return (
    <Box
      sx={{
        background: '#ffffff',
        padding: '0px',
      }}
    >
      <Typography
        sx={{
          color: theme.palette.warning['A200'],
          fontWeight: 600,
          fontSize: '16px',
          pb: '0.75rem',
        }}
        variant="h5"
        gutterBottom
      >
        {t('COMMON.ASSESSMENT_REPORT')}
      </Typography>
      <Box sx={{ background: '#ffffff', pb: '1rem' }}>
        <Grid container spacing={2}>
          {assessmentData?.map((assessment: any) => (
            <AssessmentReportCard
              key={assessment.userId}
              assessmentStatus={assessment.progress}
              cardTitle={assessment.type}
              overallPercentage={assessment.score}
              userId={assessment.userId}
              classId={classId}
              assessmentType={assessment.type}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AssessmentReport;

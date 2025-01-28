import { AssessmentStatus } from '@/utils/app.constant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AssessmentType } from '../../app.config';
import { useDirection } from '../hooks/useDirection';

interface AssessmentReportCardProp {
  assessmentStatus: string;
  cardTitle: string;
  overallPercentage: string;
  userId: string;
  classId: string;
  assessmentType?: string;
  board?: string;
}

const AssessmentReportCard: React.FC<AssessmentReportCardProp> = ({
  assessmentStatus,
  cardTitle,
  overallPercentage,
  userId,
  classId,
  assessmentType,
  board
}) => {
  const theme = useTheme<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const handleAssessmentDetails = (userId: string) => {
    if (router.pathname === '/assessments') {
      router.push(
        `${router.pathname}/user/${userId}?assessmentType=${assessmentType}&center=${classId}&board=${board}`
      );
    } else {
      const type = assessmentType === AssessmentType.PRE_TEST ? 'pre' : (assessmentType === AssessmentType.POST_TEST ? 'post' : 'other');
      router.push(
        `/assessments/user/${userId}?assessmentType=${type}&center=${classId}&board=${board}`
      );
    }
  };

  const MemberListItemIcon = ({ status }: { status: string }) => {
    switch (status) {
      case AssessmentStatus.NOT_STARTED:
        return <RemoveIcon sx={{ color: theme.palette.warning[300] }} />;
      case AssessmentStatus.IN_PROGRESS:
        return (
          <RadioButtonUncheckedIcon
            sx={{ color: theme.palette.warning[300] }}
          />
        );
      case AssessmentStatus.COMPLETED:
        return <CheckCircleIcon sx={{ color: theme.palette.warning[300] }} />;
      default:
        return null;
    }
  };

  const ProgressStatus = ({
    status,
    percentage,
  }: {
    status: string;
    percentage: string | number;
  }) => {
    let color = 'black';
    percentage = Number(percentage);
    if (percentage < 33) {
      color = 'red';
    } else if (percentage >= 33 && percentage < 66) {
      color = 'orange';
    } else if (percentage >= 66) {
      color = 'green';
    }

    switch (status) {
      case AssessmentStatus.NOT_STARTED:
        return <Box>{t('ASSESSMENTS.NOT_STARTED')}</Box>;
      case AssessmentStatus.IN_PROGRESS:
        return <Box>{t('ASSESSMENTS.IN_PROGRESS')}</Box>;
      case AssessmentStatus.COMPLETED:
        return (
          <Box>
            {t('ASSESSMENTS.OVERALL_SCORE')}:{' '}
            <span style={{ color: color }}>{overallPercentage}%</span>
          </Box>
        );
      default:
        return null;
    }
  };

  const getCardTitle = (assessmentType: string) => {
    switch (assessmentType) {
      case AssessmentType.PRE_TEST:
        return t('PROFILE.PRE_TEST');
      case AssessmentType.POST_TEST:
        return t('PROFILE.POST_TEST');
      case AssessmentType.OTHER:
        return t('FORM.OTHER');
      default:
        return assessmentType;
    }
  }

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} key={userId}>
      <Box
        sx={{
          border: `1px solid ${theme?.palette?.warning['A100']}`,
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: '8px',
          gap: '5px',
          background: theme.palette.warning['A400'],
          cursor: 'pointer',
        }}
        onClick={() => handleAssessmentDetails(userId)}
      >
        <Box
          sx={{
            flexBasis: '20%',
            background: theme?.palette?.primary?.light,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7px',
          }}
        >
          <MemberListItemIcon status={assessmentStatus} />
        </Box>
        <Box sx={{ flexBasis: '80%' }}>
          <Box
            sx={{
              px: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '7px',
            }}
          >
            <Box>
              <Box
                sx={{
                  color: theme.palette.warning[300],
                  fontSize: '16px',
                  fontWeight: '400',
                }}
                className="one-line-text"
              >
                <Typography
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {getCardTitle(cardTitle)}
                </Typography>

              </Box>
              <Box
                sx={{
                  gap: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ProgressStatus
                  status={assessmentStatus}
                  percentage={overallPercentage}
                />
              </Box>
            </Box>

            <KeyboardArrowRightIcon
              sx={{
                color: theme.palette.warning[300],
                transform: isRTL ? ' rotate(180deg)' : 'unset',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default AssessmentReportCard;

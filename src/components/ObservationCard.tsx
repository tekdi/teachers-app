import { Box, Typography, Card, CardContent, Tooltip, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { formatDate, formatEndDate } from '@/utils/Helper';
import { useTranslation } from 'react-i18next';
import { LeftDays } from '@/utils/app.constant';

interface ObservationCardProp {
  name?: string;
  id?: string;
  description?: string;
  onCardClick?: (observationId: string) => void;
  startDate?: string;
  endDate?: string;
}

const ObservationCard: React.FC<ObservationCardProp> = ({
  name,
  id,
  description,
  onCardClick,
  startDate,
  endDate,
}) => {
  const [remainingDays, setRemainingDays] = useState<string | number>('N/A');
  const [remainingTimes, setRemainingTimes] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const today = new Date();

    if (endDate) {
      const targetDate = new Date(endDate.toString());
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / LeftDays.ONE_DAY_IN_MILLISECONDS);
      setRemainingTimes(diffDays);

      if (diffDays > 0) {
        setRemainingDays(formatEndDate({ diffDays }));
      } else {
        setRemainingDays(0);
        setRemainingTimes(0);
      }
    }
  }, [endDate]);

  return (
    <Tooltip
      title={remainingDays === 0 ? t('OBSERVATION.THIS_OBSERVATION_EXPIRED') : ''}
      disableHoverListener={remainingDays !== 0}
      disableFocusListener={remainingDays !== 0}
    >
      <Card
        variant="outlined"
        sx={{
          padding: '8px',
          boxShadow: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 10,
          },
          width: '320px',
         cursor: 'pointer',
        //background: "#FEF8F2",
                 borderRadius: '16px',
          border: '1px solid #E0E0E0',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={remainingDays === 0 ? undefined : () => onCardClick?.(id || '')}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
          <CardContent sx={{ flexGrow: 1, padding: '16px' }}>
            {/* {remainingDays !== 0 && (
              <Chip
                label={`${remainingDays} ${t('OBSERVATION.DAYS_LEFT')}`}
                sx={{
                  bgcolor: remainingTimes <= 5 ? '#FFDAD6' : '#FFDEA1',
                  color: remainingTimes <= 5 ? '#BA1A1A' : '#7A5900',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              />
            )} */}

            {endDate &&(<Box
              sx={{
               // display: 'flex',
                alignItems: 'center',
                mb: 1,
                mt: 1,
                color: 'black',
                backgroundColor: remainingTimes <= 5 ? '#FFE7E3' : '#E9F5FF',
                borderRadius: '8px',
                padding: '6px 10px',
              }}
            >
              <Typography variant="body1" color="text.primary" sx={{ mr: 1 }}>
                {t('OBSERVATION.DUE_DATE')}:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {endDate ? formatDate(endDate) : 'N/A'}
              </Typography>
            </Box>)}

            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                lineHeight: 1.3,
                color: '#333',
                mb: 1,
              }}
            >
              {name}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#555',
                  lineHeight: 1.5,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  height: '3em',
                }}
              >
                {description}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
    </Tooltip>
  );
};

export default ObservationCard;

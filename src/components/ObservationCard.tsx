import { LeftDays } from '@/utils/app.constant';
import { formatDate, formatEndDate } from '@/utils/Helper';
import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
          boxShadow: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 10,
          },
          width: '100%',
         cursor: 'pointer',
        background: "#f8efda",
                 borderRadius: '16px',
          border: '1px solid #E0E0E0',
          height: '160px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={remainingDays === 0 ? undefined : () => onCardClick?.(id || '')}
      >
        <Box display="flex"  alignItems="center" >
          <CardContent sx={{  }}>
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

           

            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 'bold',
                lineHeight: 1.3,
                color: '#333',
               // mb: 1,
              }}
            >
              {name}
            </Typography>

            {description ? (
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
            ):<Box
            sx={{
              
              height: '3.5em',
            }}            ></Box>}

{endDate && remainingDays !== 0 &&(<Box
              sx={{
                alignItems: 'center',
             
               
                borderRadius: '8px',
              }}
            >
              <Typography variant="h5" color="black"  sx={{ mr: 1 }}>
                {t('OBSERVATION.DUE_DATE')}:
              </Typography>
              <Typography variant="h5" color= '#555' sx={{mt:"3px"}} >
                {endDate ? formatDate(endDate) : 'N/A'}
              </Typography>
            </Box>)}
          </CardContent>
        </Box>
      </Card>
    </Tooltip>
  );
};

export default ObservationCard;

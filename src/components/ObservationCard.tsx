import { Box, Typography, Card, CardContent, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { formatEndDate } from '@/utils/Helper';
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
  endDate
}) => {
  const [remainingDays, setRemainingDays] = useState<any>();
  const [remainingTimes, setRemainingTimes] = useState<any>();
  const { t } = useTranslation();


  useEffect(() => {
    const today = new Date(); 
    
    if (endDate) {
      const targetDate = new Date(endDate.toString()); 
      
      // Calculate the difference in time
      const diffTime = (targetDate.getTime() - today.getTime());

      const diffDays = Math.ceil(diffTime / LeftDays.ONE_DAY_IN_MILLISECONDS);
      
      // Update remaining times and days
      setRemainingTimes(diffDays);
      
      if (diffDays > 0) {
        const remainingTime = formatEndDate({ diffDays });
        console.log("remainingTime",typeof remainingTime)
        setRemainingDays(remainingTime);
        
      } else {
        // If diffDays is 0 or negative, set the status to 'expired'
        setRemainingDays(0);
        setRemainingTimes(0)
      }
    }
  }, [endDate]); 
  
  return (
    <Tooltip
      title={remainingDays === 0 ? t('OBSERVATION.THIS_OBSERVATION_EXPIRED') : ""} 
      disableHoverListener={remainingDays !== 0} 
      disableFocusListener={remainingDays !== 0} 
    >
    <Card
      variant="outlined"
      sx={{
        margin: '16px',
        padding: '8px',
        boxShadow: 3,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 10,
        },
        width: '300px',
        cursor: 'pointer',
        background: "#FEF8F2",
        borderRadius: '16px',
        border: '1px solid #D0C5B4',
        height: '200px', // Fixed height for all cards
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={remainingDays===0?()=>{}:() => onCardClick?.(id || '')}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
        <CardContent sx={{ flexGrow: 1 }}>
        {remainingDays!==0 && ( <Box
            sx={{
              width: '100px',
              padding: '4px 8px',
              gap: '10px',
              borderRadius: '8px',
              background: remainingTimes<=5?'#FFDAD6':"#FFDEA1" ,
              mb: 2, // Added margin for spacing
            }}
          >
            <Typography color={remainingTimes<=5?"#BA1A1A":"#7A5900"}variant="h5">   
              {remainingDays} left
            </Typography>

          </Box>)}

          <Box display="flex" alignItems="center" mb={1} mt={1}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                flexGrow: 1,
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* Description */}
          {description && (
            <Typography
              variant="body2"
              component="p"
              sx={{
                marginTop: '8px',
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

          {/* <Typography
            sx={{
              fontFamily: 'Poppins',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '16px',
              letterSpacing: '0.4px',
              textAlign: 'left',
              marginTop: 'auto', // Pushes this element to the bottom
            }}
          >
            16 Jun, 2024 - 31 Dec, 2024
          </Typography> */}
        </CardContent>
      </Box>
    </Card>
    </Tooltip>
  );
};

export default ObservationCard;

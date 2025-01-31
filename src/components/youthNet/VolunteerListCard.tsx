import React from 'react';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'next-i18next';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface CardProps {
  title: string;
  entries: number;
  volunteerCount: number;
  actionLabel: string;
  onActionClick?: () => void;
}

const VolunteerListCard: React.FC<CardProps> = ({
  title,
  entries,
  volunteerCount,
  actionLabel,
  onActionClick,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      variant="outlined"
      onClick={onActionClick || (() => { })}
      sx={{
        // mt: 2,
        borderRadius: '8px',
        boxShadow: 1,
        '&:hover': { boxShadow: 3 },
        overflow: 'hidden',
        position: 'relative',
        cursor:'pointer',
        
      }}
    >
      <CardContent
        sx={{
          p: 2,
          pb: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Title and Entries */}
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {entries} {t('YOUTHNET_VOLUNTEERLIST.ENTRIES')}
          </Typography>
        </Box>
        <ArrowForwardIosIcon fontSize="small" color="action" sx={{ color:'#4D4639'}} />
      </CardContent>
      <Box
        sx={{
          backgroundColor: '#F3EDF7',
          px: 2,
          py: 1,
          borderTopLeftRadius:'12px',
           borderTopRightRadius: '12px'
        }}
      >
       <Box sx={{display:'flex' , alignItems:'center', gap:'3px'}}>
          <Box sx={{ color: '#BA1A1A', fontSize: '18px' }}>
            !
          </Box>
          <Typography
            sx={{
              color: '#7C766F',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight:'500'
            }}
          >
            {volunteerCount} {t('YOUTHNET_VOLUNTEERLIST.VOLUNTEERS_ASSIGNED')}
          </Typography>
       </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Box
            
            sx={{
              fontWeight: '500',
              color: '#0D599E',
              fontSize:'14px'
            }}
          >
            {actionLabel}
          </Box>

          <ArrowForwardIcon
            fontSize="small"
            sx={{
              color: '#0D599E',
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default VolunteerListCard;

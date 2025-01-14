import { ObservationStatus } from '@/utils/app.constant';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import {
  Box,

  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PanoramaFishEyeSharpIcon from '@mui/icons-material/PanoramaFishEyeSharp';
import RemoveIcon from '@mui/icons-material/Remove';

interface MemberProps {
  entityMemberValue?: string;
  status?: string;
  onClick?: any;
}

const Entity: React.FC<MemberProps> = ({
  entityMemberValue,
  status,
  onClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [observationStatus, setObservationStatus] = useState<string>('');

  useEffect(() => {
    if (status === ObservationStatus.NOT_STARTED) {
      setObservationStatus(t('OBSERVATION.NOT_STARTED'));
    } else if (status === ObservationStatus.DRAFT) {
      setObservationStatus(t('OBSERVATION.INPROGRESS'));
    } else if (status === ObservationStatus.COMPLETED) {
      setObservationStatus(t('OBSERVATION.COMPLETED'));
    }
  }, [status]);
  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          border: '1px solid #D0C5B4', // Black border added here
          // borderRadius: '8px'
          width: '300px',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          //  height:"56px"
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            background: '#fff',
            height: '56px',
            borderRadius: '8px',
          }}
        >
          <Box
            sx={{
              width: '56px',
              display: 'flex',
              background: theme.palette.primary.light,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
            }}
          >
            {/* <Image src={building} alt="center" /> */}
            {status === ObservationStatus.COMPLETED ? (
              <CheckCircleSharpIcon sx={{ color: '#4caf50' }} />
            ) : status === ObservationStatus.DRAFT ? (
              <PanoramaFishEyeSharpIcon />
            ) : status === ObservationStatus.NOT_STARTED ? (
              <RemoveIcon />
            ) : (
              <></>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '0 10px',
            }}
          >
            <Box
              sx={{
                fontSize: '16px',
                fontWeight: '400',
                color: theme.palette.warning['300'],
              }}
            >
              <Typography
             sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
              >{entityMemberValue}</Typography>
              <Typography variant="h5" color={'#4D4639'}>
                {observationStatus}
              </Typography>
            </Box>
            <ChevronRightIcon
              sx={{
                color: theme.palette.warning['A200'],
                // transform: isRTL ? ' rotate(180deg)' : 'unset',
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Entity;

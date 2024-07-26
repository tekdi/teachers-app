import { Box, Typography } from '@mui/material';
import { Session, SessionsCardProps } from '@/utils/Interfaces';

import CenterSessionModal from './CenterSessionModal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlined from '@mui/icons-material/EditOutlined';
import PlannedSession from './PlannedSession';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const SessionsCard: React.FC<SessionsCardProps> = ({ data, children }) => {
  const theme = useTheme<any>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log(data.url, 'shreyas');

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 16px 4px',
        }}
      >
        <Box>
          <Typography
            color={theme.palette.warning['300']}
            fontWeight={'400'}
            textAlign={'left'}
            fontSize={'16px'}
          >
            {data?.subject}
          </Typography>

          <Typography fontWeight={'400'} textAlign={'left'} fontSize={'14px'}>
            {data?.time}
          </Typography>
          <Typography fontWeight={'400'} textAlign={'left'} fontSize={'14px'}>
            {data?.teacherName}
          </Typography>
        </Box>
        <EditOutlined onClick={handleOpen} sx={{ cursor: 'pointer' }} />
      </Box>
      <Box
        sx={{
          padding: '0px 16px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '30px',
        }}
      >
        <Box
          sx={{
            fontSize: '14px',
            color: '#0D599E',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {data?.url}
        </Box>
        <ContentCopyIcon sx={{ fontSize: '18px', color: '#0D599E' }} />
      </Box>
      <CenterSessionModal
        open={open}
        handleClose={handleClose}
        title={'Home Science'}
        primary={'Schedule'}
      >
        <PlannedSession />
      </CenterSessionModal>

      <Box>{children}</Box>
    </Box>
  );
};

export default SessionsCard;

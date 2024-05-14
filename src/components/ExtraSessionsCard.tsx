import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useTranslation } from "next-i18next";
import { truncateURL } from '@/utils/Helper';
import { ExtraSessionsCardProps } from '@/utils/Interfaces';
import { useMediaQuery } from '@mui/material';
const ExtraSessionsCard: React.FC<ExtraSessionsCardProps> = ({
  subject,
  instructor,
  dateAndTime,
  meetingURL,
  onEditClick,
  onCopyClick,
}) => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Card
        sx={{ border: '1px solid #ccc', borderRadius: '8px', margin: '15px' }}
      >
        <CardContent sx={{ alignItems: 'center' }}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography
              margin={0}
              fontSize={'16px'}
              color={'black'}
              fontFamily={'Poppins'}
              fontWeight={'400'}
            >
              {subject} - {t('DASHBOARD.EXTRA_CLASS')}
            </Typography>
            {onEditClick && (
              <EditOutlined
                color="secondary"
                fontSize="small"
                onClick={onEditClick}
              />
            )}
          </Box>
          <Typography
            color={'#7C766F'}
            fontSize={'14px'}
            fontWeight={'400'}
            margin={0}
          >
            {instructor}
          </Typography>
          <Typography
            margin={0}
            color={'#7C766F'}
            fontSize={'14px'}
            fontWeight={'400'}
          >
            {dateAndTime}
          </Typography>
          <Box
            margin={0}
            color={'#0D599E'}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Typography>{truncateURL(meetingURL, 30, isMobile)}</Typography>
            {onCopyClick && (
              <ContentCopyRoundedIcon
                onClick={onCopyClick}
                color="secondary"
                fontSize="small"
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExtraSessionsCard;

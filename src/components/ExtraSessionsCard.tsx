import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Popover,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useTranslation } from 'next-i18next';
import { truncateURL } from '@/utils/Helper';
import { ExtraSessionsCardProps } from '@/utils/Interfaces';
import { useMediaQuery } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const ExtraSessionsCard: React.FC<ExtraSessionsCardProps> = ({
  subject,
  instructor,
  dateAndTime,
  meetingURL,
  onEditClick,
}) => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = useTheme<any>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'copy-text' : undefined;

  const onCopyClick = (event: React.MouseEvent<SVGElement>) => {
    setAnchorEl(event.target as HTMLButtonElement);
    navigator.clipboard.writeText(meetingURL);
    setTimeout(() => {
      setAnchorEl(null);
    }, 1000);
  };

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
            color={theme.palette.warning['400']}
            fontSize={'14px'}
            fontWeight={'400'}
            margin={0}
          >
            {instructor}
          </Typography>
          <Box display="flex" alignItems="center" py={'4px'}>
            <CalendarMonthIcon fontSize="small" />
            <Typography
              margin={0}
              color={theme.palette.warning['400']}
              fontSize={'14px'}
              fontWeight={'600'}
              lineHeight={'20px'}
              ml={0.5} // Add some margin between the icon and the text
            >
              {dateAndTime}
            </Typography>
          </Box>
          <Box
            margin={0}
            color={theme.palette.secondary.main}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Typography fontWeight={'600'}>
              {truncateURL(meetingURL, 30, isMobile)}
            </Typography>

            <ContentCopyRoundedIcon
              onClick={(e) => onCopyClick(e)}
              color="secondary"
              fontSize="small"
              aria-describedby={'simple-popover'}
            />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }}>Copied</Typography>
            </Popover>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExtraSessionsCard;

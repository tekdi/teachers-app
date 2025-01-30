import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { VillageDetailProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

const VillageDetailCard: React.FC<VillageDetailProps> = ({
  title,
  imageSrc,
  subtitle,
  onClick,
}) => {
  const theme = useTheme<any>();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.warning['A100']}`,
        bgcolor: theme.palette.warning['800'],
        padding: '12px',
        margin: '20px',
        borderRadius: '16px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box display="flex" gap="8px" alignItems="center" flexGrow={1}>
          {imageSrc && (
            <Image src={imageSrc} alt="Icon" width={40} height={40} />
          )}

          <Box display="flex" flexDirection="column" minHeight="40px" mt={2.5}>
            {title && (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  lineHeight: '1.2',
                  color: theme.palette.warning['300'],
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                className="one-line-text"
              >
                {title}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '12px',
                  color: '#635E57',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                className="one-line-text"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <ArrowForwardIcon
          sx={{
            fontSize: '20px',
            color: '#0D599E',
          }}
        />
      </Box>
    </Box>
  );
};

export default VillageDetailCard;

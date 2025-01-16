import { Box, Grid } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VillageNewRegistrationProps } from '@/utils/Interfaces';
import { useRouter } from 'next/router';

const VillageNewRegistration: React.FC<VillageNewRegistrationProps> = ({
  locations,
}) => {
  const theme = useTheme<any>();
  const router = useRouter();

  const handleLocationClick = (location: string) => {
    console.log(`Location clicked: ${location}`);
    router.push(`/youthboard/villageDetails/${location}`);
  };

  return (
    <Box>
      <Grid container spacing={1}>
        {locations.map((location: string, index: any) => (
          <Grid item key={index}>
            <Box
              sx={{
                border: `1px solid ${theme?.palette?.warning['900']}`,
                fontSize: '14px',
                color: '#4D4639',
                fontWeight: '500',
                padding: '4px 6px',
                borderRadius: '8px',
                whiteSpace: 'nowrap', // Ensure text stays on one line
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
              className="one-line-text"
              onClick={() => handleLocationClick(location)}
            >
              {location}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VillageNewRegistration;

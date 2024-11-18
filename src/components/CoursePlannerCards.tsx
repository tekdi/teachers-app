import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';
import { ResourcesType } from '@/utils/app.constant';
import router from 'next/router';
import placeholderImage from '../assets/images/decorationBg.png';

const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources,
  type,
}) => {
  const theme = useTheme<any>();

  // Filter the resources based on the type
  const filteredResources = resources?.filter(
    (resource: { type?: string }) =>
      (type === ResourcesType.NONE && !resource.type) || resource.type === type
  );

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ px: '16px !important', cursor: 'pointer' }}
      >
        {filteredResources?.map(
          (
            resource: {
              link: string;
              name?: string;
              appIcon?: string;
              identifier?: string;
            },
            index: number
          ) => (
            <Grid item xs={6} md={4} lg={2} sx={{ mt: 2 }} key={index}>
              <Box
                className="facilitator-bg"
                sx={{ backgroundImage: `url(${resource?.appIcon ? resource.appIcon : '/decorationBg.png'})`, position: 'relative', }}
                onClick={() => router.push(`/play/content/${resource?.identifier}`)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: theme?.palette?.warning['A400'],
                    position: 'relative', zIndex: 2,
                  }}
                >
                  {resource?.name || 'Untitled Resource'}
                </Box>
                <Box
                  sx={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: theme?.palette?.warning['A400'],
                  }}
                >
                  Subtitle
                </Box>
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;

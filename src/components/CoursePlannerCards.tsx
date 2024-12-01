import { ResourcesType } from '@/utils/app.constant';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import ContentCard from './ContentCard';

const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources,
  type,
}) => {
  const theme = useTheme<any>();

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
              resourceType: string;
              link: string;
              name: string;
              appIcon: string;
              identifier: string;
              id: string;
              mimeType: string; // Add this property
            },
            index: number

          ) => (
            <Grid item xs={6} md={4} lg={2} sx={{ mt: 2 }} key={index}>
              <ContentCard name={resource?.name} identifier={resource?.identifier || resource?.id} mimeType={resource?.mimeType} appIcon={resource?.appIcon} resourceType={resource?.resourceType} />
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;

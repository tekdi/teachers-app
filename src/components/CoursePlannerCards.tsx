import { ResourcesType } from '@/utils/app.constant';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';
import { Box, Grid } from '@mui/material';
import React from 'react';
import ContentCard from './ContentCard';

const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources,
  type,
}) => {

  // Filter by type
  const filteredResources = resources?.filter(
    (resource: { type?: string }) =>
      (type === ResourcesType.NONE && !resource.type) || resource.type === type
  );

  // Remove duplicates by identifier
  const uniqueResources = filteredResources?.reduce((acc : any, resource :any) => {
    if (!acc.some((item : any) => item.identifier === resource.identifier)) {
      acc.push(resource);
    }
    return acc;
  }, [] as typeof resources);

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ px: '16px !important', cursor: 'pointer' }}
      >
        {uniqueResources?.map(
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
              <ContentCard
                name={resource?.name}
                identifier={resource?.identifier || resource?.id}
                mimeType={resource?.mimeType}
                appIcon={resource?.appIcon}
                resourceType={resource?.resourceType}
              />
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;

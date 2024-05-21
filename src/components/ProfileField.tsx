import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface ProfileFieldProps {
  data: { label: string; value: string }[];
}

const ProfileField: React.FC<ProfileFieldProps> = ({ data }) => (
  <Grid container spacing={2}>
    {data?.map((item, index) => (
      <Grid item xs={6} key={index} textAlign="left">
        <Typography margin={0} variant="h5">
          {item.label}
        </Typography>
        <Box display="flex">
          <Typography variant="h5" margin={0} color="#4D4639">
            {item.value}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default ProfileField;

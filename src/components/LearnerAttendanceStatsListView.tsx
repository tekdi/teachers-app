import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'
interface StudentsStatsListProps {
  name: string;
  value1: number;
  value2: number;
  userId?: string;
  cohortId?: string;
}

const StudentsStatsList: React.FC<StudentsStatsListProps> = ({
  name,
  value1,
  value2,
  userId,
  cohortId,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

//   const handleStudentDetails = () => {
//     router.push(`/student-details/${cohortId}/${userId}`);
//   };

  return (
    <Stack>
      <Box
        height="60px"
        borderTop={`1px solid  ${theme.palette.warning['300']}`}
        margin="0px"
        alignItems={'center'}
        // padding="1rem"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          p={2}
        >
        <Grid item xs={4}>
          <Link href={`/student-details/${cohortId}/${userId}`}> {name}</Link>
          </Grid>
          <Grid item xs={4}>
            <Typography
        
              fontSize="1rem"
              fontWeight="bold"
              lineHeight="1.5rem"
              color={theme.palette.text.primary}
              textAlign="center"
            >
              {value1}%
            </Typography>
          </Grid>
         <Grid item xs={4}>
          <Typography
           
            fontSize="1rem"
            fontWeight="bold"
            lineHeight="1.5rem"
            color={theme.palette.text.primary}
            textAlign="center">
            {value2}
          </Typography>
        </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default StudentsStatsList;

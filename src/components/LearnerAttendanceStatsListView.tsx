import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { UserData, updateCustomField } from '@/utils/Interfaces';

import LearnerModal from './LearnerModal';
import Link from 'next/link';
import Loader from './Loader';
import { getUserDetails } from '@/services/ProfileService';
import { lowLearnerAttendanceLimit } from '../../app.config';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface StudentsStatsListProps {
  name: string;
  presentPercent: number;
  classesMissed: number;
  userId?: string;
  cohortId?: string;
}

const StudentsStatsList: React.FC<StudentsStatsListProps> = ({
  name,
  presentPercent,
  classesMissed,
  userId,
  cohortId,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const textColor =
    presentPercent > lowLearnerAttendanceLimit
      ? theme.palette.success.main
      : theme.palette.error.main;

  //   const handleStudentDetails = () => {
  //     router.push(`/student-details/${cohortId}/${userId}`);
  //   };

  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [customFieldsData, setCustomFieldsData] = React.useState<
    updateCustomField[]
  >([]);
  const [userName, setUserName] = React.useState('');
  const [isModalOpenLearner, setIsModalOpenLearner] = useState(false);
  const [loading, setLoading] = useState(false);
  // const userId = '12345'; // Replace with the actual user ID you want to pass

  const handleOpenModalLearner = (userId: string) => {
    fetchUserDetails(userId);
    setIsModalOpenLearner(true);
  };

  const handleCloseModalLearner = () => {
    setIsModalOpenLearner(false);
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      if (userId) {
        setLoading(true);
        const response = await getUserDetails(userId, true);
        console.log('response for popup', response?.result);
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserData(userData);
            setUserName(userData?.name);

            const customDataFields = userData?.customFields;
            if (customDataFields?.length > 0) {
              setCustomFieldsData(customDataFields);
              setLoading(false);
            }
          } else {
            console.log('No data Found');
          }
        } else {
          console.log('No Response Found');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // React.useEffect(() => {
  //   fetchUserDetails();
  // }, [userId]);

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const labelValueArray = customFieldsData.map(({ label, value }) => ({
    label,
    value,
  }));

  const names = [
    'name',
    'age',
    'gender',
    'student_type',
    'enrollment_number',
    'primary_work',
  ];

  const filteredFields = names
    .map((label) => customFieldsData.find((field) => field.name === label))
    .filter(Boolean);

  return (
    <Box>
      {' '}
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <LearnerModal
          userId={userId}
          open={isModalOpenLearner}
          onClose={handleCloseModalLearner}
          data={filteredFields}
          userName={userName}
        />
      )}
      <Stack>
        <Box
          height="60px"
          borderTop={`1px solid  #D0C5B4`}
          margin="0px"
          alignItems={'center'}
          // padding="1rem"
        >
          <Grid
            container
            alignItems="center"
            textAlign={'center'}
            justifyContent="space-between"
            p={2}
          >
            <Grid item xs={6} textAlign={'left'}>
              <Link href={''}>
                <Typography
                  onClick={() => handleOpenModalLearner(userId!)}
                  sx={{
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.secondary.main,
                  }}
                >
                  {name}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={3}>
              <Typography
                fontSize="1rem"
                fontWeight="bold"
                lineHeight="1.5rem"
                // color={theme.palette.text.primary}
                color={textColor}
                textAlign="center"
              >
                {presentPercent}%
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                fontSize="1rem"
                fontWeight="bold"
                lineHeight="1.5rem"
                color={theme.palette.text.primary}
                textAlign="center"
              >
                {classesMissed}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentsStatsList;

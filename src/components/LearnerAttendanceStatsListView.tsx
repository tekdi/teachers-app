import { Box, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Status } from '@/utils/app.constant';
import { UserData, UpdateCustomField } from '@/utils/Interfaces';

import DropoutLabel from './DropoutLabel';
import LearnerModal from './LearnerModal';
import Link from 'next/link';
import Loader from './Loader';
import ReactGA from 'react-ga4';
import { getUserDetails } from '@/services/ProfileService';
import useAttendanceRangeColor from '@/hooks/useAttendanceRangeColor';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { capitalizeEachWord, filterMiniProfileFields, toPascalCase } from '@/utils/Helper';

interface StudentsStatsListProps {
  name: string;
  presentPercent: number;
  classesMissed: number;
  userId?: string;
  cohortId?: string;
  memberStatus?: string;
}

const StudentsStatsList: React.FC<StudentsStatsListProps> = ({
  name,
  presentPercent,
  classesMissed,
  userId,
  memberStatus,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const determinePathColor = useAttendanceRangeColor();
  const textColor = determinePathColor(presentPercent);

  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [fullName, setFullName] = React.useState<string>("");

  const [customFieldsData, setCustomFieldsData] = React.useState<
    UpdateCustomField[]
  >([]);

  const [isModalOpenLearner, setIsModalOpenLearner] = useState(false);
  const [loading, setLoading] = useState(false);

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
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserData(userData);

            let fullName = "";

              if (userData?.firstName) {
                fullName += toPascalCase(userData.firstName);
              }
              
              if (userData?.middleName) {
                fullName += (fullName ? " " : "") + toPascalCase(userData.middleName);
              }
              
              if (userData?.lastName) {
                fullName += (fullName ? " " : "") + toPascalCase(userData.lastName);
              }
              setFullName(fullName);
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

  const filteredFields = filterMiniProfileFields(customFieldsData);

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
          userName={fullName}
          contactNumber={userData?.mobile}
          enrollmentNumber={userData?.username || ''}
        />
      )}
      <Stack>
        <Box
          borderTop={`1px solid  ${theme.palette.warning['A100']}`}
          margin="0px"
          alignItems={'center'}
        >
          <Grid
            container
            alignItems="center"
            textAlign={'center'}
            justifyContent="space-between"
            p={2}
          >
            <Grid item xs={6} textAlign={'left'}>
                {memberStatus === Status.ARCHIVED ? (
                  <Typography
                    sx={{
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '400',
                      color: theme.palette.text.disabled, // Use disabled color
                    }}
                  >
                    {name}
                  </Typography>
                ) : (
                  <Link className="word-break" href={''}>
                    <Typography
                      onClick={() => {
                        handleOpenModalLearner(userId!);
                        ReactGA.event('learner-details-link-clicked', {
                          userId: userId,
                        });
                      }}
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
                )}
            </Grid>
            {memberStatus === Status.DROPOUT ? (
              <Grid item xs={6}>
                <Grid container>
                  <Grid xs={6}>
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
                  <Grid item xs={6}>
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
                <DropoutLabel />
              </Grid>
            ) : (
              <>
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
              </>
            )}
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentsStatsList;

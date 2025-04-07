import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import Header from '@/components/Header';
import { limit } from '@/utils/app.constant';
import useStore from '@/store/store';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Button,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { showToastMessage } from '@/components/Toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { toPascalCase } from '@/utils/Helper';
// import SearchBar from '@/components/Searchbar';
import { SearchInput } from '@/components/search-input';
import { useTranslation } from 'next-i18next';
import { applyToOpportunity, getAppliedUsers, getOpportunity } from '@/lib/api';
import { getCohortList } from '@/services/CohortServices';
import { id } from 'date-fns/locale';
import Header from '@/components/Header';

interface UserDataProps {
  name: string;
  userId: string;
  memberStatus: string;
  cohortMembershipId: string;
  enrollmentNumber: string;
}

export default function MapYouth() {
  const router = useRouter();
  const [reloadState, setReloadState] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const setCohortLearnerCount = useStore(
    (state) => state.setCohortLearnerCount
  );
  const [userData, setUserData] = useState<UserDataProps[]>([]);
  const [filteredData, setFilteredData] = useState<UserDataProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const opportunityId = router.query.id;
  const { t } = useTranslation();
  const [myCohorts, setMyCohorts] = useState<any[]>([]);
  const [oppportunityName, setOpportuntiName] = useState('');
  const [cohortId, setCohortId] = useState<any>('');
  const [centerCohortId, setCenterCohortId] = useState();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const getMyCohortList = async () => {
          const response = await getCohortList(userId);

          const extractCohorts = (data: any[]): any[] => {
            let cohorts: any[] = [];
            data.forEach((item) => {
              if (item.type === 'COHORT') {
                cohorts.push(item);
              }
              if (item.childData && item.childData.length > 0) {
                cohorts = cohorts.concat(extractCohorts(item.childData));
              }
            });
            return cohorts;
          };

          const extractCohortsCenter = (data: any[]): any[] => {
            let centers: any[] = [];
            data.forEach((item) => {
              if (item.type === 'CENTER') {
                centers.push(item);
              }
              if (item.childData && item.childData.length > 0) {
                centers = centers.concat(extractCohortsCenter(item.childData));
              }
            });
            return centers;
          };

          const cohortList = extractCohorts(response);

          const centerList = extractCohortsCenter(response);

          if (centerList.length > 0) {
            setCenterCohortId(centerList[0].cohortId); // Set the first CENTER cohortId
          }

          setMyCohorts(cohortList); // Set only the filtered cohorts

          if (cohortList?.length > 0) {
            const allCohortIds = cohortList.map((cohort) => cohort.cohortId);
            setCohortId(allCohortIds);
          }
        };
        getMyCohortList();
      }
    }
  }, []);

  const getOpportunityDetails = async () => {
    const response = await getOpportunity(opportunityId);
    setOpportuntiName(response.result.data.title);
  };

  useEffect(() => {
    getOpportunityDetails();
  }, []);

  useEffect(() => {
    const getCohortMemberList = async () => {
      setFilteredData([]);
      setLoading(true);
      try {
        if (cohortId && opportunityId) {
          const page = 0;
          const filters = { cohortId: cohortId };

          // Fetch all users in the cohort
          const response = await getMyCohortMemberList({ limit, filters });

          const cohortUsers = response?.result?.userDetails || [];

          // Fetch applied users
          const appliedUsersList = await getAppliedUsers(opportunityId);
          if (
            !appliedUsersList?.result?.data ||
            !Array.isArray(appliedUsersList.result.data)
          ) {
            console.error(
              'Unexpected appliedUsersList structure:',
              appliedUsersList
            );
            showToastMessage('Error fetching applied users', 'error');
            return;
          }

          // Extract user IDs from all applications
          const appliedUsers = appliedUsersList.result.data.map(
            (applicant: any) => applicant.application_user_id
          );
          // Filter out users who have already applied
          const filteredUsers = cohortUsers.filter(
            (user: any) => !appliedUsers.includes(user.userId)
          );

          const userDetails = filteredUsers.map((user: any) => ({
            name:
              toPascalCase(user?.firstName || '') +
              ' ' +
              (user?.lastName ? toPascalCase(user.lastName) : ''),
            userId: user?.userId,
            memberStatus: user?.status,
            cohortMembershipId: user?.cohortMembershipId,
            enrollmentNumber: user?.username,
          }));

          // setCohortLearnerCount(userDetails.length);
          console.log(userDetails, 'userDetails');

          setUserData(userDetails);
          setFilteredData(userDetails);
        }
      } catch (error) {
        setFilteredData([]);
        console.error('Error fetching cohort list:', error);
        showToastMessage('Something went wrong!', 'error');
      } finally {
        setLoading(false);
      }
    };

    getCohortMemberList();
  }, [cohortId, opportunityId, reloadState]);

  const handleToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      showToastMessage('Please select at least one user', 'error');
      return;
    }

    const statusId = 'adb327a6-7abb-4f7a-9810-eff745071a1b';
    const appliedSkills = ['2c8278c3-cdfe-42af-8960-ab80f2d6aed7'];

    try {
      // Create an array of promises for all selected users
      const promises = selectedUsers.map(async (userId) => {
        const requestData = {
          opportunity_id: opportunityId,
          user_id: userId,
          status_id: statusId,
          applied_skills: appliedSkills,
        };

        const response = await applyToOpportunity(requestData);
        return response.responseCode === 200; // Return true if successful, false otherwise
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);

      // Count successes and failures
      const successCount = results.filter((result) => result).length;
      const failureCount = results.length - successCount;

      // Display a single toast message based on the results
      if (successCount > 0) {
        showToastMessage(
          `${successCount} user(s) mapped successfully!`,
          'success'
        );
      }

      if (failureCount > 0) {
        showToastMessage(`${failureCount} user(s) failed to map.`, 'error');
      }
    } catch (error) {
      console.error('Error submitting mapping:', error);
      // showToastMessage("Something went wrong!", "error");
    }
  };

  // Function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  // Handle search input
  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    const filtered = userData?.filter(
      (data) =>
        data?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        data?.enrollmentNumber
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/opportunities')}
          sx={{ mb: 2 }}
        >
          {t('OPPORTUNITY.BACK_TO_OPPORTUNITY')}
        </Button>
        <Typography variant="h3" mb={3} gutterBottom>
          {t('OPPORTUNITY.MAP_YOUTH_TO_OPPORTUNITY')} {oppportunityName}
        </Typography>

        {/* Search Box */}
        <Box mb={2}>
          <SearchInput
            // fullWidth
            onSearch={handleSearch}
            defaultValue={searchTerm}
            placeholder={t('OPPORTUNITY.SEARCH_YOUTH')}
          />
        </Box>

        {/* Cohort Filter Dropdown */}
        <FormControl
          fullWidth
          sx={{
            mb: 2,
          }}
        >
          <InputLabel>{t('OPPORTUNITY.SELECT_BATCH')}</InputLabel>
          <Select
            label={t('OPPORTUNITY.SELECT_BATCH')}
            value={cohortId.length > 1 ? 'all' : cohortId} // Set "all" if multiple cohort IDs are selected
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue === 'all') {
                // Extract all cohort IDs from myCohorts
                const allCohortIds = myCohorts.map((cohort) => cohort.cohortId);
                setCohortId(allCohortIds); // Set cohortId to an array of all cohort IDs
              } else {
                setCohortId([selectedValue]); // Set cohortId to the selected value
              }
            }}
            fullWidth
          >
            <MenuItem value="all">All Batch</MenuItem>
            {myCohorts?.map((cohort) => (
              <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                {cohort.cohortName || cohort.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <List>
          {filteredData.length > 0 ? (
            filteredData.map((user) => (
              <ListItem
                key={user.userId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #0000001A',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      boxShadow:
                        '0px 2px 6px 2px #00000026, 0px 1px 2px 0px #0000004D',
                      border: '1.5px solid #B3B3B3',
                      background: 'white',
                      color: '#1F1B13',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: '500',
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    color: '#2C2C2C',
                    fontWeight: '400',
                    '& p': {
                      marginBottom: 0, // Remove bottom margin
                    },
                  }}
                  primary={user.name}
                  // secondary={user.enrollmentNumber}
                />
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user.userId)}
                  onClick={() => handleToggle(user.userId)}
                  disableRipple
                />
              </ListItem>
            ))
          ) : (
            <Typography
              sx={{
                textAlign: 'center',
                color: '#2C2C2C',
                fontWeight: '500',
                marginTop: '16px',
              }}
            >
              No youth found
            </Typography>
          )}
        </List>

        <Box
          textAlign="center"
          mt={2}
          borderTop={'1px solid #D0C5B4'}
          p={'16px 16px 24px'}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              p: '10px',
              fontWeight: '500',
            }}
            color="primary"
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0}
          >
            {t('OPPORTUNITY.ADD')} ({selectedUsers.length})
          </Button>
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

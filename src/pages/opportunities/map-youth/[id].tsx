import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from '@/components/Header';
import { limit } from '@/utils/app.constant';
import useStore from '@/store/store';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { Container, Typography, Box, List, ListItem, ListItemAvatar, ListItemText, Checkbox, Button, Avatar, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { showToastMessage } from '@/components/Toastify';
import { toPascalCase } from '@/utils/Helper';
import SearchBar from '@/components/Searchbar';
import { useTranslation } from 'next-i18next';
import { applyToOpportunity, getAppliedUsers } from "@/lib/api"
import { getCohortList } from '@/services/CohortServices';

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
  const setCohortLearnerCount = useStore((state) => state.setCohortLearnerCount);
  const [userData, setUserData] = useState<UserDataProps[]>([]);
  const [filteredData, setFilteredData] = useState<UserDataProps[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const opportunityId = router.query.id;
  const { t } = useTranslation();
  const [myCohorts, setMyCohorts] = useState<any[]>([]);
  const [cohortId, setCohortId] = useState<string>("");

  useEffect(() => {
  if (typeof window !== "undefined" && window.localStorage) {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const getMyCohortList = async () => {
        const response = await getCohortList(userId);
        
        // Filter cohorts where type is "COHORT"
        const cohortList = response.filter((center: any) => center.type === "COHORT");
        console.log(cohortList, "cohortList");
        
        
        setMyCohorts(cohortList); // Set only the filtered cohorts
        
        if (cohortList.length > 0) {            
          setCohortId(cohortList[0].cohortId); // Default to the first cohort
        }
      };
      getMyCohortList();
    }
  }
}, []);


  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (cohortId && opportunityId) {
          const page = 0;
          const filters = { cohortId };

          // Fetch all users in the cohort
          const response = await getMyCohortMemberList({ limit, page, filters });
          const cohortUsers = response?.result?.userDetails || [];

          // Fetch applied users
          const appliedUsersList = await getAppliedUsers(opportunityId);

          if (!appliedUsersList?.result?.data || !Array.isArray(appliedUsersList.result.data)) {
            console.error("Unexpected appliedUsersList structure:", appliedUsersList);
            showToastMessage("Error fetching applied users", "error");
            return;
          }

          // Extract user IDs from all applications
          const appliedUsers = appliedUsersList.result.data.map((applicant: any) => applicant.application_user_id);

          // Filter out users who have already applied
          const filteredUsers = cohortUsers.filter((user: any) => !appliedUsers.includes(user.userId));

          const userDetails = filteredUsers.map((user: any) => ({
            name: toPascalCase(user?.firstName || '') + ' ' + (user?.lastName ? toPascalCase(user.lastName) : ""),
            userId: user?.userId,
            memberStatus: user?.status,
            cohortMembershipId: user?.cohortMembershipId,
            enrollmentNumber: user?.username,
          }));

          setCohortLearnerCount(userDetails.length);
          setUserData(userDetails);
          setFilteredData(userDetails);
        }
      } catch (error) {
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
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      showToastMessage("Please select at least one user", "error");
      return;
    }
    const statusId = "adb327a6-7abb-4f7a-9810-eff745071a1b";
    const appliedSkills = ["2c8278c3-cdfe-42af-8960-ab80f2d6aed7"];

    try {
      for (const userId of selectedUsers) {
        const requestData = {
          opportunity_id: opportunityId,
          user_id: userId,
          status_id: statusId,
          applied_skills: appliedSkills,
        };

        const response = await applyToOpportunity(requestData);

        if (response.responseCode === 200) {
          showToastMessage(`User mapped successfully!`, "success");
        } else {
          showToastMessage(response.message || `Failed to map user`, "error");
        }
      }
    } catch (error) {
      console.error("Error submitting mapping:", error);
      showToastMessage("Something went wrong!", "error");
    }
  };

  // Function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Handle search input
  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    const filtered = userData?.filter((data) =>
      data?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      data?.enrollmentNumber?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/opportunities")} sx={{ mb: 2 }}>
          {t('OPPORTUNITY.BACK_TO_OPPORTUNITY')}
        </Button>
        <Typography variant="h5" gutterBottom textAlign="center">
          {t('OPPORTUNITY.MAP_YOUTH_TO_OPPORTUNITY')} {opportunityId}
        </Typography>

        {/* Cohort Filter Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('OPPORTUNITY.SELECT_BATCH')}</InputLabel>
          <Select
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
          >
            {myCohorts.map((cohort) => (
              <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                {cohort.cohortName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Box */}
        <SearchBar onSearch={handleSearch} value={searchTerm} placeholder={t('OPPORTUNITY.SEARCH_YOUTH')} />

        <List>
          {filteredData.map((user) => (
            <ListItem key={user.userId} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemAvatar>
                <Avatar>{getInitials(user.name)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.enrollmentNumber} />
              <Checkbox edge="end" checked={selectedUsers.includes(user.userId)} onClick={() => handleToggle(user.userId)} disableRipple />
            </ListItem>
          ))}
        </List>

        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={selectedUsers.length === 0}>
            {t('OPPORTUNITY.ADD')} ({selectedUsers.length})
          </Button>
        </Box>
      </Container>
    </>
  );
}

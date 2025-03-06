import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, IconButton, Tooltip, Box, CardActions, Button, Chip, Modal, List, ListItem, ListItemText, CircularProgress, Select, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import { useRouter } from 'next/router';
import { getAppliedUsers, updateApplicationStatus, fetchApplicationStatuses } from "@/lib/api"; // Import API functions
import { getUserDetails } from "@/services/ProfileService";
import { Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTranslation } from "next-i18next";
import type { OpportunityList } from "@/types/opportunity"


interface Status {
  status: string;
  id: string;
  status_name: string;
}

interface StatusOption {
  label: string;
  value: string;
}

interface OpportunitiesListProps {
  data: OpportunityList[];
  onEdit: (opportunity: OpportunityList) => void;
  onDelete: (opportunity: OpportunityList) => void;
  onView: (opportunity: OpportunityList) => void;
}

export function OpportunitiesList({ data, onEdit, onDelete, onView }:OpportunitiesListProps) {
  const router = useRouter();
  const [userList, setUserList] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>();
  const { t } = useTranslation();

  // Fetch application statuses from API
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetchApplicationStatuses();
        console.log(response,"response");
        
        if (response && response.result) {
          setStatusOptions(response.result.map((status: Status) => ({ label: status.status, value: status.id })));
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatuses();
  }, []);

  const fetchMappedUsers = async (opportunityId:string) => {
    setSelectedOpportunity(opportunityId);
    setLoadingUsers(true);
    setOpenModal(true);
    try {
      const appliedUsersList = await getAppliedUsers(opportunityId);
      const appliedUsers = appliedUsersList.result.data.map((user:any) => {
        const matchedStatus = statusOptions.find((status) => status.label === user.status_name);
        
        return {
          applicationId: user.application_id,
          userId: user.application_user_id,
          status: matchedStatus ? matchedStatus.value : "", // Store the status ID
          originalStatus: matchedStatus ? matchedStatus.value : "",
        };
      });

      const userDetailsPromises = appliedUsers.map((user:any) =>
        getUserDetails(user.userId).then((details) => ({
          ...user,
          name: `${details.result.userData.firstName} ${details.result.userData.lastName || ""}`.trim(),
        }))
      );

      const users = await Promise.all(userDetailsPromises);
      if(users.length === 0){
        router.push(`opportunities/map-youth/${opportunityId}`);
      }
      setUserList(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    } finally {
      setLoadingUsers(false);
    }
  };


  const handleUpdateStatus = async () => {
    try {
      const updatePromises = userList.map(async (user:any) => {
        if (user.status !== user.originalStatus) {
          await updateApplicationStatus(user.applicationId, user.status);
        }
      });

      await Promise.all(updatePromises);
      alert("Statuses updated successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Failed to update statuses.");
    }
  };

  const handleStatusChange = (applicationId:any, newStatus:string) => {
    setUserList((prevList:any) =>
      prevList.map((user:any) =>
        user.applicationId === applicationId ? { ...user, status: newStatus } : user
      )
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        {data.length > 0 ? (
          data.map((opportunity:any) => (
            <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
              <Card
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 10 }, borderRadius: 4, padding: 1, border: "1px solid black" }}
                onClick={() => onView(opportunity)}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ fontWeight: "bold", color: "#1A0DAB", cursor: "pointer", textDecoration: "underline" }}
                  >
                    {opportunity.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon fontSize="small" color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      {opportunity?.company?.name || "Unknown Company"}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <LocationOnIcon fontSize="small" color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      {opportunity?.location?.city}, {opportunity?.location?.state}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <WorkIcon fontSize="small" color="disabled" />
                    <Typography variant="body2" color="text.secondary">
                      {opportunity.opportunity_type || "Full Time"} | {opportunity.experience_level || "Immediate Joiner"}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <Box component="span" sx={{ fontWeight: "bold" }}>KES</Box> {Math.floor(opportunity.min_salary)} - {Math.floor(opportunity.max_salary)}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
                    <Chip 
                      label={`${t('OPPORTUNITY.MAPPED_USERS')}: ${opportunity?.stats?.mapped || 0}`} 
                      sx={{ backgroundColor: "#E0E0E0", color: "black" }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchMappedUsers(opportunity.id);
                      }}
                    />
                  </Box>

                </CardContent>

                <CardActions>
                  <Box sx={{ ml: "auto" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(opportunity);
                        }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(opportunity);
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
                {opportunity.status === "approved" &&
                  <Box p={1} textAlign="center">
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ backgroundColor: "var", color: "black", "&:hover": { backgroundColor: "#333" } }}
                    onClick={(e) => {
                        e.stopPropagation();
                        fetchMappedUsers(opportunity.id);
                      }}
                  >
                    {t('OPPORTUNITY.MAP_OR_UPDATE_STATUS')}
                  </Button>
                </Box>}
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center">{t('OPPORTUNITY.NO_RESULT_FOUND')}</Typography>
          </Grid>
        )}
      </Grid>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 
        }}>
          <Typography variant="h4" gutterBottom>{t('OPPORTUNITY.MAP_OR_UPDATE_STATUS')}</Typography>
           <Button
      fullWidth
      variant="text"
      startIcon={<PersonAddIcon />}
      sx={{ 
        justifyContent: "flex-start",
        color: "black",
        fontWeight: "bold",
        textTransform: "none",
        mb: 2
      }}
      onClick={() => router.push(`opportunities/map-youth/${selectedOpportunity}`)} // Navigate to youth mapping page
    >
     {t('OPPORTUNITY.ADD_YOUTH')}
    </Button>
          {loadingUsers ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
              <CircularProgress />
            </Box>
          ) : userList.length > 0 ? (
            <List>
              {userList.map((user:any) => (
                <ListItem key={user.applicationId}>
                  <ListItemText primary={user.name} />
                  <Select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.applicationId, e.target.value)}
                    size="small"
                  >
                    {statusOptions.map((status:any) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>{t('OPPORTUNITY.NO_YOUTH_FOUND')}</Typography>
          )}

          <Box mt={2} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleUpdateStatus}>
              {t('OPPORTUNITY.UPDATE')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

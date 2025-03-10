import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CardActions,
  Avatar,
  Button,
  Chip,
  Modal,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import {
  getAppliedUsers,
  updateApplicationStatus,
  fetchApplicationStatuses,
} from '@/lib/api'; // Import API functions
import { getUserDetails } from '@/services/ProfileService';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useTranslation } from 'next-i18next';
import type { OpportunityList } from '@/types/opportunity';

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

export function OpportunitiesList({
  data,
  onEdit,
  onDelete,
  onView,
}: OpportunitiesListProps) {
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
        console.log(response, 'response');

        if (response && response.result) {
          setStatusOptions(
            response.result.map((status: Status) => ({
              label: status.status,
              value: status.id,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching statuses:', error);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatuses();
  }, []);

  const fetchMappedUsers = async (opportunityId: string) => {
    setSelectedOpportunity(opportunityId);
    setLoadingUsers(true);
    setOpenModal(true);
    try {
      const appliedUsersList = await getAppliedUsers(opportunityId);
      const appliedUsers = appliedUsersList.result.data.map((user: any) => {
        const matchedStatus = statusOptions.find(
          (status) => status.label === user.status_name
        );

        return {
          applicationId: user.application_id,
          userId: user.application_user_id,
          status: matchedStatus ? matchedStatus.value : '', // Store the status ID
          originalStatus: matchedStatus ? matchedStatus.value : '',
        };
      });

      const userDetailsPromises = appliedUsers.map((user: any) =>
        getUserDetails(user.userId).then((details) => ({
          ...user,
          name: `${details.result.userData.firstName} ${details.result.userData.lastName || ''}`.trim(),
        }))
      );

      const users = await Promise.all(userDetailsPromises);
      if (users.length === 0) {
        router.push(`opportunities/map-youth/${opportunityId}`);
      }
      setUserList(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUserList([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const openAddYouth = ()=>{

  }

  // Function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const handleUpdateStatus = async () => {
    try {
      const updatePromises = userList.map(async (user: any) => {
        if (user.status !== user.originalStatus) {
          await updateApplicationStatus(user.applicationId, user.status);
        }
      });

      await Promise.all(updatePromises);
      alert('Statuses updated successfully!');
      setOpenModal(false);
    } catch (error) {
      console.error('Error updating statuses:', error);
      alert('Failed to update statuses.');
    }
  };

  const handleStatusChange = (applicationId: any, newStatus: string) => {
    setUserList((prevList: any) =>
      prevList.map((user: any) =>
        user.applicationId === applicationId
          ? { ...user, status: newStatus }
          : user
      )
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        {data.length > 0 ? (
          data.map((opportunity: any) => (
            <Grid item xs={12} sm={6} lg={4} key={opportunity.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px;',
                  // '&:hover': { boxShadow: 10 },
                  borderRadius: 4,
                  padding: 1,
                  minHeight: { sm: '355px' },
                }}
                onClick={() => onView(opportunity)}
              >
                <CardContent>
                  <Typography
                    variant="h2"
                    gutterBottom
                    mb={1}
                    sx={{
                      color: '#101828',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      minHeight: '48px',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-word',
                    }}
                  >
                    {opportunity.title
                      ? opportunity.title
                      : opportunity.opportunity_title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={'12px'}>
                    <BusinessIcon fontSize="small" sx={{ color: '#484848' }} />
                    <Typography
                      sx={{
                        fontWeight: '400',
                        color: '#484848',
                        letterSpacing: '0.32px',
                      }}
                      variant="body2"
                      mb={0}
                    >
                      {opportunity?.company?.name
                        ? opportunity?.company?.name
                        : opportunity.company_name || 'Unknown Company'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={'12px'} mt={1}>
                    <LocationOnIcon
                      fontSize="small"
                      sx={{ color: '#484848' }}
                    />
                    <Typography
                      sx={{
                        fontWeight: '400',
                        color: '#484848',
                        letterSpacing: '0.32px',
                      }}
                      variant="body2"
                      mb={0}
                    >
                      {opportunity?.location?.city
                        ? opportunity?.location?.city
                        : opportunity.location_city}
                      ,{' '}
                      {opportunity?.location?.state
                        ? opportunity?.location?.state
                        : opportunity.location_state}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={'12px'}
                    mt={1}
                    mb={1}
                  >
                    <WorkIcon fontSize="small" sx={{ color: '#484848' }} />
                    <Typography
                      sx={{
                        fontWeight: '400',
                        color: '#484848',
                        letterSpacing: '0.32px',
                      }}
                      variant="body2"
                      mb={0}
                    >
                      {opportunity.opportunity_type
                        ? opportunity.opportunity_type
                        : opportunity.opportunity_opportunity_type ||
                          'Full Time'}{' '}
                      |{' '}
                      {opportunity.experience_level
                        ? opportunity.experience_level
                        : opportunity.opportunity_experience_level ||
                          'Immediate Joiner'}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: '400',
                      color: '#484848',
                      letterSpacing: '0.32px',
                    }}
                    variant="body2"
                    mb={0}
                  >
                    KES{' '}
                    {Math.floor(
                      opportunity.min_salary
                        ? opportunity.min_salary
                        : opportunity.opportunity_min_salary
                    )}{' '}
                    -{' '}
                    {Math.floor(
                      opportunity.max_salary
                        ? opportunity.max_salary
                        : opportunity.opportunity_max_salary
                    )}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={` ${opportunity?.stats?.mapped || 0} ${t('OPPORTUNITY.MAPPED_USERS')}`}
                      sx={{
                        backgroundColor: '#E0E0E0 !important',
                        color: '#1F1B13',
                        borderRadius: '8px',
                        p: '8px',
                        fontWeight: '500',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchMappedUsers(opportunity.id);
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions>
                  <Box sx={{ ml: 'auto' }}>
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
                {opportunity.status === 'approved' && (
                  <Box p={1} textAlign="center">
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: 'var',
                        p: '10px',
                        color: '#1F1B13',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchMappedUsers(opportunity.id);
                      }}
                    >
                      {t('OPPORTUNITY.MAP_OR_UPDATE_STATUS')}
                    </Button>
                  </Box>
                )}


              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center">
              {t('OPPORTUNITY.NO_RESULT_FOUND')}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Modal open={openModal}>
        <Box
          pt={3}
          position={'absolute'}
          top={'50%'}
          left={'50%'}
          maxWidth={'400px'}
          width={'100%'}
          bgcolor={'white'}
          borderRadius={'16px'}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            borderBottom={'1px solid #D0C5B4'}
            paddingBottom={2}
            px={2}
          >
            <Typography
              variant="h3"
              lineHeight={'24px'}
              color={'#4D4639'}
              fontWeight={'500'}
              gutterBottom
            >
              {t('OPPORTUNITY.MAP_OR_UPDATE_STATUS')}
            </Typography>
            <CloseIcon
              onClick={() => setOpenModal(false)}
              sx={{
                ml: 2,
                fontSize: '24px',
                color: '#4D4639',
                cursor: 'pointer',
              }}
            />
          </Box>

          <Button
            sx={{
              p: '24px 16px',
              justifyContent: 'start',
              color: '#313131',
              fontWeight: '500',
            }}

            variant="text"
            endIcon={<PersonAddAltIcon />}
            onClick={() =>
              router.push(`opportunities/map-youth/${selectedOpportunity}`)
            } // Navigate to youth mapping page
          >
            {t('OPPORTUNITY.ADD_YOUTH')}
          </Button>
          {loadingUsers ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : userList.length > 0 ? (
            <List sx={{ p: 0 }}>
              {userList.map((user: any) => (
                <ListItem
                  key={user.applicationId}
                  sx={{
                    p: '12px 16px',
                    borderTop: '1px solid #0000001A',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box display={'flex'} alignItems={'center'} gap={'8px'}>
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
                    <ListItemText primary={user.name} />
                  </Box>
                  <Select
                    value={user.status}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      color: '#313131',
                      '& fieldset': {
                        border: 'none',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#313131', // Change dropdown arrow color
                      },
                    }}
                    onChange={(e) =>
                      handleStatusChange(user.applicationId, e.target.value)
                    }
                    size="small"
                  >
                    {statusOptions.map((status: any) => (
                      <MenuItem
                        key={status.value}
                        value={status.value}
                        sx={{ textTransform: 'capitalize' }}
                      >
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

          <Box textAlign="center" p={2} borderTop={'1px solid #D0C5B4'} mt={3}>
            <Button
              variant="contained"
              sx={{ py: '10px', width: '100%', fontWeight: '500' }}
              color="primary"
              onClick={handleUpdateStatus}
            >
              {t('OPPORTUNITY.SAVE')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

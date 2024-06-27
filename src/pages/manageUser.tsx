import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import Box from '@mui/material/Box';
import Header from '@/components/Header';
import InputAdornment from '@mui/material/InputAdornment';
import ManageCentersModal from '@/components/ManageCentersModal';
import ManageUsersModal from '@/components/ManageUsersModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import {
  assignCentersToFacilitator,
  getFacilitatorList,
} from '@/services/ManageUser';
import { cohortList } from '@/services/CohortServices';
import { showToastMessage } from '@/components/Toastify';
import BottomDrawer from '@/components/BottomDrawer';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { editEditUser } from '@/services/ProfileService';

interface Cohort {
  cohortId: string;
  parentId: string;
  name: string;
}

interface User {
  name: string;
  userId: string;
}

type CohortsData = {
  [userId: string]: Cohort[];
};
type Anchor = 'bottom';

const manageUsers = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();

  const [value, setValue] = React.useState(1);
  const [users, setUsers] = useState<
    { name: string; district: string; userId: string }[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [cohortsData, setCohortsData] = useState<CohortsData>({});
  const [centersData, setCentersData] = useState<Cohort[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [centers, setCenters] = useState<string[]>([]);
  const [centerList, setCenterList] = useState<string[]>([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [state, setState] = React.useState({
    bottom: false,
  });

  useEffect(() => {
    const getFacilitator = async () => {
      setLoading(true);
      try {
        let state, district;
        if (typeof window !== 'undefined' && window.localStorage) {
          state = localStorage.getItem('state');
          district = localStorage.getItem('district');
        }
        if (state && district) {
          const limit = 0;
          const page = 0;
          const filters = {
            state: state,
            district: district,
            role: 'Teacher',
          };

          const resp = await getFacilitatorList({ limit, page, filters });
          console.log(resp);
          const extractedData = resp.map((user: any) => ({
            userId: user.userId,
            name: user.name,
          }));
          setTimeout(() => {
            setUsers(extractedData);
          });
        }
      } catch (error) {
        console.log(error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      }
    };
    getFacilitator();
  }, []);

  useEffect(() => {
    const fetchCohortListForUsers = async () => {
      setLoading(true);
      try {
        if (users.length > 0) {
          const fetchCohortPromises = users.map((user) => {
            const limit = 0;
            const page = 0;
            const filters = { userId: user.userId };
            return cohortList({ limit, page, filters }).then((resp) => ({
              userId: user.userId,
              cohorts: resp?.results?.cohortDetails || [],
            }));
          });

          const cohortResponses = await Promise.all(fetchCohortPromises);
          console.log('cohortResponses', cohortResponses);
          const allCohortsData: CohortsData = cohortResponses.reduce(
            (acc: CohortsData, curr) => {
              acc[curr.userId] = curr.cohorts.map((item: Cohort) => ({
                cohortId: item?.cohortId,
                parentId: item?.parentId,
                name: item?.name,
              }));
              return acc;
            },
            {}
          );
          console.log('allCohortsData', allCohortsData);

          setCohortsData(allCohortsData);
        }
      } catch (error) {
        console.log(error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCohortListForUsers();
  }, [users]);

  const handleModalToggle = (user: any) => {
    setSelectedUser(user);
    setSelectedUserName(user.name);
    setCenters(cohortsData[user.userId]?.map((cohort) => cohort.name) || []);
    setOpen(true);
    // logEvent({
    //   action: 'mark/modify-attendance-button-clicked-dashboard',
    //   category: 'Dashboard Page',
    //   label: 'Mark/ Modify Attendance',
    // });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean, user: any) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      setCenters(cohortsData[user.userId]?.map((cohort) => cohort.name) || []);
      setSelectedUser(user);

      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, bottom: open });
    };

  const listItemClick = async (event: React.MouseEvent, name: string) => {
    if (name === 'delete-User') {
      const name = selectedUser?.name || '';
      const userId = selectedUser?.userId || '';
      console.log('user deleted', name, userId);
      try {
        if (userId) {
          const userData = {
            name: name,
            status: 'archived',
          };
          const response = await editEditUser(userId, { userData });
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
    }
    if (name === 'manage-centers') {
      setOpenCentersModal(true);
      getTeamLeadersCenters();
    }
  };

  const handleCloseCentersModal = () => {
    setOpenCentersModal(false);
  };

  const getTeamLeadersCenters = async () => {
    const parentId = localStorage.getItem('classId');
    setLoading(true);
    try {
      if (parentId) {
        const limit = 0;
        const page = 0;
        const filters = { parentId: [parentId] };
        const resp = await cohortList({ limit, page, filters });

        const extractedNames = resp?.results?.cohortDetails;
        // localStorage.setItem('parentCohortId', extractedNames?.[0].parentId);

        const filteredData = extractedNames
          ?.map((item: any) => ({
            cohortId: item?.cohortId,
            parentId: item?.parentId,
            name: item?.name,
          }))
          ?.filter(Boolean);
        setCentersData(filteredData);
        if (filteredData && Array.isArray(filteredData)) {
          const teamLeaderCenters = filteredData?.map((center) => center.name);
          setCenterList(teamLeaderCenters.concat(centers));
        }
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  const handleAssignCenters = async (selectedCenters: any) => {
    console.log('selectedUser', selectedUser);
    try {
      const selectedUserIds = [selectedUser?.userId];

      const matchedCohortIdsFromCohortsData = Object.values(cohortsData)
        .flatMap((cohorts) => cohorts)
        .filter((cohort) => selectedCenters.includes(cohort.name))
        .map((cohort) => cohort.cohortId);

      const matchedCohortIdsFromCentersData = centersData
        .filter((center) => selectedCenters.includes(center.name))
        .map((center) => center.cohortId);

      const matchedCohortIds = Array.from(
        new Set([
          ...matchedCohortIdsFromCohortsData,
          ...matchedCohortIdsFromCentersData,
        ])
      );

      console.log('matchedCohortIds', matchedCohortIds);
      console.log('selectedUserIds', selectedUserIds);

      // const response = await assignCentersToFacilitator({
      //   userId: selectedUserIds,
      //   cohortId: matchedCohortIds,
      // });
      // console.log(response);
      // if (response) {
      //   centers;
      //   handleCloseCentersModal();
      //   toggleDrawer('bottom', false, '');
      // }
    } catch (error) {
      console.error('Error assigning centers:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ padding: '0 18px' }} className="mt--4">
        <Box
          textAlign={'left'}
          fontSize={'22px'}
          p={'18px 0'}
          color={theme?.palette?.warning['300']}
        >
          {t('COMMON.MANAGE_USERS')}
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,

            '& .MuiTab-root': {
              color: theme.palette.warning['A200'],
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: theme.palette.warning['A200'],
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('COMMON.FACILITATORS')} />
        </Tabs>
      </Box>
      <Box>
        {value === 1 && (
          <>
            <Grid
              px={'18px'}
              spacing={2}
              mt={1}
              sx={{ display: 'flex', alignItems: 'center' }}
              container
            >
              <Grid item xs={8}>
                <Box>
                  <TextField
                    className="input_search"
                    placeholder={t('COMMON.SEARCH_FACILITATORS')}
                    color="secondary"
                    focused
                    sx={{
                      borderRadius: '100px',
                      height: '40px',
                      // width: '225px',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} marginTop={'8px'}>
                <Box>
                  <FormControl className="drawer-select" sx={{ width: '100%' }}>
                    <Select
                      displayEmpty
                      style={{
                        borderRadius: '0.5rem',
                        color: theme.palette.warning['200'],
                        width: '100%',
                        marginBottom: '0rem',
                      }}
                    >
                      <MenuItem className="text-dark-grey fs-14 fw-500">
                        {t('COMMON.FILTERS')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Box>
              <Box px={'18px'} mt={3}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '15px',
                  }}
                >
                  <Box
                    sx={{ gap: '15px', alignItems: 'center' }}
                    width={'100%'}
                  >
                    {users.length !== 0 &&
                      users.map((user) => (
                        <Box
                          key={user.userId}
                          display={'flex'}
                          borderBottom={`1px solid ${theme.palette.warning['A100']}`}
                          width={'100%'}
                          justifyContent={'space-between'}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Box onClick={() => handleModalToggle(user)}>
                            <Box
                              sx={{
                                fontSize: '16px',
                                color: theme.palette.warning['300'],
                              }}
                            >
                              {user.name}
                            </Box>

                            <Box display={'flex'}>
                              {cohortsData[user.userId] &&
                                cohortsData[user.userId].map((cohort) => (
                                  <Box
                                    key={cohort.cohortId}
                                    sx={{
                                      padding: '4px',
                                      color: theme.palette.success.contrastText,
                                      fontSize: '12px',
                                      borderRadius: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          theme.palette.warning.contrastText,
                                        fontWeight: '500',
                                      }}
                                    >
                                      {cohort.name}
                                    </span>
                                  </Box>
                                ))}
                            </Box>
                          </Box>
                          <Box>
                            <MoreVertIcon
                              onClick={toggleDrawer('bottom', true, user)}
                              sx={{
                                fontSize: '24px',
                                color: theme.palette.warning['300'],
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
              <ManageUsersModal
                open={open}
                onClose={handleClose}
                leanerName={selectedUserName ?? ''}
                centerName={centers}
              />
              <BottomDrawer
                toggleDrawer={toggleDrawer}
                state={state}
                listItemClick={listItemClick}
                optionList={[
                  {
                    label: t('COMMON.MANAGE_CENTERS'),
                    icon: (
                      <ApartmentIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'manage-centers',
                  },
                  {
                    label: t('COMMON.DELETE_USER'),
                    icon: (
                      <DeleteOutlineIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'delete-User',
                  },
                ]}
              >
                <Box
                  bgcolor={theme.palette.success.contrastText}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  margin={'0rem 0.5rem 0rem 0.5rem'}
                  padding={'1rem'}
                  borderRadius={'1rem'}
                >
                  <Box>{t('COMMON.CENTERS_ASSIGNED')}</Box>
                  <Box>
                    {centers.length > 0 &&
                      centers?.map((name) => (
                        <Button
                          sx={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: `1px solid ${theme.palette.warning[900]}`,
                            margin: '5px',
                          }}
                          className="text-dark-grey"
                        >
                          {name}
                        </Button>
                      ))}
                  </Box>
                </Box>
              </BottomDrawer>

              <ManageCentersModal
                open={openCentersModal}
                onClose={handleCloseCentersModal}
                centersName={centerList}
                centers={centers}
                onAssign={handleAssignCenters}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
export default manageUsers;

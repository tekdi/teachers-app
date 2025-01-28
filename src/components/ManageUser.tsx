import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import BottomDrawer from '@/components/BottomDrawer';
import ConfirmationModal from '@/components/ConfirmationModal';
import ManageCentersModal from '@/components/ManageCentersModal';
import ManageUsersModal from '@/components/ManageUsersModal';
import { showToastMessage } from '@/components/Toastify';
import { cohortList, getCohortList } from '@/services/CohortServices';
import { getMyUserList } from '@/services/MyClassDetailsService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import { QueryKeys, Role, Status, Telemetry } from '@/utils/app.constant';
import { getUserFullName, toPascalCase } from '@/utils/Helper';
import { telemetryFactory } from '@/utils/telemetry';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setTimeout } from 'timers';
import { useDirection } from '../hooks/useDirection';
import manageUserStore from '../store/manageUserStore';
import AddFacilitatorModal from './AddFacilitator';
import CustomPagination from './CustomPagination';
import DeleteUserModal from './DeleteUserModal';
import Loader from './Loader';
import ReassignModal from './ReassignModal';
import SearchBar from './Searchbar';
import SimpleModal from './SimpleModal';

interface Cohort {
  cohortId: string;
  parentId: string;
  name: string;
}
interface User {
  name: string;
  userId: string;
  block: string;
}

type CohortsData = {
  [userId: string]: Cohort[];
};
type Anchor = 'bottom';

interface ManageUsersProps {
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  cohortData?: any;
  isFromFLProfile?: boolean;
  teacherUserId?: string;
}

const ManageUser: React.FC<ManageUsersProps> = ({
  reloadState,
  setReloadState,
  cohortData,
  isFromFLProfile = false,
  teacherUserId,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const store = manageUserStore();
  const newStore = useStore();
  const queryClient = useQueryClient();
  const { isRTL } = useDirection();
  const isActiveYear = newStore.isActiveYearSelected;

  const [value, setValue] = React.useState(1);
  const [users, setUsers] = useState<
    {
      name?: string;
      firstName?: string;
      lastName?: string;
      userId: string;
      cohortNames?: string;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [cohortsData, setCohortsData] = useState<CohortsData>();
  const [centersData, setCentersData] = useState<Cohort[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [centers, setCenters] = useState<any>([]);
  const [centerList, setCenterList] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [offset, setOffSet] = useState(0);
  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteData, setInfiniteData] = useState(users || []);

  const [state, setState] = React.useState({
    bottom: false,
  });
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [reassignModalOpen, setReassignModalOpen] =
    React.useState<boolean>(false);

  const [openDeleteUserModal, setOpenDeleteUserModal] = React.useState(false);
  const [isFacilitatorAdded, setIsFacilitatorAdded] = React.useState(false);
  const [openRemoveUserModal, setOpenRemoveUserModal] = React.useState(false);
  const [removeCohortNames, setRemoveCohortNames] = React.useState('');
  const [reassignCohortNames, setReassignCohortNames] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: 'underline',
    textDecorationColor: theme?.palette?.secondary.main,
    textDecorationThickness: '1px',
  }));
  const setCohortDeleteId = manageUserStore((state) => state.setCohortDeleteId);
  const [openAddFacilitatorModal, setOpenFacilitatorModal] =
    React.useState(false);
  const setReassignFacilitatorUserId = reassignLearnerStore(
    (state) => state.setReassignFacilitatorUserId
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [TotalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

  useEffect(() => {
    const getFacilitator = async () => {
      if (!isMobile) {
        setLoading(true);
      }
      try {
        const cohortId = cohortData
          .map((block: any) => {
            return block?.blockId;
          })
          .join('');

        if (cohortId) {
          const limit = 10;
           const page = offset;
          const filters = {
            states: store.stateCode,
            districts: store.districtCode,
            blocks: store.blockCode,
            role: Role.TEACHER,
            status: [Status.ACTIVE],
          };
          const fields = ['age'];
          // const test = isMobile ? infinitePage : page
          const resp = await getMyUserList({ limit, page, filters, fields });
          // const resp = await queryClient.fetchQuery({
          //   // queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR, filters],
          //   queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR],
          //   queryFn: () => getMyUserList({ limit, page, filters, fields }),
          // });
          const facilitatorList = resp.result?.getUserDetails;

          setTotalCount(resp.result?.totalCount);

          if (!facilitatorList || facilitatorList?.length === 0) {
            console.log('No users found.');
            return;
          }
          const userIds = facilitatorList?.map((user: any) => user.userId);

          const cohortDetailsPromises = userIds.map((userId: string) =>
            queryClient.fetchQuery({
              queryKey: [QueryKeys.MY_COHORTS, userId],
              queryFn: () => getCohortList(userId, { customField: 'true' }),
            })
          );

          const cohortDetailsResults = await Promise.allSettled(
            cohortDetailsPromises
          );

          const cohortDetails = cohortDetailsResults.map((result) => {
            if (result.status === 'fulfilled') {
              return result.value;
            } else {
              console.error(
                'Error fetching cohort details for a user:',
                result.reason
              );
              return null; // or handle the error as needed
            }
          });

          const extractedData = facilitatorList?.map(
            (user: any, index: number) => {
              const cohorts = cohortDetails[index] || [];

              const cohortNames = cohorts
                .filter(
                  ({ cohortStatus }: any) => cohortStatus === Status.ACTIVE
                )
                .map(({ cohortName }: any) => toPascalCase(cohortName))
                .join(', ');

              return {
                userId: user?.userId,
                name: toPascalCase(getUserFullName({ firstName: user?.firstName, lastName: user?.lastName, name: user?.name })),
                cohortNames: cohortNames || null,
              };
            }
          );

          setUsers(extractedData);
          // setLoading(false);
          if (isMobile) {
           setInfiniteData([...infiniteData, ...extractedData]);
          } else {
            setFilteredUsers(extractedData);
            setInfiniteData(extractedData);
          }

          setTimeout(() => {
            setUsers(extractedData);
            setFilteredUsers(extractedData);
            setLoading(false);
          });
        }
      } catch (error) {
        console.log(error);
        // showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      }
    };
    getFacilitator();
  }, [isFacilitatorAdded, reloadState, page, infinitePage]);

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
    setOpenDeleteUserModal(false);
    setState({ ...state, bottom: false });
  };

  const handleCloseReassignModal = () => {
    setReassignModalOpen(false);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveUserModal(false);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean, user?: any, teacherUserId?: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setCohortDeleteId(isFromFLProfile ? teacherUserId : user.userId);
        if (!isFromFLProfile) {
          const cohortNamesArray = user?.cohortNames?.split(', ');
          const centerNames = cohortNamesArray?.map((cohortName: string) =>
            cohortName.trim()
          ) || [t('ATTENDANCE.NO_CENTERS_ASSIGNED')];
          setCenters(centerNames);
          setSelectedUser(user);
        }

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
      const userId = isFromFLProfile ? teacherUserId : store?.deleteId;
      setUserId(userId);

      const cohortList = await getCohortList(userId);

      const hasActiveCohorts =
        cohortList &&
        cohortList.length > 0 &&
        cohortList.some(
          (cohort: { cohortStatus: string }) =>
            cohort.cohortStatus === Status.ACTIVE
        );

      if (hasActiveCohorts) {
        const cohortNames = cohortList
          .filter(
            (cohort: { cohortStatus: string }) =>
              cohort.cohortStatus === Status.ACTIVE
          )
          .map((cohort: { cohortName: string }) => cohort.cohortName)
          .join(', ');

        setOpenRemoveUserModal(true);
        setRemoveCohortNames(cohortNames);

        const telemetryInteract = {
          context: {
            env: 'teaching-center',
            cdata: [],
          },
          edata: {
            id: 'click-on-delete-user:' + userId,
            type: Telemetry.CLICK,
            subtype: '',
            pageid: 'centers',
          },
        };
        telemetryFactory.interact(telemetryInteract);
      } else {
        console.log(
          'User does not belong to any cohorts, proceed with deletion'
        );
        setOpenDeleteUserModal(true);
      }
    }
    if (name === 'reassign-block') {
      const reassignuserId = isFromFLProfile
        ? teacherUserId
        : selectedUser?.userId;

      setReassignFacilitatorUserId(
        isFromFLProfile ? teacherUserId : selectedUser?.userId
      );

      const fetchCohortList = async () => {
        if (!selectedUser?.userId) {
          console.warn('User ID is undefined');
          return;
        }

        try {
          const cohortList = await getCohortList(
            isFromFLProfile ? teacherUserId ?? '' : selectedUser.userId
          );
          if (cohortList && cohortList?.length > 0) {
            const cohortDetails = cohortList?.map(
              (cohort: {
                cohortName: any;
                cohortId: any;
                cohortStatus: any;
              }) => ({
                name: cohort?.cohortName,
                id: cohort?.cohortId,
                status: cohort?.cohortStatus,
              })
            );
            setReassignCohortNames(cohortDetails);
          }
        } catch (error) {
          console.error('Error fetching cohort list:', error);
        }
      };

      fetchCohortList();
      setReassignModalOpen(true);
      const telemetryInteract = {
        context: {
          env: 'teaching-center',
          cdata: [],
        },
        edata: {
          id: 'click-on-reassign-centers:' + userId,
          type: Telemetry.CLICK,
          subtype: '',
          pageid: 'centers',
        },
      };
      telemetryFactory.interact(telemetryInteract);
      setReloadState(true);
    }
    if (name === 'reassign-centers') {
      setOpenCentersModal(true);
      getTeamLeadersCenters();
    }
    if (name === 'reassign-block-request') {
      // setReassignModalOpen(true);
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
        const offset = 0;
        const filters = { parentId: [parentId] };
        const resp = await cohortList({ limit, offset, filters });

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
          const teamLeaderCenters = filteredData?.map((center) => center?.name);
          setCenterList(teamLeaderCenters.concat(centers));
        }
      }
    } catch (error) {
      console.log(error);
      // showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  const handleAssignCenters = async (selectedCenters: any) => {
    handleCloseCentersModal();
    showToastMessage(
      t('MANAGE_USERS.CENTERS_ASSIGNED_SUCCESSFULLY'),
      'success'
    );
    try {
      const selectedUserIds = [selectedUser?.userId];

      const matchedCohortIdsFromCohortsData = Object.values(cohortsData!)
        .flat()
        .filter((cohort) => selectedCenters?.includes(cohort?.name))
        .map((cohort) => cohort?.cohortId);

      const matchedCohortIdsFromCentersData = centersData
        .filter((center) => selectedCenters?.includes(center?.name))
        .map((center) => center?.cohortId);

      const matchedCohortIds = Array.from(
        new Set([
          ...matchedCohortIdsFromCohortsData,
          ...matchedCohortIdsFromCentersData,
        ])
      );
    } catch (error) {
      console.error('Error assigning centers:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  const handleTeacherFullProfile = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  const handleRequestBlockAction = () => {
    showToastMessage(t('BLOCKS.REASSIGN_BLOCK_REQUESTED'), 'success');

    setState({ ...state, bottom: false });

    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'reassign-block-request-success',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleOpenAddFaciModal = () => {
    setOpenFacilitatorModal(true);
  };

  const handleCloseAddFaciModal = () => {
    setOpenFacilitatorModal(false);
  };

  const handleDeleteUser = () => { };

  const handleFacilitatorAdded = () => {
    setIsFacilitatorAdded((prev) => !prev);
  };
  const handleMenuOpen = (event: any, user?: any) => {
    setAnchorEl(event.currentTarget);

    if (user) {
      setCohortDeleteId(isFromFLProfile ? teacherUserId : user.userId);

      if (!isFromFLProfile) {
        setSelectedUser(user);
      }
    }
  };

  const getCohortNames = (cohortNames: string) => {
    const cohorts = cohortNames.split(', ');
    if (cohorts.length > 2) {
      const names = `${cohorts[0]}, ${cohorts[1]}`;
      return (
        <>
          {names}
          {'  '}
          <span style={{ fontWeight: 400 }}>
            {t('COMMON.AND_COUNT_MORE', { count: cohorts.length - 2 })}
          </span>
        </>
      );
    }
    return cohortNames;
  };
  const handleSearch = (searchTerm: string) => {
    const term = searchTerm;
    setSearchTerm(term);
    setFilteredUsers(
      users?.filter((user) => user?.name?.toLowerCase()?.includes(term))
    );
  };
  const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: 10,
    INFINITE_SCROLL_INCREMENT: 10
  };

  const fetchData = async () => {
    if (infiniteData && (infiniteData.length>=TotalCount)){
      return;
    }    
    try {
      setOffSet((prev) => {
        if (TotalCount && prev + PAGINATION_CONFIG.ITEMS_PER_PAGE <= TotalCount) {
          return prev + PAGINATION_CONFIG.ITEMS_PER_PAGE;
        }
        return prev;
      });

     setInfinitePage((prev) => prev + PAGINATION_CONFIG.INFINITE_SCROLL_INCREMENT);
    } catch (error) {
      console.error('Error fetching more data:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setOffSet((newPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE)
  };

  return (
    <div>
      <Box>
        {value === 1 && (
          <>
            {!isFromFLProfile && isActiveYear && (
              <Grid
                px={'18px'}
                spacing={2}
                mt={1}
                sx={{ display: 'flex', alignItems: 'center', direction: 'row' }}
                container
              >
                <SearchBar
                  onSearch={handleSearch}
                  value={searchTerm}
                  placeholder={t('COMMON.SEARCH_FACILITATORS')}
                />
                <Box mt={'18px'} px={'18px'} ml={'10px'}>
                  <Button
                    sx={{
                      border: `1px solid ${theme.palette.error.contrastText}`,
                      borderRadius: '100px',
                      height: '40px',
                      width: '8rem',
                      color: theme.palette.error.contrastText,
                      '& .MuiButton-endIcon': {
                        marginLeft: isRTL ? '0px !important' : '8px !important',
                        marginRight: isRTL
                          ? '8px !important'
                          : '-2px !important',
                      },
                    }}
                    className="text-1E"
                    onClick={handleOpenAddFaciModal}
                    endIcon={<AddIcon />}
                  >
                    {t('COMMON.ADD_NEW')}
                  </Button>
                </Box>
              </Grid>
            )}

            <Box>
              {isFromFLProfile ? (
                <MoreVertIcon
                  onClick={(event) => {
                    isMobile
                      ? toggleDrawer('bottom', true, teacherUserId)(event)
                      : handleMenuOpen(event, teacherUserId);
                  }}
                  sx={{
                    fontSize: '24px',
                    marginTop: '1rem',
                    color: theme.palette.warning['300'],
                    cursor: 'pointer',
                  }}
                />
              ) : (
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
                      sx={{
                        gap: '15px',
                        alignItems: 'center',
                        '@media (min-width: 600px)': {
                          background: theme.palette.action.selected,
                          padding: '20px',
                          borderRadius: '12px',
                        },
                      }}
                      width={'100%'}
                    >
                      {loading ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Loader
                            showBackdrop={false}
                            loadingText={t('COMMON.LOADING')}
                          />
                        </Box>
                      ) : (
                        <>
                          <Box>
                            <Grid container spacing={2}>
                              {(
                                isMobile
                                  ? infiniteData.length > 0
                                  : filteredUsers.length > 0
                              ) ? (
                                (isMobile ? infiniteData : filteredUsers).map(
                                  (user) => (
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={6}
                                      lg={4}
                                      key={user.userId}
                                    >
                                      <Box
                                        display={'flex'}
                                        borderBottom={`1px solid ${theme.palette.warning['A100']}`}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                        sx={{
                                          cursor: 'pointer',
                                          '@media (min-width: 600px)': {
                                            border: `1px solid  ${theme.palette.action.selected}`,
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background:
                                              theme.palette.warning['A400'],
                                          },
                                        }}
                                      >
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap="5px"
                                        >
                                          <Box>
                                            <CustomLink
                                              className="word-break"
                                              href="#"
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <Typography
                                                onClick={() => {
                                                  handleTeacherFullProfile(
                                                    user?.userId
                                                  );
                                                }}
                                                sx={{
                                                  textAlign: 'left',
                                                  fontSize: '16px',
                                                  fontWeight: '400',
                                                  marginTop: '5px',
                                                  color:
                                                    theme.palette.secondary
                                                      .main,
                                                }}
                                              >
                                                {user?.name}
                                              </Typography>
                                            </CustomLink>
                                            <Box
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.action.selected,
                                                padding: '5px',
                                                width: 'fit-content',
                                                borderRadius: '5px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: 'black',
                                                marginBottom: '10px',
                                              }}
                                            >
                                              {user?.cohortNames
                                                ? getCohortNames(
                                                  user.cohortNames
                                                )
                                                : t(
                                                  'ATTENDANCE.NO_CENTERS_ASSIGNED'
                                                )}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box>
                                          <MoreVertIcon
                                            onClick={(event) => {
                                              isMobile
                                                ? toggleDrawer(
                                                  'bottom',
                                                  true,
                                                  user
                                                )(event)
                                                : handleMenuOpen(event, user);
                                            }}
                                            sx={{
                                              fontSize: '24px',
                                              marginTop: '1rem',
                                              color:
                                                theme.palette.warning['300'],
                                              cursor: 'pointer',
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    </Grid>
                                  )
                                )
                              ) : (
                                <Box
                                  sx={{
                                    m: '1.125rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <Typography
                                    style={{
                                      width: '100%',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {t('COMMON.NO_DATA_FOUND')}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                          </Box>
                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              justifyContent: 'end',
                            }}
                          >
                            <CustomPagination
                              count={Math.ceil(TotalCount / PAGINATION_CONFIG.ITEMS_PER_PAGE)}
                              page={page}
                              onPageChange={handlePageChange}
                              fetchMoreData={() => fetchData()}
                              hasMore={hasMore}
                              TotalCount={TotalCount}
                              items={infiniteData.map((user) => (
                                <Box key={user.userId}></Box>
                              ))}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              <ManageUsersModal
                open={open}
                onClose={handleClose}
                leanerName={selectedUserName ?? ''}
                blockName={selectedUser?.block ?? ''}
                centerName={centers}
              />
              <BottomDrawer
                toggleDrawer={toggleDrawer}
                state={state}
                listItemClick={listItemClick}
                setAnchorEl={setAnchorEl}
                anchorEl={anchorEl}
                isMobile={isMobile}
                optionList={[
                  {
                    label: t('COMMON.ADD_OR_REASSIGN_CENTERS'),
                    icon: (
                      <ApartmentIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'reassign-block',
                  },
                  // TODO: Integrate todo service
                  // {
                  //   label: t('COMMON.REASSIGN_BLOCKS_REQUEST'),
                  //   icon: (
                  //     <LocationOnOutlinedIcon
                  //       sx={{ color: theme.palette.warning['300'] }}
                  //     />
                  //   ),
                  //   name: 'reassign-block-request',
                  // },
                  {
                    label: t('COMMON.DELETE_USER'),
                    icon: (
                      <DeleteOutlineIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'delete-User',
                  },
                ].filter(
                  (option) =>
                    !isFromFLProfile ||
                    (option.name !== 'reassign-block' &&
                      option.name !== 'reassign-block-request')
                )}
              >
                <Box
                  sx={{
                    fontSize: '16px',
                    fontWeight: 300,
                    marginLeft: '20px',
                    marginBottom: '10px',
                    color: theme.palette.warning['400'],
                  }}
                >
                  {selectedUser?.name
                    ? selectedUser.name.charAt(0).toUpperCase() +
                    selectedUser.name.slice(1)
                    : ''}
                </Box>
                <Box
                  bgcolor={theme.palette.success.contrastText}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="left"
                  margin={'0rem 0.7rem 0rem 0.7rem'}
                  padding={'1rem'}
                  borderRadius={'1rem'}
                >
                  <Box
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: theme.palette.warning['400'],
                    }}
                  >
                    {t('COMMON.CENTERS_ASSIGNED', {
                      block: newStore.block,
                    })}
                  </Box>
                  <Box>
                    {centers.length > 0 &&
                      centers.map((name: string) => (
                        <Button
                          key={name}
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

              {
                openCentersModal &&

                <ManageCentersModal
                  open={openCentersModal}
                  onClose={handleCloseCentersModal}
                  centersName={centerList}
                  centers={centers}
                  onAssign={handleAssignCenters}
                />
              }
            </Box>

            {
              confirmationModalOpen &&
              <ConfirmationModal
                message={t('CENTERS.BLOCK_REQUEST')}
                handleAction={handleRequestBlockAction}
                buttonNames={{
                  primary: t('COMMON.SEND_REQUEST'),
                  secondary: t('COMMON.CANCEL'),
                }}
                handleCloseModal={handleCloseModal}
                modalOpen={confirmationModalOpen}
              />
            }

            {
              reassignModalOpen && <ReassignModal
                cohortNames={reassignCohortNames}
                message={t('COMMON.ADD_OR_REASSIGN_CENTERS')}
                handleAction={handleRequestBlockAction}
                handleCloseReassignModal={handleCloseReassignModal}
                modalOpen={reassignModalOpen}
                reloadState={reloadState}
                setReloadState={setReloadState}
                buttonNames={{ primary: t('COMMON.SAVE') }}
                selectedUser={selectedUser}
              />
            }

            {openDeleteUserModal && <DeleteUserModal
              type={Role.TEACHER}
              userId={userId}
              open={openDeleteUserModal}
              onClose={handleCloseModal}
              onUserDelete={handleDeleteUser}
              reloadState={reloadState}
              setReloadState={setReloadState}
            />
            }

            {openRemoveUserModal && <SimpleModal
              primaryText={t('COMMON.OK')}
              primaryActionHandler={handleCloseRemoveModal}
              open={openRemoveUserModal}
              onClose={handleCloseRemoveModal}
              modalTitle={t('COMMON.DELETE_USER')}
            >
              {' '}
              <Box mt={1.5} mb={1.5}>
                <Typography>
                  {t('CENTERS.THE_USER_BELONGS_TO_THE_FOLLOWING_COHORT')}{' '}
                  <strong>{toPascalCase(removeCohortNames)}</strong>
                  <br />
                  {t('CENTERS.PLEASE_REMOVE_THE_USER_FROM_COHORT')}
                </Typography>
              </Box>
            </SimpleModal>
            }
            {openAddFacilitatorModal && (
              <AddFacilitatorModal
                open={openAddFacilitatorModal}
                onClose={handleCloseAddFaciModal}
                onFacilitatorAdded={handleFacilitatorAdded}
              />
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default ManageUser;

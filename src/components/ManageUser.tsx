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
import { QueryKeys, Role, Status } from '@/utils/app.constant';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setTimeout } from 'timers';
import manageUserStore from '../store/manageUserStore';
import AddFacilitatorModal from './AddFacilitator';
import DeleteUserModal from './DeleteUserModal';
import Loader from './Loader';
import ReassignModal from './ReassignModal';
import SimpleModal from './SimpleModal';
import { useQueryClient } from '@tanstack/react-query';
import { toPascalCase } from '@/utils/Helper';

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

  const [value, setValue] = React.useState(1);
  const [users, setUsers] = useState<
    {
      name: string;
      userId: string;
      cohortNames?: string;
    }[]
  >();
  const [loading, setLoading] = React.useState(false);
  const [cohortsData, setCohortsData] = useState<CohortsData>();
  const [centersData, setCentersData] = useState<Cohort[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [centers, setCenters] = useState<any>([]);
  const [centerList, setCenterList] = useState<string[]>([]);

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

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

  useEffect(() => {
    const getFacilitator = async () => {
      setLoading(true);
      try {
        const cohortId = cohortData
          .map((block: any) => {
            return block?.blockId;
          })
          .join('');

        if (cohortId) {
          const limit = 0;
          const page = 0;
          const filters = {
            states: store.stateCode,
            districts: store.districtCode,
            blocks: store.blockCode,
            role: Role.TEACHER,
            status: [Status.ACTIVE],
          };
          const fields = ['age'];

          // const resp = await getMyUserList({ limit, page, filters, fields });
          const resp = await queryClient.fetchQuery({
            queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR, filters],
            queryFn: () => getMyUserList({ limit, page, filters, fields }),
          });

          const facilitatorList = resp.result?.getUserDetails;

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
                .filter(({ cohortStatus }: any) => cohortStatus === 'active')
                .map(({ cohortName }: any) => toPascalCase(cohortName))
                .join(', ');

              return {
                userId: user?.userId,
                name: user?.name,
                cohortNames: cohortNames || null,
              };
            }
          );

          setTimeout(() => {
            console.log('extractedData', extractedData);
            setUsers(extractedData);
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
  }, [isFacilitatorAdded, reloadState]);

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
      console.log('Cohort List:', cohortList);

      const hasActiveCohorts =
        cohortList &&
        cohortList.length > 0 &&
        cohortList.some(
          (cohort: { status: string }) => cohort.status === 'active'
        );

      if (hasActiveCohorts) {
        const cohortNames = cohortList
          .filter((cohort: { status: string }) => cohort.status === 'active')
          .map((cohort: { cohortName: string }) => cohort.cohortName)
          .join(', ');

        setOpenRemoveUserModal(true);
        setRemoveCohortNames(cohortNames);
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
          console.log('Cohort List:', cohortList);
          if (cohortList && cohortList?.length > 0) {
            const cohortDetails = cohortList?.map(
              (cohort: { cohortName: any; cohortId: any; status: any }) => ({
                name: cohort?.cohortName,
                id: cohort?.cohortId,
                status: cohort?.status,
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
    console.log('selectedUser', selectedUser);
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
  };

  const handleOpenAddFaciModal = () => {
    setOpenFacilitatorModal(true);
  };

  const handleCloseAddFaciModal = () => {
    setOpenFacilitatorModal(false);
  };

  const handleDeleteUser = () => {};

  const handleFacilitatorAdded = () => {
    setIsFacilitatorAdded((prev) => prev);
  };
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
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

  return (
    <div>
      <Box>
        {value === 1 && (
          <>
            {!isFromFLProfile && (
              <Grid
                px={'18px'}
                spacing={2}
                mt={1}
                sx={{ display: 'flex', alignItems: 'center' }}
                container
              >
                <Box mt={'18px'} px={'18px'}>
                  <Button
                    sx={{
                      border: '1px solid #1E1B16',
                      borderRadius: '100px',
                      height: '40px',
                      width: '8rem',
                      color: theme.palette.error.contrastText,
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
                      : handleMenuOpen(event);
                  }}
                  sx={{
                    fontSize: '24px',
                    marginTop: '1rem',
                    color: theme.palette.warning['300'],
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
                        <Grid container spacing={2}>
                          {users &&
                            users.length !== 0 &&
                            [...users]
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((user) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={4}
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
                                          onClick={(e) => e.preventDefault()}
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
                                                theme.palette.secondary.main,
                                            }}
                                          >
                                            {toPascalCase(user.name)}
                                          </Typography>
                                        </CustomLink>
                                        <Box
                                          sx={{
                                            backgroundColor: '#FFF8F2',
                                            padding: '5px',
                                            borderRadius: '5px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: 'black',
                                            marginBottom: '10px',
                                          }}
                                        >
                                          {user?.cohortNames
                                            ? getCohortNames(user.cohortNames)
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
                                            : handleMenuOpen(event);
                                        }}
                                        sx={{
                                          fontSize: '24px',
                                          marginTop: '1rem',
                                          color: theme.palette.warning['300'],
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                          {!users?.length && (
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
                                  fontWeight: 'bold',
                                  width: '100%',
                                  textAlign: 'center',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            </Box>
                          )}
                        </Grid>
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
                    label: t('COMMON.REASSIGN_BLOCKS'),
                    icon: (
                      <ApartmentIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'reassign-block',
                  },
                  {
                    label: t('COMMON.REASSIGN_BLOCKS_REQUEST'),
                    icon: (
                      <LocationOnOutlinedIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'reassign-block-request',
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

              <ManageCentersModal
                open={openCentersModal}
                onClose={handleCloseCentersModal}
                centersName={centerList}
                centers={centers}
                onAssign={handleAssignCenters}
              />
            </Box>

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
            <ReassignModal
              cohortNames={reassignCohortNames}
              message={t('COMMON.REASSIGN_BLOCKS')}
              handleAction={handleRequestBlockAction}
              handleCloseReassignModal={handleCloseReassignModal}
              modalOpen={reassignModalOpen}
              reloadState={reloadState}
              setReloadState={setReloadState}
            />

            <DeleteUserModal
              type={Role.TEACHER}
              userId={userId}
              open={openDeleteUserModal}
              onClose={handleCloseModal}
              onUserDelete={handleDeleteUser}
              reloadState={reloadState}
              setReloadState={setReloadState}
            />
            <SimpleModal
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
                  <strong>{removeCohortNames}</strong>
                  <br />
                  {t('CENTERS.PLEASE_REMOVE_THE_USER_FROM_COHORT')}
                </Typography>
              </Box>
            </SimpleModal>
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

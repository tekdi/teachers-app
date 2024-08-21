import { getCohortList } from '@/services/CohortServices';
import { accessGranted, toPascalCase } from '@/utils/Helper';
import { ICohort } from '@/utils/Interfaces';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FilterModalCenter from '../blocks/components/FilterModalCenter';

import Header from '@/components/Header';
import Loader from '@/components/Loader';
import ManageUser from '@/components/ManageUser';
import { showToastMessage } from '@/components/Toastify';
import CreateCenterModal from '@/components/center/CreateCenterModal';
import useStore from '@/store/store';
import { CenterType, Role } from '@/utils/app.constant';
import { ArrowDropDown, Clear, Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setTimeout } from 'timers';
import { accessControl } from '../../../app.config';
import building from '../../assets/images/apartment.png';

const TeachingCenters = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [cohortsData, setCohortsData] = useState<Array<ICohort>>([]);
  const [reloadState, setReloadState] = React.useState<boolean>(false);
  const [value, setValue] = useState(1);
  const [blockData, setBlockData] = useState<
    { bockName: string; district?: string; blockId: string; state?: string }[]
  >([]);
  const [centerData, setCenterData] = useState<
    { cohortName: string; centerType?: string; cohortId: string }[]
  >([]);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredCenters, setFilteredCenters] = useState(centerData);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('');
  const [centerType, setCenterType] = useState<'regular' | 'remote' | ''>('');
  const [openCreateCenterModal, setOpenCreateCenterModal] =
    React.useState(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const [isCenterAdded, setIsCenterAdded] = useState(false);

  const store = useStore();
  const userRole = store.userRole;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const role = localStorage.getItem('role');
      if (role === Role.TEAM_LEADER) {
        setIsTeamLeader(true);
      } else {
        setIsTeamLeader(false);
      }
    }
  }, []);

  useEffect(() => {
    setFilteredCenters(centerData);
  }, [centerData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    const getCohortListForTL = async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const userId = localStorage.getItem('userId');
          if (
            userId &&
            accessGranted('showBlockLevelCohort', accessControl, userRole)
          ) {
            const response = await getCohortList(userId, {
              customField: 'true',
            });
            const blockData = response.map((block: any) => {
              const blockName = block.cohortName;
              const blockId = block.cohortId;
              localStorage.setItem('blockParentId', blockId);

              const stateField = block?.customField.find(
                (field: any) => field.label === 'STATES'
              );
              const state = stateField ? stateField.value : '';

              const districtField = block?.customField.find(
                (field: any) => field.label === 'DISTRICTS'
              );
              const district = districtField ? districtField.value : '';
              return { blockName, blockId, state, district };
            });
            console.log(blockData);
            setBlockData(blockData);

            response.map((res: any) => {
              const centerData = res?.childData.map((child: any) => {
                const cohortName = child.name;
                const cohortId = child.cohortId;
                const centerTypeField = child?.customField.find(
                  (field: any) => field.label === 'TYPE_OF_COHORT'
                );

                const centerType = centerTypeField ? centerTypeField.value : '';
                return { cohortName, cohortId, centerType };
              });
              setCenterData(centerData);
              console.log(centerData);
              localStorage.setItem('CenterList', JSON.stringify(centerData));
            });
          }
          if (
            userId &&
            accessGranted('showTeacherCohorts', accessControl, userRole)
          ) {
            const response = await getCohortList(userId);
            const cohortData = response.map((block: any) => {
              const cohortName = block.cohortName;
              const cohortId = block.cohortId;
              return { cohortName, cohortId };
            });
            console.log(cohortData);

            setTimeout(() => {
              setCohortsData(cohortData);
            });
          }
        }
      } catch (error) {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
    };
    getCohortListForTL();
  }, [isTeamLeader, isCenterAdded, reloadState]);

  const handleCenterAdded = () => {
    setIsCenterAdded((prev) => !prev);
  };

  useEffect(() => {
    const filtered = centerData.filter((center) =>
      center.cohortName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCenters(filtered);
  }, [searchInput, centerData]);

  const handleFilterApply = () => {
    let filtered = [...centerData];

    if (centerType) {
      filtered = filtered.filter(
        (center) =>
          center.centerType &&
          center.centerType.toLowerCase() === centerType.toLowerCase()
      );
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.cohortName.localeCompare(b.cohortName));
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.cohortName.localeCompare(a.cohortName));
    }
    setFilteredCenters(filtered);
    handleFilterModalClose();
  };

  const handleCreateCenterClose = () => {
    setOpenCreateCenterModal(false);
  };

  return (
    <>
      <Header />
      {loading && <Loader showBackdrop={false} loadingText={t('LOADING')} />}
      <Box sx={{ padding: '0' }}>
        {accessGranted('showBlockLevelData', accessControl, userRole) ? (
          <>
            {blockData?.length !== 0 &&
              blockData?.map((block: any) => (
                <Box
                  key={block.blockId}
                  textAlign={'left'}
                  fontSize={'22px'}
                  p={'18px 18px 0 18px'}
                  color={theme?.palette?.warning['300']}
                >
                  {block.blockName}
                  {block?.district && (
                    <Box textAlign={'left'} fontSize={'16px'} p={'0  '}>
                      {toPascalCase(block?.district)},{' '}
                      {toPascalCase(block?.state)}
                    </Box>
                  )}
                </Box>
              ))}
          </>
        ) : (
          <Box
            textAlign={'left'}
            fontSize={'22px'}
            p={'18px 0 0px 18px'}
            color={theme?.palette?.warning['300']}
          >
            {t('DASHBOARD.MY_CLASSES')}
          </Box>
        )}
        {accessGranted('showBlockLevelData', accessControl, userRole) && (
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit" // Use "inherit" to apply custom color
              aria-label="secondary tabs example"
              sx={{
                fontSize: '14px',
                borderBottom: (theme) => `1px solid #EBE1D4`,

                '& .MuiTab-root': {
                  color: theme.palette.warning['A200'],
                  padding: '0 20px',
                  flexGrow: 1,
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
              <Tab value={1} label={t('CENTERS.CENTERS')} />
              <Tab value={2} label={t('COMMON.FACILITATORS')} />
            </Tabs>
          </Box>
        )}

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
                <Grid sx={{ paddingLeft: '18px !important' }} item xs={8}>
                  <Box>
                    <TextField
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder={t('COMMON.SEARCH')}
                      variant="outlined"
                      size="medium"
                      sx={{
                        p: 2,
                        justifyContent: 'center',
                        height: '48px',
                        flexGrow: 1,
                        mr: 1,
                        backgroundColor: theme?.palette?.warning?.A700,
                        borderRadius: '40px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          boxShadow: 'none',
                        },
                        '@media (min-width: 900px)': {
                          width: '90%',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {searchInput ? (
                              <IconButton
                                onClick={() => setSearchInput('')}
                                edge="end"
                              >
                                <Clear
                                  sx={{ color: theme?.palette?.warning['300'] }}
                                />
                              </IconButton>
                            ) : (
                              <Search
                                sx={{ color: theme?.palette?.warning['300'] }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{
                    '@media (min-width: 900px)': {
                      display: 'flex',
                      justifyContent: 'end'

                    },
                  }}>
                    <FormControl
                      className="drawer-select"
                      sx={{
                        width: '100%',
                        '@media (min-width: 900px)': {
                          width: '40%',
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchInput('');
                          handleFilterModalOpen();
                        }}
                        size="medium"
                        endIcon={<ArrowDropDown />}
                        sx={{
                          borderRadius: '7px',
                          border: `1px solid ${theme?.palette?.warning?.A700}`,
                          pl: 3,
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {t('COMMON.FILTERS')}
                      </Button>
                    </FormControl>
                  </Box>
                </Grid>
                {accessGranted(
                  'showCreateCenterButton',
                  accessControl,
                  userRole
                ) && (
                    <Box mt={'18px'} px={'18px'}>
                      <Button
                        sx={{
                          border: '1px solid #1E1B16',
                          borderRadius: '100px',
                          height: '40px',
                          width: '9rem',
                          color: theme.palette.error.contrastText,
                        }}
                        className="text-1E"
                        endIcon={<AddIcon />}
                        onClick={() => setOpenCreateCenterModal(true)}
                      >
                        {t('BLOCKS.CREATE_NEW')}
                      </Button>
                      {/* <Box sx={{ display: 'flex', gap: '5px' }}>
                  <ErrorOutlineIcon style={{ fontSize: '15px' }} />
                  <Box className="fs-12 fw-500 ">{t('COMMON.ADD_CENTER')}</Box>
                </Box> */}
                    </Box>
                  )}
              </Grid>

              <CreateCenterModal
                open={openCreateCenterModal}
                handleClose={handleCreateCenterClose}
                onCenterAdded={handleCenterAdded}
              />

              {accessGranted(
                'showBlockLevelCenterData',
                accessControl,
                userRole
              ) &&
                (filteredCenters && filteredCenters.length > 0 ? (
                  <>
                    {/* Regular Centers */}
                    {filteredCenters.some(
                      (center) =>
                        center.centerType?.toUpperCase() === CenterType.REGULAR ||
                        center.centerType === ''
                    ) && (
                        <>
                          <Box
                            sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: theme.palette.warning['300'],
                              marginBottom: '8px',
                              m: 2,
                            }}
                          >
                            {t('CENTERS.REGULAR_CENTERS')}
                          </Box>

                          <Box
                            sx={{
                              borderRadius: '16px',
                              p: 2,
                              background: theme.palette.action.selected,
                              m: 2,
                            }}
                          >
                            <Grid container spacing={2}>
                              {filteredCenters
                                .filter(
                                  (center) =>
                                    center?.centerType?.toUpperCase() ===
                                    CenterType.REGULAR || center?.centerType === ''
                                )
                                .map((center) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={center?.cohortId}
                                  >
                                    <Box
                                      onClick={() => {
                                        router.push(
                                          `/centers/${center?.cohortId}`
                                        );
                                        localStorage.setItem(
                                          'classId',
                                          center?.cohortId
                                        );
                                      }}
                                      sx={{
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: '10px',
                                          background: '#fff',
                                          height: '56px',
                                          borderRadius: '8px',
                                        }}
                                        mt={1}
                                      >
                                        <Box
                                          sx={{
                                            width: '56px',
                                            display: 'flex',
                                            background:
                                              theme.palette.primary.light,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopLeftRadius: '8px',
                                            borderBottomLeftRadius: '8px',
                                          }}
                                        >
                                          <Image src={building} alt="center" />
                                        </Box>

                                        <Box
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '0 10px',
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              fontSize: '16px',
                                              fontWeight: '400',
                                              color: theme.palette.warning['300'],
                                            }}
                                          >
                                            {center.cohortName
                                              .charAt(0)
                                              .toUpperCase() +
                                              center.cohortName.slice(1)}
                                          </Box>
                                          <ChevronRightIcon />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        </>
                      )}

                    {/* Remote Centers */}
                    {filteredCenters.some(
                      (center) => center.centerType?.toUpperCase() === CenterType.REMOTE
                    ) && (
                        <>
                          <Box
                            sx={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: theme.palette.warning['300'],
                              marginBottom: '8px',
                              m: 2,
                            }}
                          >
                            {t('CENTERS.REMOTE_CENTERS')}
                          </Box>

                          <Box
                            sx={{
                              borderRadius: '16px',
                              p: 2,
                              background: theme.palette.action.selected,
                              m: 2,
                            }}
                          >
                            <Grid container spacing={2}>
                              {filteredCenters
                                .filter(
                                  (center) =>
                                    center.centerType?.toUpperCase() === CenterType.REMOTE
                                )
                                .map((center) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={center?.cohortId}
                                  >
                                    <Box
                                      onClick={() => {
                                        router.push(
                                          `/centers/${center?.cohortId}`
                                        );
                                        localStorage.setItem(
                                          'classId',
                                          center?.cohortId
                                        );
                                      }}
                                      sx={{
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: '10px',
                                          background: '#fff',
                                          height: '56px',
                                          borderRadius: '8px',
                                        }}
                                        mt={1}
                                      >
                                        <Box
                                          sx={{
                                            width: '56px',
                                            display: 'flex',
                                            background:
                                              theme.palette.primary.light,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopLeftRadius: '8px',
                                            borderBottomLeftRadius: '8px',
                                          }}
                                        >
                                          <SmartDisplayOutlinedIcon
                                            sx={{ color: '#4D4639' }}
                                          />
                                        </Box>

                                        <Box
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '0 10px',
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              fontSize: '16px',
                                              fontWeight: '400',
                                              color: theme.palette.warning['300'],
                                            }}
                                          >
                                            {center.cohortName}
                                          </Box>
                                          <ChevronRightIcon />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        </>
                      )}
                  </>
                ) : (
                  <Box
                    sx={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: theme.palette.warning['400'],
                      m: 2,
                    }}
                  >
                    {t('COMMON.NO_DATA_FOUND')}
                  </Box>
                ))}

              {/* Teacher-Level Centers */}
              {accessGranted(
                'showTeacherLevelCenterData',
                accessControl,
                userRole
              ) &&
                cohortsData?.map((cohort: any) => {
                  return (
                    <React.Fragment key={cohort?.cohortId}>
                      <Box
                        onClick={() => {
                          router.push(`/centers/${cohort.cohortId}`);
                          localStorage.setItem('classId', cohort.cohortId);
                        }}
                        sx={{
                          cursor: 'pointer',
                          marginBottom: '20px',
                          background: theme.palette.action.selected,
                          p: 2,
                          m: 2,
                          borderRadius: 5,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            background: '#fff',
                            height: '56px',
                            borderRadius: '8px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '56px',
                              display: 'flex',
                              background: theme.palette.primary.light,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderTopLeftRadius: '8px',
                              borderBottomLeftRadius: '8px',
                            }}
                          >
                            <Image src={building} alt="center" />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                              padding: '0 10px',
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: '16px',
                                fontWeight: '400',
                                color: theme.palette.warning['300'],
                              }}
                            >
                              {cohort?.cohortName}
                            </Box>
                            <ChevronRightIcon />
                          </Box>
                        </Box>
                      </Box>
                    </React.Fragment>
                  );
                })}
            </>
          )}
        </Box>
        <Box>
          {value === 2 && (
            <ManageUser
              reloadState={reloadState}
              setReloadState={setReloadState}
              cohortData={blockData}
            />
          )}
        </Box>
      </Box>
      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={centerData.map((center) => center.cohortName)}
        selectedCenters={selectedCenters}
        setSelectedCenters={setSelectedCenters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        centerType={centerType}
        setCenterType={setCenterType}
        onApply={handleFilterApply}
      />
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

export default TeachingCenters;

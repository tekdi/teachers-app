import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import React, { useEffect } from 'react';
import { cohort, cohortAttendancePercentParam } from '@/utils/Interfaces';

import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Header from '@/components/Header';
import Image from 'next/image';
import Loader from '@/components/Loader';
import building from '../../assets/images/apartment.png';
import { cohortList, getCohortList } from '@/services/CohortServices';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { showToastMessage } from '@/components/Toastify';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ManageUser from '@/components/ManageUser';
import { setTimeout } from 'timers';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import CreateCenterModal from '@/components/center/CreateCenterModal';

const TeachingCenters = () => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [value, setValue] = React.useState(1);
  const [blockData, setBlockData] =
    React.useState<
      { bockName: string; district?: string; blockId: string; state?: string }[]
    >();
  const [centerData, setCenterData] =
    React.useState<
      { cohortName: string; centerType?: string; cohortId: string }[]
    >();
  const [isTeamLeader, setIsTeamLeader] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [openCreateCenterModal, setOpenCreateCenterModal] =
    React.useState(false);

  // API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      setLoading(true);

      try {
        const limit = 0;
        const page = 0;
        const filters = { userId: userId };
        const resp = await cohortList({ limit, page, filters });

        const cohorts = resp?.results?.cohortDetails || [];
        setCohortsData(cohorts);
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCohortList();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const role = localStorage.getItem('role');
      if (role === 'Team Leader') {
        setIsTeamLeader(true);
      } else {
        setIsTeamLeader(false);
      }
    }
  }, []);

  useEffect(() => {
    const getCohortListForTL = async () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const userId = localStorage.getItem('userId');
          if (userId && isTeamLeader) {
            const response = await getCohortList(userId, {
              customField: 'true',
            });
            const blockData = response.map((block: any) => {
              const blockName = block.cohortName;
              const blockId = block.cohortId;
              const stateField = block?.customField.find(
                (field: any) => field.label === 'State'
              );
              const districtField = block?.customField.find(
                (field: any) => field.label === 'District'
              );

              const state = stateField ? stateField.value : '';
              const district = districtField ? districtField.value : '';
              return { blockName, blockId, state, district };
            });
            console.log(blockData);
            setBlockData(blockData);

            const cohortData = response.map((res: any) => {
              const centerData = res?.childData.map((child: any) => {
                const cohortName = child.name;
                const cohortId = child.cohortId;
                const centerTypeField = child?.customField.find(
                  (field: any) => field.label === 'Type of Cohort'
                );

                const centerType = centerTypeField ? centerTypeField.value : '';
                return { cohortName, cohortId, centerType };
              });
              console.log(centerData);
              setCenterData(centerData);
            });
          }
          if (userId && !isTeamLeader) {
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
  }, [isTeamLeader]);

  const handleCreateCenterClose = () => {
    setOpenCreateCenterModal(false);
  };

  return (
    <>
      <Header />
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      <Box sx={{ padding: '0 18px' }}>
        {isTeamLeader ? (
          <>
            {blockData?.length !== 0 &&
              blockData?.map((block: any) => (
                <Box
                  key={block.blockId}
                  textAlign={'left'}
                  fontSize={'22px'}
                  p={'18px 0'}
                  color={theme?.palette?.warning['300']}
                >
                  {block.blockName}
                  {block?.district && (
                    <Box textAlign={'left'} fontSize={'16px'}>
                      {block.district}, {block.state}
                    </Box>
                  )}
                </Box>
              ))}
          </>
        ) : (
          <Box
            textAlign={'left'}
            fontSize={'22px'}
            p={'18px 0'}
            color={theme?.palette?.warning['300']}
          >
            {t('DASHBOARD.MY_TEACHING_CENTERS')}
          </Box>
        )}
        {isTeamLeader && (
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit" // Use "inherit" to apply custom color
              aria-label="secondary tabs example"
              sx={{
                fontSize: '14px',
                borderBottom: (theme) =>
                  `1px solid ${theme.palette.primary.main}`,

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
                    <FormControl
                      className="drawer-select"
                      sx={{ width: '100%' }}
                    >
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
                {isTeamLeader && (
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
              />
              <Box
                className="linerGradient"
                sx={{ borderRadius: '16px', mt: 2 }}
                padding={'10px 16px 2px'}
              >
                {isTeamLeader && centerData && (
                  <>
                    {/* Regular Centers */}
                    {centerData.some(
                      (center) =>
                        center.centerType === 'Regular' ||
                        center.centerType === ''
                    ) && (
                      <div>
                        <Box
                          sx={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: theme.palette.warning['300'],
                          }}
                        >
                          {t('CENTERS.REGULAR_CENTERS')}
                        </Box>
                        {centerData
                          .filter(
                            (center) =>
                              center.centerType === 'Regular' ||
                              center.centerType === ''
                          )
                          .map((center) => (
                            <React.Fragment key={center.cohortId}>
                              <Box
                                onClick={() => {
                                  router.push(`/centers/${center.cohortId}`);
                                  localStorage.setItem(
                                    'classId',
                                    center.cohortId
                                  );
                                }}
                                sx={{ cursor: 'pointer', marginBottom: '20px' }}
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
                                      {center.cohortName}
                                    </Box>
                                    <ChevronRightIcon />
                                  </Box>
                                </Box>
                              </Box>
                            </React.Fragment>
                          ))}
                      </div>
                    )}

                    {/* Remote Centers */}
                    {centerData.some(
                      (center) => center.centerType === 'Remote'
                    ) && (
                      <div>
                        <Box
                          sx={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: theme.palette.warning['300'],
                          }}
                        >
                          {t('CENTERS.REMOTE_CENTERS')}
                        </Box>
                        {centerData
                          .filter((center) => center.centerType === 'Remote')
                          .map((center) => (
                            <React.Fragment key={center.cohortId}>
                              <Box
                                onClick={() => {
                                  router.push(`/centers/${center.cohortId}`);
                                  localStorage.setItem(
                                    'classId',
                                    center.cohortId
                                  );
                                }}
                                sx={{ cursor: 'pointer', marginBottom: '20px' }}
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
                                      background: theme.palette.primary.light,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderTopLeftRadius: '8px',
                                      borderBottomLeftRadius: '8px',
                                    }}
                                  >
                                    <SmartDisplayOutlinedIcon />
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
                            </React.Fragment>
                          ))}
                      </div>
                    )}
                  </>
                )}

                {!isTeamLeader &&
                  cohortsData &&
                  cohortsData?.map((cohort: any) => {
                    return (
                      <React.Fragment key={cohort?.cohortId}>
                        <Box
                          onClick={() => {
                            router.push(`/centers/${cohort.cohortId}`);
                            localStorage.setItem('classId', cohort.cohortId);
                          }}
                          sx={{ cursor: 'pointer', marginBottom: '20px' }}
                        >
                          <Box
                            sx={{
                              fontSize: '12px',
                              fontWeight: '500',
                              color: theme.palette.warning['300'],
                            }}
                          >
                            {/* {cohort?.['customFields']?.address?.value} */}
                          </Box>
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
              </Box>
            </>
          )}
        </Box>
        <Box>{value === 2 && <ManageUser cohortData={blockData} />}</Box>
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

export default TeachingCenters;

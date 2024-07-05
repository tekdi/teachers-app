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
import React, { useEffect, useState } from 'react';
import { cohort } from '@/utils/Interfaces';
import FilterModalCenter from '../blocks/components/FilterModalCenter';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Header from '@/components/Header';
import Image from 'next/image';
import Loader from '@/components/Loader';
import building from '../../assets/images/apartment.png';
import { getCohortList } from '@/services/CohortServices';
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
import { toPascalCase } from '@/utils/Helper';
import { ArrowDropDown, Search } from '@mui/icons-material';

const TeachingCenters = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [cohortsData, setCohortsData] = useState<Array<cohort>>([]);
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
  const [openCreateCenterModal, setOpenCreateCenterModal] = React.useState(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
              setCenterData(centerData);
              console.log(centerData);
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

  useEffect(() => {
    const filtered = centerData.filter((center) =>
      center.cohortName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCenters(filtered);
  }, [searchInput, centerData]);

  const handleFilterApply = () => {
    let filtered = [...centerData];

    if (centerType) {
      filtered = filtered.filter((center) => center.centerType && center.centerType.toLowerCase() === centerType.toLowerCase());
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
                      {block.district}, {toPascalCase(block.state)}
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
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Search />
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
                        <Button
              variant="outlined"
              onClick={handleFilterModalOpen}
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
                {isTeamLeader && filteredCenters && (
                  <>
                    {/* Regular Centers */}
                    {filteredCenters.some(
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
                        {filteredCenters
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
                    {filteredCenters.some(
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
                        {filteredCenters
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
      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={centerData.map(center => center.cohortName)}
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

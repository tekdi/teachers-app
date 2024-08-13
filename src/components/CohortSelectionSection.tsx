import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { getCohortList } from '@/services/CohortServices';
import useStore from '@/store/store';
import { ICohort } from '@/utils/Interfaces';
import { CustomField } from '@/utils/Interfaces';
import { cohortHierarchy } from '@/utils/app.constant';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import ReactGA from 'react-ga4';
import Loader from './Loader';
import { showToastMessage } from './Toastify';
import manageUserStore from '@/store/manageUserStore';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';

interface CohortSelectionSectionProps {
  classId: string;
  setClassId: React.Dispatch<React.SetStateAction<string>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated?: boolean;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cohortsData: Array<ICohort>;
  setCohortsData: React.Dispatch<React.SetStateAction<Array<ICohort>>>;
  manipulatedCohortData?: Array<ICohort>;
  setManipulatedCohortData?: React.Dispatch<
    React.SetStateAction<Array<ICohort>>
  >;
  blockName: string;
  isManipulationRequired?: boolean;
  setBlockName: React.Dispatch<React.SetStateAction<string>>;
  handleSaveHasRun?: boolean;
  setHandleSaveHasRun?: React.Dispatch<React.SetStateAction<boolean>>;
  isCustomFieldRequired?: boolean;
}

interface ChildData {
  cohortId: string;
  name: string;
  parentId: string;
  type: string;
  customField: any[];
  childData: ChildData[];
}
interface NameTypePair {
  cohortId: string;
  name: string;
  cohortType: string;
}

const CohortSelectionSection: React.FC<CohortSelectionSectionProps> = ({
  classId,
  setClassId,
  userId,
  setUserId,
  isAuthenticated,
  setIsAuthenticated,
  loading,
  setLoading,
  cohortsData,
  setCohortsData,
  manipulatedCohortData,
  setManipulatedCohortData,
  isManipulationRequired = true,
  blockName,
  setBlockName,
  handleSaveHasRun,
  setHandleSaveHasRun,
  isCustomFieldRequired = true,
}) => {
  const router = useRouter();
  const theme = useTheme<any>();
  const pathname = usePathname(); // Get the current pathname
  const { t } = useTranslation();
  const setCohorts = useStore((state) => state.setCohorts);
  const setBlock = useStore((state) => state.setBlock);

  const store = manageUserStore();
  const setDistrictCode = manageUserStore(
    (state: { setDistrictCode: any }) => state.setDistrictCode
  );
  const setDistrictId = manageUserStore(
    (state: { setDistrictId: any }) => state.setDistrictId
  );
  const setStateCode = manageUserStore(
    (state: { setStateCode: any }) => state.setStateCode
  );
  const setStateId = manageUserStore(
    (state: { setStateId: any }) => state.setStateId
  );
  const setBlockCode = manageUserStore(
    (state: { setBlockCode: any }) => state.setBlockCode
  );
  const setBlockId = manageUserStore(
    (state: { setBlockId: any }) => state.setBlockId
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      setClassId(localStorage.getItem('classId') || '');
      if (token) {
        setIsAuthenticated?.(true);
      } else {
        router.push('/login');
      }
      setUserId(storedUserId);
    }
  }, [router, setClassId, setIsAuthenticated, setUserId]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchCohorts = async () => {
        try {
          const response = await getCohortList(userId, {
            customField: 'true',
          });
          console.log('Response:', response);
          const cohortData = response[0];
          if (cohortData?.customField?.length) {
            const district = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'DISTRICTS'
            );
            setDistrictCode(district?.code);
            setDistrictId(district?.fieldId);

            const state = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'STATES'
            );
            setStateCode(state?.code);
            setStateId(state?.fieldId);

            const blockField = cohortData?.customField?.find(
              (field: any) => field?.label === 'BLOCKS'
            );
            setBlockCode(blockField?.code);
            setBlockId(blockField?.fieldId);
          }

          if (response && response?.length > 0) {
            const extractNamesAndCohortTypes = (
              data: ChildData[]
            ): NameTypePair[] => {
              const nameTypePairs: NameTypePair[] = [];
              const recursiveExtract = (items: ChildData[]) => {
                items.forEach((item) => {
                  const cohortType =
                    item?.customField?.find(
                      (field) => field?.label === 'TYPE_OF_COHORT'
                    )?.value || 'Unknown';
                  if (item?.cohortId && item?.name) {
                    nameTypePairs.push({
                      cohortId: item?.cohortId,
                      name: item?.name,
                      cohortType,
                    });
                  }
                  if (item?.childData && item?.childData?.length > 0) {
                    recursiveExtract(item?.childData);
                  }
                });
              };
              recursiveExtract(data);
              return nameTypePairs;
            };

            if (response?.length > 0) {
              const nameTypePairs = extractNamesAndCohortTypes(response);
              setCohorts(nameTypePairs);
            }
          }
          if (response && response.length > 0) {
            if (response[0].type === cohortHierarchy.COHORT) {
              const filteredData = response
                ?.map((item: any) => ({
                  cohortId: item?.cohortId,
                  parentId: item?.parentId,
                  name: item?.cohortName || item?.name,
                }))
                ?.filter(Boolean);
              setCohortsData(filteredData);
              if (filteredData.length > 0) {
                if (typeof window !== 'undefined' && window.localStorage) {
                  const cohort = localStorage.getItem('classId') || '';
                  if (cohort !== '') {
                    setClassId(localStorage.getItem('classId') || '');
                  } else {
                    localStorage.setItem(
                      'classId',
                      filteredData?.[0]?.cohortId
                    );
                    setClassId(filteredData?.[0]?.cohortId);
                  }
                }
                if (isManipulationRequired) {
                  setManipulatedCohortData?.(
                    filteredData.concat({
                      cohortId: 'all',
                      name: 'All Centers',
                    })
                  );
                } else {
                  setManipulatedCohortData?.(filteredData);
                }
              }
            } else if (response[0].type === cohortHierarchy.BLOCK) {
              setBlockName(response[0].name || response[0].cohortName);
              setBlock(response[0].name || response[0].cohortName)
              const filteredData = response[0].childData
                ?.map((item: any) => {
                  const typeOfCohort = item?.customField?.find(
                    (field: any) => field?.label === 'TYPE_OF_COHORT'
                  )?.value;

                  return {
                    cohortId: item?.cohortId,
                    parentId: item?.parentId,
                    name: item?.cohortName || item?.name,
                    typeOfCohort: typeOfCohort || (t('ATTENDANCE.UNKNOWN')),
                  };
                })
                ?.filter(Boolean);

              console.log(filteredData);

              setCohortsData(filteredData);

              if (filteredData.length > 0) {
                if (typeof window !== 'undefined' && window.localStorage) {
                  const cohort = localStorage.getItem('classId') || '';
                  if (cohort !== '') {
                    setClassId(localStorage.getItem('classId') || '');
                  } else {
                    localStorage.setItem(
                      'classId',
                      filteredData?.[0]?.cohortId
                    );
                    setClassId(filteredData?.[0]?.cohortId);
                  }
                }
              }
              setManipulatedCohortData?.(filteredData);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cohort list', error);
          setLoading(false);
          showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        }
      };

      fetchCohorts();
    }
  }, [
    userId,
    setCohortsData,
    setLoading,
    setClassId,
    setManipulatedCohortData,
    setBlockName,
    isCustomFieldRequired,
  ]);

  const handleCohortSelection = (event: SelectChangeEvent<string>) => {
    setClassId(event.target.value as string);
    ReactGA.event('cohort-selection-dashboard', {
      selectedCohortID: event.target.value,
    });
    localStorage.setItem('classId', event.target.value);
    setHandleSaveHasRun?.(!handleSaveHasRun);

    // ---------- set cohortId and stateName-----------
    const cohort_id = event.target.value;
    localStorage.setItem('cohortId', cohort_id);

    const get_state_name: string | null = getStateByCohortId(cohort_id);
    if (get_state_name) {
      localStorage.setItem('stateName', get_state_name);
    } else {
      localStorage.setItem('stateName', '');
      console.log('NO State For Selected Cohort');
    }
    function getStateByCohortId(cohortId: any) {
      const cohort = cohortsData?.find((item) => item.cohortId === cohortId);
      return cohort ? cohort?.state : null;
    }
  };

  const isAttendanceOverview = pathname === '/attendance-overview';

  return (
    <Box className={isAttendanceOverview ? 'w-100' : 'w-md-40'}>
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      {!loading && cohortsData && (
        <Box>
          {/* {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />} */}
          {!loading && cohortsData && (
            <Box>
              {blockName ? (
                <Box>
                  <Typography
                    color={theme.palette.warning['300']}
                    textAlign={'left'}
                  >
                    {blockName} {t('DASHBOARD.BLOCK')}
                  </Typography>
                  <Box className="mt-md-16">
                    <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                      {cohortsData?.length > 1 ? (
                        <FormControl
                          className="drawer-select"
                          sx={{ m: 0, width: '100%' }}
                        >
                          <Select
                            value={classId}
                            onChange={handleCohortSelection}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="select-languages capitalize fs-14 fw-500 bg-white"
                            style={{
                              borderRadius: '0.5rem',
                              color: theme.palette.warning['200'],
                              width: '100%',
                              marginBottom: '0rem',
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            IconComponent={(props) => (
                              <ArrowDropDownIcon
                                {...props}
                                style={{ color: 'black' }}
                              />
                            )}
                          >
                            {cohortsData?.length !== 0 ? (
                              manipulatedCohortData?.map((cohort) => (
                                <MenuItem
                                  key={cohort.cohortId}
                                  value={cohort.cohortId}
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: theme.palette.warning['A200'],
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {cohort.name} ({cohort?.typeOfCohort})
                                </MenuItem>
                              ))
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography color={theme.palette.warning['300']}>
                          {cohortsData[0]?.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box className="mt-md-16">
                    <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                      {cohortsData?.length > 1 ? (
                        <FormControl
                          className="drawer-select "
                          sx={{ m: 0, width: '100%' }}
                        >
                          <Select
                            value={classId}
                            onChange={handleCohortSelection}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="select-languages fs-14 fw-500 bg-white"
                            style={{
                              borderRadius: '0.5rem',
                              color: theme.palette.warning['200'],
                              width: '100%',
                              marginBottom: '0rem',
                            }}
                          >
                            {cohortsData?.length !== 0 ? (
                              manipulatedCohortData?.map((cohort) => (
                                <MenuItem
                                  key={cohort.cohortId}
                                  value={cohort.cohortId}
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: theme.palette.warning['A200'],
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {cohort?.name}
                                </MenuItem>
                              ))
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography color={theme.palette.warning['300']}>
                          {cohortsData[0]?.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CohortSelectionSection;

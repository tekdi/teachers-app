import {
  Box,
  FormControl,
  InputLabel,
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
import {
  CenterType,
  cohortHierarchy,
  QueryKeys,
  Status,
  Telemetry,
} from '@/utils/app.constant';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import ReactGA from 'react-ga4';
import Loader from './Loader';
import { showToastMessage } from './Toastify';
import manageUserStore from '@/store/manageUserStore';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';
import { telemetryFactory } from '@/utils/telemetry';
import { toPascalCase } from '@/utils/Helper';
import { useQueryClient } from '@tanstack/react-query';
import { getUserDetails } from '@/services/ProfileService';
import { useDirection } from '../hooks/useDirection';

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
  blockName?: string;
  isManipulationRequired?: boolean;
  setBlockName?: React.Dispatch<React.SetStateAction<string>>;
  handleSaveHasRun?: boolean;
  setHandleSaveHasRun?: React.Dispatch<React.SetStateAction<boolean>>;
  isCustomFieldRequired?: boolean;
  showFloatingLabel?: boolean;
  showDisabledDropDown?: boolean;
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
  showFloatingLabel = false,
  showDisabledDropDown = false,
}) => {
  console.log('cohortsData', classId, cohortsData[0]?.cohortId);
  const router = useRouter();
  const theme = useTheme<any>();
  const queryClient = useQueryClient();

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
          const response = await queryClient.fetchQuery({
            queryKey: [QueryKeys.MY_COHORTS, userId],
            queryFn: () => getCohortList(userId, { customField: 'true' }),
          });

          const cohortData = response[0];
          let userDetailsResponse;
          if (userId) {
            userDetailsResponse = await getUserDetails(userId, true);
          }
          const blockObject =
            userDetailsResponse?.result?.userData?.customFields.find(
              (item: any) => item?.label === 'BLOCKS'
            );

          if (cohortData?.customField?.length) {
            const district = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'DISTRICTS'
            );

            if (district) {
              setDistrictCode(district?.code);
              setDistrictId(district?.fieldId);
            }

            const state = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'STATES'
            );

            if (state) {
              setStateCode(state?.code);
              setStateId(state?.fieldId);
            }

            const blockField = cohortData?.customField?.find(
              (field: any) => field?.label === 'BLOCKS'
            );

            if (blockObject) {
              setBlockCode(blockObject?.code);
              setBlockId(blockObject?.fieldId);
            }
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
              setCohorts(filteredData);
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
              if (setBlockName) {
                setBlockName(
                  response?.[0]?.name || response?.[0]?.cohortName || ''
                );
              }
              setBlock(response[0].name || response[0].cohortName);
              const filteredData = response[0].childData
                ?.map((item: any) => {
                  const typeOfCohort = item?.customField?.find(
                    (field: any) => field?.label === 'TYPE_OF_COHORT'
                  )?.value;

                  return {
                    cohortId: item?.cohortId,
                    parentId: item?.parentId,
                    name: item?.cohortName || item?.name,
                    typeOfCohort: typeOfCohort || t('ATTENDANCE.UNKNOWN'),
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
    setClassId(event.target.value);
    ReactGA.event('cohort-selection-dashboard', {
      selectedCohortID: event.target.value,
    });
    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'cohort-selection-dashboard',
        type: Telemetry.SEARCH,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
    localStorage.setItem('classId', event.target.value);
    setHandleSaveHasRun?.(!handleSaveHasRun);

    // ---------- set cohortId and stateName-----------
    const cohort_id = event.target.value;
    localStorage.setItem('cohortId', cohort_id);
  };

  const teacher: string | null =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('role')
      : null;

  const isAttendanceOverview = pathname === '/attendance-overview';
  const isAssessment = pathname === '/assessments';
  const dashboard = pathname === '/dashboard';
  const isCoursePlanner = pathname === '/course-planner';

  const { dir, isRTL } = useDirection();

  return (
    <Box
      className={
        isAttendanceOverview || isAssessment || isCoursePlanner
          ? 'w-100'
          : 'w-md-40'
      }
    >
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      {!loading && cohortsData && (
        <Box
          sx={{
            '@media (min-width: 900px)': {
              marginTop: dashboard
                ? teacher === 'Teacher'
                  ? '0px'
                  : '-25px'
                : 'unset',
              marginRight: dashboard ? '15px' : 'unset',
            },
          }}
        >
          {!loading && cohortsData && (
            <Box>
              {blockName ? (
                <Box>
                  <Typography
                    color={theme.palette.warning['300']}
                    textAlign={'left'}
                    sx={{ fontSize: '12px', color: '#777' }}
                  >
                    {blockName} {t('DASHBOARD.BLOCK')}
                  </Typography>
                  <Box className="mt-md-16">
                    <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                      {cohortsData?.length > 1 ? (
                        <FormControl
                          className="drawer-select"
                          sx={{
                            m: 0,
                            width: '100%',
                            // '@media (max-width: 700px)': {
                            //   width: '50%',
                            // },
                          }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="center-select-label">
                              {t('COMMON.CENTER')}
                            </InputLabel>
                          )}
                          <Select
                            value={classId}
                            labelId="center-select-label"
                            onChange={handleCohortSelection}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="select-languages capitalize fs-14 fw-500 bg-white"
                            sx={{
                              borderRadius: '0.5rem',
                              color: theme.palette.warning['200'],
                              width: '100%',
                              marginBottom: '0rem',
                              '@media (max-width: 900px)': {
                                width: isAttendanceOverview ? '100%' : '62%',
                              },
                              // '& .MuiSelect-icon': {
                              //   right: isRTL ? 'unset' : '7px',
                              //   left: isRTL ? '7px' : 'unset',
                              // },
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
                                  {toPascalCase(cohort.name)}{' '}
                                  {cohort?.typeOfCohort ===
                                    CenterType.REGULAR ||
                                    (CenterType.UNKNOWN &&
                                      `(${cohort?.typeOfCohort?.toLowerCase()})`)}
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
                          {toPascalCase(cohortsData[0]?.name)}
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
                          className={showFloatingLabel ? '' : 'drawer-select'}
                          sx={{ m: 0, width: '100%' }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="center-select-label">
                              {t('COMMON.CENTER')}
                            </InputLabel>
                          )}
                          <Select
                            labelId="center-select-label"
                            label={showFloatingLabel ? t('COMMON.CENTER') : ''}
                            value={classId ? classId : cohortsData[0]?.cohortId}
                            onChange={handleCohortSelection}
                            // displayEmpty
                            // style={{ borderRadius: '4px' }}

                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            className={
                              showFloatingLabel
                                ? ''
                                : 'select-languages fs-14 fw-500 bg-white'
                            }
                            sx={
                              showFloatingLabel
                                ? { borderRadius: '4px' }
                                : {
                                    borderRadius: '0.5rem',
                                    color: theme.palette.warning['200'],
                                    width: '100%',
                                    marginBottom: '0rem',
                                    marginRight: '10px',
                                    '@media (max-width: 902px)': {
                                      width: isAttendanceOverview
                                        ? '100%'
                                        : '62%',
                                    },
                                    '@media (max-width: 702px)': {
                                      width: isAttendanceOverview
                                        ? '100%'
                                        : '65%',
                                    },
                                    // '& .MuiSelect-icon': {
                                    //   right: isRTL ? 'unset' : '7px',
                                    //   left: isRTL ? '7px' : 'unset',
                                    // },
                                    // ' & .MuiFormLabel-root-MuiInputLabel-root':
                                    //   {
                                    //     right: isRTL ? '30px' : 'unset',
                                    //   },
                                  }
                            }
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
                                  {toPascalCase(cohort?.name)}
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
                        <>
                          {showDisabledDropDown && cohortsData?.length === 1 ? (
                            <FormControl
                              disabled={true}
                              className={
                                showFloatingLabel ? '' : 'drawer-select'
                              }
                              sx={{ m: 0, width: '100%' }}
                            >
                              {showFloatingLabel && (
                                <InputLabel id="center-select-label">
                                  {t('COMMON.CENTER')}
                                </InputLabel>
                              )}
                              <Select
                                labelId="center-select-label"
                                label={
                                  showFloatingLabel ? t('COMMON.CENTER') : ''
                                }
                                value={cohortsData[0]?.cohortId}
                              >
                                <MenuItem
                                  key={cohortsData[0]?.cohortId}
                                  value={cohortsData[0]?.cohortId}
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: theme.palette.warning['A200'],
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {cohortsData[0]?.name}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography color={theme.palette.warning['300']}>
                              {cohortsData[0]?.name}
                            </Typography>
                          )}
                        </>
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

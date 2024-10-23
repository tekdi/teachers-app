import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
// import AddEntityModal from '@/components/observations/AddEntityModal';
import { ObservationEntityType, Role } from '@/utils/app.constant';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { toPascalCase } from '@/utils/Helper';
import { getCohortList } from '@/services/CohortServices';
import {
  getMyCohortFacilitatorList,
  getMyCohortMemberList,
} from '@/services/MyClassDetailsService';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import SearchIcon from '@mui/icons-material/Search';

import Pagination from '@mui/material/Pagination';
import { CohortMemberList } from '@/utils/Interfaces';
import { addEntities, checkEntityStatus, fetchEntities } from '@/services/ObservationServices';
import { useTranslation } from 'react-i18next';

interface EntityData {
  cohortId: string;
  name: string;
}

const ObservationDetails = () => {
  const router = useRouter();
  const { entity } = router.query;
  const { Id } = router.query;

  const { observationName } = router.query;

  const [myCohortList, setMyCohortList] = useState<any[]>([]);
  const [myCohortListForCenter, setmyCohortListForCenter] = useState<any[]>([]);
  const [cohortIdData, setCohortIdData] = useState<any[]>([]);

  const [totalCountForCenter, setTotalCountForCenter] = React.useState(0);

  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [Data, setData] = React.useState<Array<any>>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageLimit, setPageLimit] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [pageForCenter, setPageForCenter] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);


  const [limit, setLimit] = React.useState(pageLimit);

  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation();

  const theme = useTheme<any>();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (userId) {
          const response = await getCohortList(userId, { customField: 'true' });
          console.log('response', response[0]?.childData);

          if (localStorage.getItem('role') === Role.TEAM_LEADER) {
            if (searchInput !== '' && entity === ObservationEntityType.CENTER) {
              const filteredData = response[0]?.childData?.filter(
                (cohort: any) =>
                  cohort?.name
                    ?.toLowerCase()
                    .includes(searchInput?.toLowerCase())
              );
              setMyCohortList(filteredData);
            } else {
              setMyCohortList(response[0]?.childData);
            }
            if (selectedCohort === '')
              setSelectedCohort(response[0]?.childData[0]?.cohortId);
            console.log('myCohortList', response[0]?.childData);
          } else {
            setMyCohortList(response);
            if (selectedCohort === '') setSelectedCohort(response[0]?.cohortId);
          }

          if (searchInput !== '' && ObservationEntityType.CENTER) {
            const filteredData = response[0]?.childData?.filter((cohort: any) =>
              cohort?.name?.toLowerCase().includes(searchInput?.toLowerCase())
            );

            setmyCohortListForCenter(filteredData.slice(0, 5));
          } else setmyCohortListForCenter(response.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };
    fetchCohorts();
  }, [searchInput]);

 

  useEffect(() => {
    setmyCohortListForCenter(
      myCohortList.slice(pageForCenter, pageForCenter + pageLimit)
    );

    setTotalCountForCenter(myCohortList?.length);
  }, [myCohortList, pageForCenter]);


  useEffect(() => {
    const fetchEntityList = async () => {
      try {
        
        const urlPath = window.location.pathname;

        // Split the URL path to extract the ID after "/observation"
        //console.log("urlPath", urlPath)
        const solutionId = urlPath.split('/observation/')[1];
        console.log("urlPath", solutionId)

     const response=await fetchEntities({solutionId})

     const entityIds = response?.result?.entities.map((item: any )=> item._id);
     const unmatchedCohorts = myCohortListForCenter.filter((child:any )=> !entityIds.includes(child.cohortId));
     const unmatchedCohortIds = unmatchedCohorts.map(cohort => cohort.cohortId);
     setCohortIdData(unmatchedCohortIds)
    // const data=unmatchedCohortIds
     const data={
      "data":unmatchedCohortIds
     }
     if(Id && unmatchedCohortIds.length!==0)
     {
      let observationId=Id
      let r=await addEntities({data, observationId})

     }


      } catch (error) {
        setData([]);

        console.error('Error fetching cohort list:', error);
      } finally {
      }
    };
    fetchEntityList();
  }, [myCohortListForCenter]);



  useEffect(() => {
    const entityStatus = async () => {
      try {
        let observationId=Id;
        let entityId=myCohortListForCenter[0]?.cohortId
        if(myCohortListForCenter.length!==0 && Id)
        {
          const response=await checkEntityStatus({observationId,entityId})

        }


      } catch (error) {
        setData([]);

        console.error('Error fetching cohort list:', error);
      } finally {
      }
    };
    entityStatus();
  }, [myCohortListForCenter, Id]);



  useEffect(() => {
    const handleCohortChange = async () => {
      try {
        console.log('handlecohortChange');
        let filters = {
          cohortId: selectedCohort,
        } as CohortMemberList['filters'];
        if (searchInput !== '') filters.name = searchInput;
        //const limit=limit;
        let response;
        if (entity === ObservationEntityType?.LEARNER) {
          response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
        } else if (entity === ObservationEntityType?.FACILITATOR) {
          response = await getMyCohortFacilitatorList({
            limit,
            page,
            filters,
          });
        }

        const resp = response?.result?.userDetails;
        setTotalCount(response?.result?.totalCount);
        if (resp) {
          const userDetails = resp.map((user: any) => {
            const ageField = user.customField.find(
              (field: { label: string }) => field.label === 'AGE'
            );
            return {
              name: toPascalCase(user?.name),
              userId: user?.userId,
              memberStatus: user?.status,
              statusReason: user?.statusReason,
              cohortMembershipId: user?.cohortMembershipId,
              enrollmentNumber: user?.username,
              age: ageField ? ageField.value : null,
            };
          });

          setData(userDetails);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);

        console.error('Error fetching cohort list:', error);
      } finally {
      }
    };
    handleCohortChange();
  }, [page, selectedCohort, searchInput]);

  const onPreviousClick = () => {
    if (entity === ObservationEntityType?.CENTER) {
      setPageForCenter(pageForCenter - pageLimit);
    }
    setPage(page - pageLimit);
  };
  function onNextClick() {
    if (entity === ObservationEntityType?.CENTER) {
      setPageForCenter(pageForCenter + pageLimit);
    } else {
      setPage(page + pageLimit);
    }
  }
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    



    const value = event.target.value;
    setSearchInput(value)
    // Trigger the search logic only if input has 3 or more characters
    if (value.length >= 3) {
      // Call your search logic here
      setSearchInput(event.target.value.toLowerCase());
    }
  };
  const handleCohortChange = async (event: any) => {
    setCurrentPage(0);
    setPage(0);
    setSelectedCohort(event.target.value);
  };

  const onStartObservation = (cohortId:any) => {


   
    console.log("cohortId", cohortId)
    const basePath = router.asPath.split('?')[0];
    const newFullPath = `${basePath}/questionary`;
    const queryParams = { cohortId:cohortId, Id:Id};
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };

  const renderEntityData = (data: EntityData[], entityType: string) =>
    data.map((item) => (
      
      <Box
        key={item.cohortId}
        sx={{
          margin: '10px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography margin="10px">{item.name}</Typography>
        <Button
          sx={{ width: '160px', height: '40px', marginLeft: 'auto' }}
          onClick={() => onStartObservation(item?.cohortId)}
          >
          {t('OBSERVATION_SURVEYS.OBSERVATION_START')}
        </Button>
      </Box>
    ));

  const entityContent = useMemo(() => 
  {
    console.log("myCohortListForCenter", myCohortListForCenter)
    switch (entity?.toString()) {
      case ObservationEntityType.CENTER:
        return renderEntityData(
          myCohortListForCenter,
          ObservationEntityType.CENTER
        );
      case ObservationEntityType.LEARNER:
        return renderEntityData(Data, ObservationEntityType.LEARNER);
      case ObservationEntityType.FACILITATOR:
        return renderEntityData(Data, ObservationEntityType.FACILITATOR);
      default:
        return null;
    }
  }, [entity, myCohortListForCenter, Data]);

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log(value);
    setCurrentPage(value - 1);
    if (entity === ObservationEntityType.CENTER)
      setPageForCenter((value - 1) * limit);
    else setPage((value - 1) * limit);

    // setPageOffset(value - 1);
    // setOffset((value - 1)*limit)
  };

  const handleBackEvent = () => {
    window.history.back();
  };

  return (
    <>
      <Header />
      <Box m="20px">
        <Box
          sx={{
            display: 'flex',
            direction: 'row',
            gap: '24px',
            // alignItems: 'center',
            // color: theme.palette.warning['A200'],
            // padding: '15px 20px 5px',
          }}
          width={'100%'}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
              // transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
            onClick={handleBackEvent}
          />
          <Typography variant="h1">{observationName}</Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Left side - Observation details and buttons */}
          <Grid item xs={12} md={9}>
            {' '}
            {/* Increased the left side size */}
            <Box position="relative" bgcolor="#FBF4E5" width="100%" p="20px">
              <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                <Typography variant="h2">{t('OBSERVATION_SURVEYS.OBSERVATION_DETAILS')}</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  direction: 'row',
                }}
              >
                {entity !== ObservationEntityType?.CENTER && (
                  <FormControl sx={{ m: 3, width: 300 }}>
                    <InputLabel id="demo-single-name-label">
                    {t("COMMON.CENTER_NAME")}
                    </InputLabel>
                    <Select
                      labelId="demo-single-name-label"
                      id="demo-single-name"
                      value={selectedCohort}
                      onChange={handleCohortChange}
                      input={<OutlinedInput label="Cohort Name" />}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: '200px',
                            overflowY: 'auto',
                          },
                        },
                      }}
                    >
                      {myCohortList?.map((cohort: any) => (
                        <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                          {localStorage.getItem('role') === Role.TEAM_LEADER
                            ? cohort.name
                            : cohort.cohortName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  variant="outlined"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginTop: 3, width: '300px' }}
                />
              </Box>

              <Box sx={{ marginTop: '20px' }}>{entityContent}</Box>
              {totalCountForCenter > 6 &&
                entity === ObservationEntityType.CENTER && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      margin: '20px',
                      gap: '15px',
                    }}
                  >
                    <Pagination
                      // size="small"
                      color="primary"
                      count={Math.ceil(totalCountForCenter / pageLimit)}
                      page={currentPage + 1}
                      onChange={handlePaginationChange}
                      siblingCount={0}
                      boundaryCount={1}
                      sx={{ marginTop: '10px' }}
                    />
                  </Box>
                )}

              {totalCount > 6 && entity !== ObservationEntityType.CENTER && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    margin: '20px',
                    gap: '15px',
                  }}
                >
                  <Pagination
                    // size="small"
                    color="primary"
                    count={Math.ceil(totalCount / pageLimit)}
                    page={currentPage + 1}
                    onChange={handlePaginationChange}
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{ marginTop: '10px' }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default ObservationDetails;

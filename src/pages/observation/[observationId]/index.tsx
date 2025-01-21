import Header from '@/components/Header';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
// import AddEntityModal from '@/components/observations/AddEntityModal';
import { getCohortList } from '@/services/CohortServices';
import {
  getMyCohortFacilitatorList,
  getMyCohortMemberList,
} from '@/services/MyClassDetailsService';
import { ObservationEntityType, ObservationStatus, Role, Status, Telemetry } from '@/utils/app.constant';
import { formatDate, toPascalCase } from '@/utils/Helper';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Loader from '@/components/Loader';
import Entity from '@/components/observations/Entity';
import SearchBar from '@/components/Searchbar';
import {
  addEntities,
  fetchEntities,
  targetSolution
} from '@/services/ObservationServices';
import { CohortMemberList } from '@/utils/Interfaces';
import { telemetryFactory } from '@/utils/telemetry';
import { useTranslation } from 'next-i18next';
interface EntityData {
  cohortId?: string;
  name?: string;
  userId?:string;
  status?:string;
  _id?:string
}

const ObservationDetails = () => {
  const router = useRouter();
  const { entity } = router.query;
  const { Id } = router.query;

  const { observationName } = router.query;

  const [myCohortList, setMyCohortList] = useState<any[]>([]);
  const [centerList, setCenterList] = useState<any[]>([]);

  const [myCohortListForCenter, setmyCohortListForCenter] = useState<any[]>([]);
  const [cohortIdData, setCohortIdData] = useState<any[]>([]);
  const [entityIds, setEntityIds] = useState<any[]>([]);
  const [fetchEntityResponse, setFetchEntityResponse] = useState<any[]>([]);
  const [entityData, setEntityData] = useState<any[]>([]);
  const [filteredEntityData, setFilteredEntityData] = useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [observationId, setObservationId] = React.useState("");

  const isSmallScreen = useMediaQuery('(max-width:938px)');




  const [userIdData, setUserIdData] = useState<any[]>([]);


  const [totalCountForCenter, setTotalCountForCenter] = React.useState(0);

  const [selectedCohort, setSelectedCohort] = useState<string>('');
  const [Data, setData] = React.useState<Array<any>>([]);
  const [firstEntityStatus, setFirstEntityStatus] = React.useState<string>("");

  const [totalCount, setTotalCount] = React.useState(0);
  const [pageLimit, setPageLimit] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [pageForCenter, setPageForCenter] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);

  const [limit, setLimit] = React.useState(pageLimit);

  const [searchInput, setSearchInput] = useState('');

  const { t, i18n } = useTranslation();
  const [observationData, setObservationData] = useState<any>([]);
  const [observationDescription, setObservationDescription] = useState<any>();
  const [observationEndDate, setObservationEndDate] = useState<any>("");

  const [status, setStatus] = useState(ObservationStatus.ALL);

  const theme = useTheme<any>();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (userId) {
          const response = await getCohortList(userId, { customField: 'true' });
            let filteredData;
          if (localStorage.getItem('role') === Role.TEAM_LEADER) {
            if (searchInput !== '' && entity === ObservationEntityType.CENTER) {
               filteredData = response[0]?.childData
              ?.filter(
                (cohort: any) =>
                  cohort?.name?.toLowerCase()?.includes(searchInput?.toLowerCase()) &&
                  cohort?.status?.toLowerCase() === Status.ACTIVE
              )
              ?.sort((a: any, b: any) => a.name.localeCompare(b.name));
            

              setMyCohortList(filteredData);
            } else {
               filteredData = response[0]?.childData?.filter(
                (cohort: any) => cohort?.status?.toLowerCase() === Status.ACTIVE
              )?.sort((a: any, b: any) => a.name.localeCompare(b.name));

              setMyCohortList(filteredData);
            }
            if (selectedCohort === '')
            {
              // const data= typeof window !== 'undefined'
              // ? localStorage.getItem("selectedCohort") || localStorage.getItem('role') === Role.TEAM_LEADER? response[0]?.childData[0]?.cohortId:response[0]?.cohortId
              // : response[0]?.childData[0]?.cohortId;
              const data=localStorage.getItem("selectedCohort")?localStorage.getItem("selectedCohort"):localStorage.getItem('role') === Role.TEAM_LEADER?filteredData[0]?.cohortId:filteredData[0]?.cohortId
              
              setSelectedCohort(data)
            }
             
          } else {
            setMyCohortList(response);
            if (selectedCohort === '')
            {
              const data=localStorage.getItem("selectedCohort")?localStorage.getItem("selectedCohort"):localStorage.getItem('role') === Role.TEAM_LEADER?response[0]?.childData[0]?.cohortId:response[0]?.cohortId

              
              setSelectedCohort(data)
            } 
          }

          if (searchInput !== '' || entity===ObservationEntityType.CENTER) {
            const filteredData = response[0]?.childData?.filter((cohort: any) =>
              cohort?.name?.toLowerCase().includes(searchInput?.toLowerCase())
            )?.sort((a: any, b: any) => 
            a?.name?.localeCompare(b?.name)
          );

            setmyCohortListForCenter(filteredData);
          } else 
          setmyCohortListForCenter(response);
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };
    fetchCohorts();
  }, [searchInput]);

  useEffect(() => {
    const fetchObservationData = async () => {
      try {
        const response = await targetSolution();
        setObservationData(response?.result?.data || []);
      

      } catch (error) {
        console.error('Error fetching cohort list:', error);
      }
    };
    fetchObservationData();
  }, []);

  useEffect(() => {
   const result = observationData?.find((item:any) => item._id === Id);
   setObservationDescription(result?.description)
   setObservationEndDate(result?.endDate)

  }, [Id, observationData]);

  useEffect(() => {
    const fetchEntityList = async () => {
      try {
        const urlPath = window.location.pathname;
        const solutionId = urlPath.split('/observation/')[1];
        if (solutionId) {
          let entities = entityIds;
  
        //  if (entities?.length === 0) 
          {
            const response = await fetchEntities({ solutionId });
            setObservationId(response?.result?._id)
            setFetchEntityResponse(response?.result?.entities)
            entities = response?.result?.entities?.map(
              (item: any) => item?._id
            );
  
            setEntityIds(entities);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
      }
    };
    if(entity!==ObservationEntityType.CENTER && Data.length!==0)
    fetchEntityList();
  else if(entity===ObservationEntityType.CENTER && myCohortListForCenter.length!==0)
  fetchEntityList();

  }, [Data, myCohortListForCenter]);

  useEffect(() => {
    
if( entity!==ObservationEntityType.CENTER)
{
  const result = Data.map(user => {
    const submission = fetchEntityResponse.find(sub => sub._id === user.userId) || {};
    return {
        name: user.name,
        _id: user.userId,
        submissionsCount: submission.submissionsCount || 0,
        submissionId: submission.submissionId || null,
        status: submission.status || ObservationStatus.NOT_STARTED
    };
});
setEntityData(result)
setFilteredEntityData(result)

}
else{
  const result = myCohortListForCenter?.map(cohort => {
    const submission = fetchEntityResponse.find(sub => sub._id === cohort.cohortId) || {};
    return {
        name: cohort?.name,
        _id: cohort?.cohortId,
        submissionsCount: submission.submissionsCount || 0,
        submissionId: submission.submissionId || null,
        status: submission.status || ObservationStatus.NOT_STARTED
    };
});
setEntityData(result)
setFilteredEntityData(result)
}
    
  

  }, [fetchEntityResponse, Data, myCohortListForCenter]);
  useEffect(() => {

    if (entityIds?.length > 0) {
      const unmatchedCohorts = myCohortListForCenter?.filter(
        (child: any) => !entityIds?.includes(child.cohortId)
      );
      const unmatchedUsers = Data?.filter(
        (child: any) => !entityIds?.includes(child.userId)
      );
  
      const unmatchedUserIds = unmatchedUsers?.map(
        (child: any) => child?.userId
      );
      const unmatchedCohortIds = unmatchedCohorts?.map(
        (cohort) => cohort?.cohortId
      );
  
      setCohortIdData(unmatchedCohortIds);
      setUserIdData(unmatchedUserIds);
  
      const data = {
        data: entity !== ObservationEntityType.CENTER ? unmatchedUserIds : unmatchedCohortIds,
      };
  
      const executeAddEntities = async () => {
          if (entity === ObservationEntityType.CENTER && unmatchedCohortIds.length !== 0) {
            await addEntities({ data, observationId });
            const urlPath = window.location.pathname;

          const solutionId = urlPath.split('/observation/')[1];

          const response = await fetchEntities({ solutionId });
          setObservationId(response?.result?._id)

            setFetchEntityResponse(response?.result?.entities)
          } else if (unmatchedUserIds.length !== 0) {
            await addEntities({ data, observationId });
            const urlPath = window.location.pathname;

          const solutionId = urlPath.split('/observation/')[1];

          const response = await fetchEntities({ solutionId });
          setObservationId(response?.result?._id)

            setFetchEntityResponse(response?.result?.entities)
          }
          
        
      };
  
      executeAddEntities();
    }
  }, [entityIds, Data,observationId]);
  
  

  useEffect(() => {
    const handleCohortChange = async () => {
      try {
        setLoading(true)
        const filters = {
          cohortId: selectedCohort,
        } as CohortMemberList['filters'];
        if (searchInput !== '') filters.firstName = searchInput;
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
              name: toPascalCase(user?.firstName || '') + ' ' + (user?.lastName ? toPascalCase(user.lastName) : ""),
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
        setLoading(false)

      }
    };
    if(selectedCohort && selectedCohort!=='')
    handleCohortChange();
  }, [page, selectedCohort, searchInput, entity, i18n?.language]);

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
    setSearchInput(value);
    // Trigger the search logic only if input has 3 or more characters
    if (value.length >= 3) {
      // Call your search logic here
      setSearchInput(event.target.value.toLowerCase());
    }
  };
  const handleCohortChange = async (event: any) => {
    setStatus(ObservationStatus.ALL);

    setCurrentPage(0);
    setPage(0);
    setSelectedCohort(event.target.value);
    localStorage.setItem("selectedCohort",event.target.value)
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'observation',
        cdata: [],
      },
      edata: {
        id: 'filter-by-center:'+event.target.value,
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const onStartObservation = (cohortId: any, name?:any) => {
    localStorage.setItem("observationName",  name)

    localStorage.setItem("observationPath",  router.asPath)
    const basePath = router.asPath.split('?')[0];
    const newFullPath = `${basePath}/questionary`;
    const { observationName } = router.query;
    const { Id } = router.query;


    const queryParams = { entityId: cohortId, Id: observationId , observationName: observationName };
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };


  const renderEntityData = (data: EntityData[], entityType: string) => {
    // if (!data || data.length === 0) {
    //   return <Typography ml="40%"> {t('OBSERVATION.NO_DATA_FOUND',{
    //     entity:entity,
    //   })}
    //   </Typography>;
    // }
  
    return data.map((item, index) => (
      <Entity
        key={item.cohortId || index} // Use a unique key here
        entityMemberValue={toPascalCase(item?.name)}
        status={item?.status===ObservationStatus?.STARTED?ObservationStatus.NOT_STARTED:item?.status}
        onClick={() =>
          entityType !== ObservationEntityType.CENTER
            ? onStartObservation(item?._id, item?.name)
            : onStartObservation(item?._id, item?.name)
        }
      />
    ));
  };
  

  const entityContent = useMemo(() => {
    switch (entity?.toString()) {
      case ObservationEntityType.CENTER:
        if(myCohortListForCenter.length!==0)
        {
          return renderEntityData(
            filteredEntityData,
            ObservationEntityType.CENTER
          );
        }
        
      case ObservationEntityType.LEARNER:
        return renderEntityData(filteredEntityData, ObservationEntityType.LEARNER);
      case ObservationEntityType.FACILITATOR:
        return renderEntityData(filteredEntityData, ObservationEntityType.FACILITATOR);
      default:
        return null;
    }
  }, [entity, myCohortListForCenter, Data, filteredEntityData, i18n?.language ]);

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
    if (entity === ObservationEntityType.CENTER)
      setPageForCenter((value - 1) * limit);
    else setPage((value - 1) * limit);

    // setPageOffset(value - 1);
    // setOffset((value - 1)*limit)
  };

  const handleBackEvent = () => {
    //  router.push(
    //     `${localStorage.getItem('observationPath')}`
    //   );
    router.push('/observation');
    
  };
  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);

    if(event.target.value===ObservationStatus.ALL)
    {
      setFilteredEntityData(entityData);

    }
   else if(event.target.value===ObservationStatus.NOT_STARTED)
    {
      const filteredData = entityData.filter(item => item.status === event.target.value || item.status === ObservationStatus.STARTED);
      setFilteredEntityData(filteredData);

    }
    else
    {
      const filteredData = entityData.filter(item => item.status === event.target.value);
        setFilteredEntityData(filteredData);
    }
   


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
            
          }}
          width={'100%'}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
            }}
            onClick={handleBackEvent}
          />
          <Typography variant="h1" color={"black"}>{observationName}</Typography>
        </Box>

        <Grid >
          {/* Left side - Observation details and buttons */}
          <Grid >
            {' '}
            {/* Increased the left side size */}
            <Box position="relative" bgcolor="#FBF4E5" width="100%" p="20px" >
              <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                <Typography variant="h2" color={"black"} sx={{ fontWeight: 'bold' }}>
                 {t('OBSERVATION.OBSERVATION_DETAILS')}
                </Typography>
               
                <Typography variant="h2"color={"black"} mt="20px">
                  {observationDescription}
                </Typography>
              {observationEndDate!=="" && (<Typography variant="body1" color={"black"}>
                {t('OBSERVATION.DUE_DATE')}: {observationEndDate!=="" ?formatDate(observationEndDate?.toString()) : "N/A"}
      </Typography>)}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  direction: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '@media (max-width: 908px)': {
                    flexDirection: 'column',
                    
                  }
                }}
              >

               
<Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  width: '100%',
                  '@media (max-width: 908px)': {
                    flexDirection: 'column',
                  },
                  marginTop: '25px',
                }}
              >
                {entity !== ObservationEntityType?.CENTER && (
                  <FormControl
                    sx={{
                      width: { xs: '100%', sm: '100%', md: 300 },
                      backgroundColor: 'white',
                    }}
                  >
                    <InputLabel id="center-name-label">
                      <Typography variant="h2" color="black">
                        {t('ATTENDANCE.CENTER_NAME')}
                      </Typography>
                    </InputLabel>
                    <Select
                      labelId="center-name-label"
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
                            ? toPascalCase(cohort.name)
                            : toPascalCase(cohort.cohortName)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
  
                <FormControl
                  sx={{
                    minWidth: { xs: '100%', sm: '100%', md: 300 },
                    backgroundColor: 'white',
                  }}
                >
                  <InputLabel>
                    <Typography variant="h2" color="black">
                      {t('OBSERVATION.OBSERVATION_STATUS')}
                    </Typography>
                  </InputLabel>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    label={t('OBSERVATION.OBSERVATION_STATUS')}
                    defaultValue={ObservationStatus.ALL}
                  >
                    <MenuItem value={ObservationStatus.ALL}>{t('COMMON.ALL')}</MenuItem>
                    <MenuItem value={ObservationStatus.NOT_STARTED}>{t('OBSERVATION.NOT_STARTED')}</MenuItem>
                    <MenuItem value={ObservationStatus.DRAFT}>{t('OBSERVATION.INPROGRESS')}</MenuItem>
                    <MenuItem value={ObservationStatus.COMPLETED}>{t('OBSERVATION.COMPLETED')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
                
                <Box
                  mt="10px"
                  sx={{
                    width: '100%',
                   
                  }}
                  
                >

                  <SearchBar
                    onSearch={setSearchInput}
                    value={searchInput}
                    placeholder="Search..."
                    backgroundColor={"white"}
                    fullWidth={true}
                  ></SearchBar>
                </Box>

              </Box>
            
              <Box
  sx={{
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: '20px',
                  mx: "10px"
  }}
>
  {loading ? (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '50%',
    }}
  >
    <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
    </Box>
  ) : Data.length === 0 ? entity &&(
    <Typography ml="40%">{t('OBSERVATION.NO_DATA_FOUND',{
      entity:entity,
    })}</Typography>
  ) : (
    entityContent
  )}
</Box>

              {/* {totalCountForCenter > 6 &&
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
              )} */}
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

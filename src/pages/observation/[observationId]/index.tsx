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
import { ObservationEntityType, Role , ObservationStatus, Telemetry} from '@/utils/app.constant';
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
import { formatDate } from '@/utils/Helper';

import Pagination from '@mui/material/Pagination';
import { CohortMemberList } from '@/utils/Interfaces';
import {
  addEntities,
  checkEntityStatus,
  fetchEntities,
  targetSolution,
} from '@/services/ObservationServices';
import { useTranslation } from 'next-i18next';
import { CheckBoxOutlineBlankRounded } from '@mui/icons-material';
import Entity from '@/components/observations/Entity';
import SearchBar from '@/components/Searchbar';
import { telemetryFactory } from '@/utils/telemetry';
import centers from '@/pages/centers';
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

  const { t } = useTranslation();
  const [observationData, setObservationData] = useState<any>([]);
  const [observationDescription, setObservationDescription] = useState<any>();
  const [observationEndDate, setObservationEndDate] = useState<any>("");

  const [status, setStatus] = useState(t('COMMON.ALL'));

  const theme = useTheme<any>();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (userId) {
          const response = await getCohortList(userId, { customField: 'true' });

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
            {
              // const data= typeof window !== 'undefined'
              // ? localStorage.getItem("selectedCohort") || localStorage.getItem('role') === Role.TEAM_LEADER? response[0]?.childData[0]?.cohortId:response[0]?.cohortId
              // : response[0]?.childData[0]?.cohortId;
              const data=localStorage.getItem("selectedCohort")?localStorage.getItem("selectedCohort"):localStorage.getItem('role') === Role.TEAM_LEADER?response[0]?.childData[0]?.cohortId:response[0]?.cohortId
              
              setSelectedCohort(data)
            }
             
            console.log('myCohortList', response[0]?.childData);
          } else {
            setMyCohortList(response);
            if (selectedCohort === '')
            {
              const data=localStorage.getItem("selectedCohort")?localStorage.getItem("selectedCohort"):localStorage.getItem('role') === Role.TEAM_LEADER?response[0]?.childData[0]?.cohortId:response[0]?.cohortId

              
              setSelectedCohort(data)
            } ;
          }

          if (searchInput !== '' || entity===ObservationEntityType.CENTER) {
            const filteredData = response[0]?.childData?.filter((cohort: any) =>
              cohort?.name?.toLowerCase().includes(searchInput?.toLowerCase())
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
            console.log("entityIds?.length", entities?.length);
            const response = await fetchEntities({ solutionId });
            setFetchEntityResponse(response?.result?.entities)
            entities = response?.result?.entities?.map(
              (item: any) => item?._id
            );
  
            setEntityIds(entities);
            console.log("setEntityIds", entities.length);
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
      let unmatchedCohorts = myCohortListForCenter?.filter(
        (child: any) => !entityIds?.includes(child.cohortId)
      );
      let unmatchedUsers = Data?.filter(
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
        if (Id) {
          const observationId = Id;
          if (entity === ObservationEntityType.CENTER && unmatchedCohortIds.length !== 0) {
            await addEntities({ data, observationId });
            const urlPath = window.location.pathname;

          const solutionId = urlPath.split('/observation/')[1];

          const response = await fetchEntities({ solutionId });
            setFetchEntityResponse(response?.result?.entities)
          } else if (unmatchedUserIds.length !== 0) {
            await addEntities({ data, observationId });
            const urlPath = window.location.pathname;

          const solutionId = urlPath.split('/observation/')[1];

          const response = await fetchEntities({ solutionId });
            setFetchEntityResponse(response?.result?.entities)
          }
          
        }
      };
  
      executeAddEntities();
    }
  }, [entityIds, Data]);
  
  

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
    if(selectedCohort && selectedCohort!=='')
    handleCohortChange();
  }, [page, selectedCohort, searchInput, entity]);

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
    setStatus(t('COMMON.ALL'));

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

  const onStartObservation = (cohortId: any) => {
    console.log('cohortId', cohortId);
    localStorage.setItem("observationPath",  router.asPath)
    const basePath = router.asPath.split('?')[0];
    const newFullPath = `${basePath}/questionary`;
    const { observationName } = router.query;
    const { Id } = router.query;


    const queryParams = { entityId: cohortId, Id: Id , observationName: observationName };
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };

  // const renderEntityData = (data: EntityData[], entityType: string) =>
  //   data?.map((item, index) => (
  //     // <Box
  //     //   key={item.cohortId}
  //     //   sx={{
  //     //     margin: '10px',
  //     //     background: 'white',
  //     //     display: 'flex',
  //     //     alignItems: 'center',
  //     //   }}
  //     // >
  //     //   <Typography margin="10px">{toPascalCase(item?.name) }</Typography>
  //     //   <Button
  //     //     sx={{ width: '160px', height: '40px', marginLeft: 'auto' }}
  //     //     onClick={() => entityType!==ObservationEntityType.CENTER?onStartObservation(item?.userId):onStartObservation(item?.cohortId)}
  //     //   >

  //     //    {index === 0 && firstEntityStatus==="draft"
  //     //   ? t('OBSERVATION_SURVEYS.CONTINUE') 
  //     //   : (index === 0 && firstEntityStatus==="submit")?t('OBSERVATION_SURVEYS.SUBMITTED'):t('OBSERVATION_SURVEYS.OBSERVATION_START')}
  //     //   </Button>
  //     // </Box>
  //     <Entity
  //     entityMemberValue={toPascalCase(item?.name)}
  //     status={index === 0?firstEntityStatus:"notstarted"}
  //     onClick={() => entityType!==ObservationEntityType.CENTER?onStartObservation(item?.userId):onStartObservation(item?.cohortId)}
  //     />
  //   ));


  const renderEntityData = (data: EntityData[], entityType: string) => {
    if (!data || data.length === 0) {
      return <Typography ml="40%"> {t('OBSERVATION.NO_DATA_FOUND',{
        entity:entity,
      })}
      </Typography>;
    }
  
    return data.map((item, index) => (
      <Entity
        key={item.cohortId || index} // Use a unique key here
        entityMemberValue={toPascalCase(item?.name)}
        status={item?.status===ObservationStatus?.STARTED?ObservationStatus.NOT_STARTED:item?.status}
        onClick={() =>
          entityType !== ObservationEntityType.CENTER
            ? onStartObservation(item?._id)
            : onStartObservation(item?._id)
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
  }, [entity, myCohortListForCenter, Data, filteredEntityData]);

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
    //  router.push(
    //     `${localStorage.getItem('observationPath')}`
    //   );
    router.push('/observation');
    
  };
  const handleStatusChange = (event: any) => {
    setStatus(event.target.value);

    if(event.target.value===t('COMMON.ALL'))
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
      console.log(entityData)
      console.log(event.target.value)
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
                <Typography variant="body1" color={"black"}>
                {t('OBSERVATION.DUE_DATE')}: {formatDate(observationEndDate?.toString()) || "N/A"}
      </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  direction: 'row',
                }}
              >
                {entity !== ObservationEntityType?.CENTER && (
                  <FormControl sx={{ m: 3, width: 300, backgroundColor:"white"}}>
                    <InputLabel  id="demo-single-name-label">
                      <Typography variant="h2"color={"black"}>
                      {t('ATTENDANCE.CENTER_NAME')}                </Typography>
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

                <Box
                mt="10px"
                >

<SearchBar
            onSearch={setSearchInput}
            value={searchInput}
            placeholder="Search..."   
            backgroundColor={"white"}
            fullWidth={true}
                   ></SearchBar>
                </Box>
                { (
                  <FormControl  sx={{ m: 3, minWidth: 200 }}>
                  <InputLabel>{t('OBSERVATION.OBSERVATION_STATUS')} </InputLabel>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    label={t('OBSERVATION.OBSERVATION_STATUS')}
                    defaultValue={t('COMMON.ALL')} 
                    sx={{
                      backgroundColor:"white"

                    }}
                  >
                    <MenuItem value={ObservationStatus.ALL}>  {t('COMMON.ALL')}  </MenuItem>
                    <MenuItem value={ObservationStatus.NOT_STARTED}> {t('OBSERVATION.NOT_STARTED')}</MenuItem>
                    <MenuItem value={ObservationStatus.DRAFT}>{t('OBSERVATION.INPROGRESS')}</MenuItem>
                    <MenuItem value={ObservationStatus.COMPLETED}>{t('OBSERVATION.COMPLETED')}</MenuItem>
                  </Select>
                </FormControl>
                )}


              </Box>
            
              <Box sx={{ marginTop: '20px' , display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap:"20px"}}>{entityContent}</Box>
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

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
import { ObservationEntityType, Role , ObservationStatus} from '@/utils/app.constant';
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
import {
  addEntities,
  checkEntityStatus,
  fetchEntities,
} from '@/services/ObservationServices';
import { useTranslation } from 'react-i18next';
import { CheckBoxOutlineBlankRounded } from '@mui/icons-material';
import Entity from '@/components/observations/Entity';
import SearchBar from '@/components/Searchbar';
interface EntityData {
  cohortId?: string;
  name?: string;
  userId?:string
}

const ObservationDetails = () => {
  const router = useRouter();
  const { entity } = router.query;
  const { Id } = router.query;

  const { observationName } = router.query;

  const [myCohortList, setMyCohortList] = useState<any[]>([]);
  const [myCohortListForCenter, setmyCohortListForCenter] = useState<any[]>([]);
  const [cohortIdData, setCohortIdData] = useState<any[]>([]);
  const [entityIds, setEntityIds] = useState<any[]>([]);

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
  const [description, setDescription] = useState('');

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
            {
              const data= typeof window !== 'undefined'
              ? localStorage.getItem("selectedCohort") || response[0]?.childData[0]?.cohortId
              : response[0]?.childData[0]?.cohortId;
              
              setSelectedCohort(data)
            }
             
            console.log('myCohortList', response[0]?.childData);
          } else {
            setMyCohortList(response);
            if (selectedCohort === '')
            {
              const data= typeof window !== 'undefined'
              ? localStorage.getItem("selectedCohort") || response[0]?.childData[0]?.cohortId
              : response[0]?.cohortId;
              
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
    const fetchEntityList = async () => {
      try {
        const urlPath = window.location.pathname;
        const solutionId = urlPath.split('/observation/')[1];
        if (solutionId) {
          let entities = entityIds;
  
          if (entities?.length === 0) {
            console.log("entityIds?.length", entities?.length);
            const response = await fetchEntities({ solutionId });
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
  
    fetchEntityList();
  }, []);
  
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
          } else if (unmatchedUserIds.length !== 0) {
            await addEntities({ data, observationId });
          }
        }
      };
  
      executeAddEntities();
    }
  }, [entityIds, myCohortListForCenter, Data, Id]);
  
  useEffect(() => {
    const entityStatus = async () => {
      try {
        let observationId = Id;
        let entityId = myCohortListForCenter[0]?.cohortId;
        
 if (myCohortListForCenter.length !== 0 && Id && entity===ObservationEntityType.CENTER && entityId) {
          const response = await checkEntityStatus({ observationId, entityId });
          if(response.result.length!==0)
           {
            if(response?.result[0]?.evidencesStatus[0]?.status===ObservationStatus.DRAFT)
                setFirstEntityStatus("draft")
              else if(response?.result[0]?.evidencesStatus[0]?.status===ObservationStatus.COMPLETED)
              setFirstEntityStatus("completed")
            else if(response?.result[0]?.evidencesStatus[0]?.status=== ObservationStatus.NOT_STARTED)
            setFirstEntityStatus("notstarted")

           }
           else
           {
               setFirstEntityStatus("notstarted")
           }
        
        }
       
        else{
          entityId = Data[0]?.userId;
          if(entityId)
          {
            const response = await checkEntityStatus({ observationId, entityId });
          console.log("response.result.length",response.result.length)
          if(response.result.length!==0)
           {
            if(response?.result[0]?.evidencesStatus[0]?.status==="draft")
                setFirstEntityStatus("draft")
              else if(response?.result[0]?.evidencesStatus[0]?.status==="completed")
              setFirstEntityStatus("completed")
            else if(response?.result[0]?.evidencesStatus[0]?.status==="notstarted")
            setFirstEntityStatus("notstarted")
        
           }
           else
           {
            setFirstEntityStatus("notstarted")
          }

          }
          
        }
      } catch (error) {

        console.error('Error fetching cohort list:', error);
      } finally {
      }
    };
    entityStatus();
  }, [myCohortListForCenter, Id, Data]);

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
    setSearchInput(value);
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
    localStorage.setItem("selectedCohort",event.target.value)
  };

  const onStartObservation = (cohortId: any) => {
    console.log('cohortId', cohortId);
    localStorage.setItem("observationPath",  router.asPath)
    const basePath = router.asPath.split('?')[0];
    const newFullPath = `${basePath}/questionary`;
    const { observationName } = router.query;

    const queryParams = { cohortId: cohortId, Id: Id , observationName: observationName };
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };

  const renderEntityData = (data: EntityData[], entityType: string) =>
    data.map((item, index) => (
      // <Box
      //   key={item.cohortId}
      //   sx={{
      //     margin: '10px',
      //     background: 'white',
      //     display: 'flex',
      //     alignItems: 'center',
      //   }}
      // >
      //   <Typography margin="10px">{toPascalCase(item?.name) }</Typography>
      //   <Button
      //     sx={{ width: '160px', height: '40px', marginLeft: 'auto' }}
      //     onClick={() => entityType!==ObservationEntityType.CENTER?onStartObservation(item?.userId):onStartObservation(item?.cohortId)}
      //   >

      //    {index === 0 && firstEntityStatus==="draft"
      //   ? t('OBSERVATION_SURVEYS.CONTINUE') 
      //   : (index === 0 && firstEntityStatus==="submit")?t('OBSERVATION_SURVEYS.SUBMITTED'):t('OBSERVATION_SURVEYS.OBSERVATION_START')}
      //   </Button>
      // </Box>
      <Entity
      entityMemberValue={toPascalCase(item?.name)}
      status={index === 0?firstEntityStatus:"notstarted"}
      onClick={() => entityType!==ObservationEntityType.CENTER?onStartObservation(item?.userId):onStartObservation(item?.cohortId)}
      />
    ));

  const entityContent = useMemo(() => {
    switch (entity?.toString()) {
      case ObservationEntityType.CENTER:
        if(myCohortListForCenter.length!==0)
        {
          return renderEntityData(
            myCohortListForCenter,
            ObservationEntityType.CENTER
          );
        }
        
      case ObservationEntityType.LEARNER:
        return renderEntityData(Data, ObservationEntityType.LEARNER);
      case ObservationEntityType.FACILITATOR:
        return renderEntityData(Data, ObservationEntityType.FACILITATOR);
      default:
        return null;
    }
  }, [entity, myCohortListForCenter, Data, firstEntityStatus]);

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
    router.push('/observation');

    
  };
  useEffect(() => {
    const data= typeof window !== 'undefined'
          ? localStorage.getItem("observationDescription") || ''
          : '';
          setDescription(data)
  }, []);

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
          <Typography variant="h1">{observationName}</Typography>
        </Box>

        <Grid >
          {/* Left side - Observation details and buttons */}
          <Grid >
            {' '}
            {/* Increased the left side size */}
            <Box position="relative" bgcolor="#FBF4E5" width="100%" p="20px">
              <Box sx={{ marginTop: '10px', marginLeft: '10px' }}>
                <Typography variant="h2">
                  {t('OBSERVATION.OBSERVATION_DETAILS')}
                </Typography>
                <Typography variant="h2">
                  {description}
                </Typography>
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
                      {t('ATTENDANCE.CENTER_NAME')}
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
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import React, { useEffect, useState } from 'react';
import { targetSolution } from '@/services/ObservationServices';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { FormContext, FormContextType, Role, Status, Telemetry } from '@/utils/app.constant';
import { entityList } from '../../../app.config';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/Searchbar';
import { toPascalCase } from '@/utils/Helper';
import { telemetryFactory } from '@/utils/telemetry';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ObservationForms: React.FC = () => {
  const [entityNames, setEntityNames] = useState<String[]>();
  const [observationData, setObservationData] = useState<any>([]);
  const [filteredObservationData, setFilteredObservationData] = useState<any>([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('all');  
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const currentDate = new Date();
  useEffect(() => {
    const fetchEntityList = async () => {
      try {
        const role = localStorage.getItem('role');
        if (role) {
          if (role === Role.TEAM_LEADER) {
            setEntityNames(entityList.TEAM_LEADER);
          } else if (role === Role.TEACHER) {
            setEntityNames(entityList.TEACHER);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
      }
    };
    fetchEntityList();
  }, []);

  useEffect(() => {
    const fetchObservationData = async () => {
      try {
        const response = await targetSolution();
        setObservationData(response?.result?.data || []);
        setFilteredObservationData(response?.result?.data || []);
        // const data=response?.result?.data;
        // data[1].endDate = "2027-11-15T14:26:18.803Z";
        // setObservationData(data || []);
        // setFilteredObservationData(data || []);

      } catch (error) {
        console.error('Error fetching cohort list:', error);
      }
    };
    if(entityNames &&entityNames?.length!==0)
    fetchObservationData();
  }, [entityNames]);

  const onCardClick = (
    observationId: string,
    entity: string,
    observationName: string,
    id: string,
    description:string,
    endDate:String
  ) => {
    const fullPath = router.asPath;
    const [basePath, queryString] = fullPath.split('?');
    const newRoute = `/${observationId}`;
    let newFullPath = `${basePath}${newRoute}`;
    const queryParams = { entity: entity, observationName: observationName, Id: id };
    localStorage.setItem("observationDescription", description)
    localStorage.setItem("endDateForSelectedObservation", endDate.toString())

    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };

  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: newValue==1?'change-tab-to-active-observations':'change-tab-to-expired-observations',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    // if(newValue===1)
    // {
    //   setFilteredObservationData([])

    // }
  };

  const handleSearch = (searchTerm: string) => {
    // setSearchInput(searchTerm);
    // const filteredData = observationData.filter((item: any) =>
    //   item.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // setFilteredObservationData(filteredData);
    
    setSearchInput(searchTerm);

    // Filter observation data based on the search term
    const filteredData = observationData.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredObservationData(filteredData);
    const telemetryInteract = {
      context: {
        env: 'observation',
        cdata: [],
      },
      edata: {
        id: 'search-observations',
        type: Telemetry.SEARCH,
        subtype: '',
        pageid: 'observation',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  

  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
    if(event.target.value==="all")
    {
      const role = localStorage.getItem('role');
      if (role) {
        if (role === Role.TEAM_LEADER) {
          setEntityNames(entityList.TEAM_LEADER);
        } else if (role === Role.TEACHER) {
          setEntityNames(entityList.TEACHER);
        }
      }
    }
    else{
      setEntityNames([event.target.value as string])
    }
  };


  const handleSortChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    setSortOrder(selectedValue);
    
    const sortedData = [...filteredObservationData].sort((a, b) => {
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return selectedValue === 'lowToHigh' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredObservationData(sortedData);
  };
  return (
    <div>
      <Header />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
          <Tab label="Active" />
          <Tab label="Expired" />
        </Tabs>
      </Box>
    

    <Box
    flexDirection={'row'}
    display={'flex'}
    mr="20px">
    <SearchBar
        onSearch={handleSearch}
        value={searchInput}
        placeholder={t('OBSERVATION.SEARCH_OBSERVATIONS')}
      />
       {value===0 &&(<FormControl sx={{ minWidth: 200 , backgroundColor:"#F0F0F0"}} variant="outlined" margin="normal">
        <InputLabel id="days-sort-label">{t('OBSERVATION.DAYS_LEFT')}</InputLabel>
        <Select
          labelId="days-sort-label"
           value={sortOrder}
           onChange={handleSortChange}
          label={t('OBSERVATION.DAYS_LEFT')}
          
        >
          <MenuItem value="lowToHigh">{t('COMMON.LOW_TO_HIGH')}</MenuItem>
          <MenuItem value="highToLow">{t('COMMON.HIGH_TO_LOW')}</MenuItem>
        </Select>
      </FormControl>)}
     {typeof window !== 'undefined' && window.localStorage&& localStorage.getItem('role')=== Role.TEAM_LEADER &&( <FormControl sx={{ minWidth: 200, marginLeft:"20px" ,  backgroundColor:"#F0F0F0"}} variant="outlined" margin="normal">
        <InputLabel id="filter-label">{t('COMMON.FILTER_BY')}</InputLabel>
        <Select
          labelId="filter-label"
          value={selectedOption}
          onChange={handleFilterChange}
          label="Filter By"
        >
          <MenuItem value="all">{t('COMMON.ALL')}</MenuItem> 
          <MenuItem value="center">{t('CENTERS.CENTERS')}</MenuItem>
          <MenuItem value="facilitator">{t('COMMON.FACILITATORS')}</MenuItem>
          <MenuItem value="learner">{t('COMMON.LEARNERS')}</MenuItem>
        </Select>
      </FormControl>
     )
}
    </Box>
      {entityNames && entityNames.map((name, index) => (
        <Box
          key={index}
          sx={{
            padding: 2,
            marginBottom: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h2">
            {t('OBSERVATION.OBSERVATIONS', {
              name: toPascalCase(name),
            })}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
            {filteredObservationData.filter((item: any) => item.entityType === name).length > 0 && value===0? (
              filteredObservationData
                .filter((item: any) => item.entityType === name && new Date(item.endDate) > currentDate)
                .map((item: any) => (
                  <Box key={item._id} sx={{ margin: 1 }}>
                    <ObservationCard
                      name={item.name}
                      onCardClick={() =>
                        onCardClick(item?.solutionId, item?.entityType, item?.name, item?._id, item?.description, item?.endDate)
                      }
                      description={item?.description}
                      endDate={item?.endDate}
                    />
                  </Box>
                ))
            ) :value === 1 ? (
              filteredObservationData.filter((item: any) => item.entityType === name && new Date(item.endDate) <= currentDate).length > 0 ? (
                filteredObservationData
                  .filter((item: any) => item.entityType === name && new Date(item.endDate) <= currentDate)
                  .map((item: any) => (
                    <Box key={item._id} sx={{ margin: 1 }}>
                      <ObservationCard
                        name={item.name}
                        // onCardClick={() =>
                        //   onCardClick(item?.solutionId, item?.entityType, item?.name, item?._id, item?.description)
                        // }
                        description={item?.description}
                        endDate={item?.endDate}
                      />
                    </Box>
                  ))
              ) : searchInput === "" ?(
                <Typography variant="h5" color="textSecondary">
                {t('OBSERVATION.NO_OBSERVATION_EXPIRED', {
                  entity: toPascalCase(name),
                })}
              </Typography>
              ):(
                <Typography variant="h5" color="textSecondary">
                {t('OBSERVATION.NO_RESULT_FOUND', {
                  entity: toPascalCase(name),
                })}
              </Typography>
              )
            ) : searchInput === "" && value === 0 ? (
              <Typography variant="h5" color="textSecondary">
                {t('OBSERVATION.OBSERVATION_COMING_SOON', {
                  entity: toPascalCase(name),
                })}
              </Typography>
            ) : (
              <Typography variant="h5" color="textSecondary">
              {t('OBSERVATION.NO_RESULT_FOUND', {
                entity: toPascalCase(name),
              })}
            </Typography>
            )}
           
          </Box>
        </Box>
      ))}
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ObservationForms;

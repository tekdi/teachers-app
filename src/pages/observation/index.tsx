import FilterSelect from '@/components/FilterSelect';
import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import SearchBar from '@/components/Searchbar';
import { targetSolution } from '@/services/ObservationServices';
import { Role, Telemetry } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import { telemetryFactory } from '@/utils/telemetry';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { entityList } from '../../../app.config';

const ObservationForms: React.FC = () => {
  const [entityNames, setEntityNames] = useState<String[]>();
  const [observationData, setObservationData] = useState<any>([]);
  const [filteredObservationData, setFilteredObservationData] = useState<any>([]);
  const router = useRouter();
  const theme = useTheme();

  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('all');  
  const [sortOrder, setSortOrder] = useState('');
  const currentDate = new Date();
  const menuItems = [
    { value: 'all', label: t('COMMON.ALL') },
    { value: 'center', label: t('CENTERS.CENTERS') },
    { value: 'facilitator', label: t('COMMON.FACILITATORS') },
    { value: 'learner', label: t('COMMON.LEARNERS') }
  ];
  const isSmallScreen = useMediaQuery('(max-width:938px)');

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
        id: 'search-observations-bysearchterm:'+searchTerm,
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

    const telemetryInteract = {
      context: {
        env: 'observation',
        cdata: [],
      },
      edata: {
        id: 'apply-entity-filter:'+event.target.value,
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'observation',
      },
    };
    telemetryFactory.interact(telemetryInteract);
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

    const telemetryInteract = {
      context: {
        env: 'observation',
        cdata: [],
      },
      edata: {
        id: 'apply-datewise-filter:'+selectedValue,
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'observation',
      },
    };
    telemetryFactory.interact(telemetryInteract);
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
    // flexDirection={'row'}
    // display={'flex'}
    // mr="20px"
    flexDirection={isSmallScreen ? 'column' : 'row'}
      display={'flex'}
      alignItems={isSmallScreen ? 'flex-start' : 'center'}
      mr={isSmallScreen ? 0 : '20px'}
      gap={isSmallScreen ? '10px' : '20px'}
    
    >
    <SearchBar
        onSearch={handleSearch}
        value={searchInput}
        placeholder={t('OBSERVATION.SEARCH_OBSERVATIONS')}
        fullWidth
      />
       {value===0 &&(<FormControl sx={{ minWidth: 200 ,  marginLeft:"20px",backgroundColor:"#F0F0F0"}} variant="outlined" margin="normal">
        <InputLabel id="days-sort-label">
        <Typography variant="h3" >
        {t('OBSERVATION.DAYS_LEFT')}              </Typography>
          
         </InputLabel>
        <Select
          labelId="days-sort-label"
           value={sortOrder}
           onChange={handleSortChange}
          label={t('OBSERVATION.DAYS_LEFT')}
          sx={{height:"50px"}}
          
        >
          <MenuItem value="lowToHigh">{t('COMMON.LOW_TO_HIGH')}</MenuItem>
          <MenuItem value="highToLow">{t('COMMON.HIGH_TO_LOW')}</MenuItem>
        </Select>
      </FormControl>)}
     {typeof window !== 'undefined' && window.localStorage&& localStorage.getItem('role')=== Role.TEAM_LEADER &&(
            <FilterSelect
        menuItems={menuItems}
        selectedOption={selectedOption}
        handleFilterChange={handleFilterChange}
        label={t('COMMON.FILTER_BY')}
      />)}
     

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
          <Typography variant="h2" color={"black"}>
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
                <Typography variant="h4" color="textSecondary">
                {t('OBSERVATION.NO_RESULT_FOUND', {
                  entity: toPascalCase(name),
                })}
              </Typography>
              ):(
                <Typography variant="h4" color="textSecondary">
                {t('OBSERVATION.NO_RESULT_FOUND', {
                  entity: toPascalCase(name),
                })}
              </Typography>
              )
            ) : searchInput === "" && value === 0 ? (
              <Typography variant="h4" color="textSecondary">
                {t('OBSERVATION.NO_RESULT_FOUND', {
                  entity: toPascalCase(name),
                })}
              </Typography>
            ) : (
              <Typography variant="h4" color="textSecondary">
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

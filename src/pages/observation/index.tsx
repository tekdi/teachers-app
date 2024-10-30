import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import React, { useEffect, useState } from 'react';
import { targetSolution } from '@/services/ObservationServices';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { FormContext, FormContextType, Role, Status } from '@/utils/app.constant';
import { entityList } from '../../../app.config';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/Searchbar';
import { toPascalCase } from '@/utils/Helper';

const ObservationForms: React.FC = () => {
  const [entityNames, setEntityNames] = useState<String[]>();
  const [observationData, setObservationData] = useState<any>([]);
  const [filteredObservationData, setFilteredObservationData] = useState<any>([]);
  const router = useRouter();
  const { t } = useTranslation();

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
      } catch (error) {
        console.error('Error fetching cohort list:', error);
      }
    };
    fetchObservationData();
  }, [entityNames]);

  const onCardClick = (
    observationId: string,
    entity: string,
    observationName: string,
    id: string,
    description:string
  ) => {
    const fullPath = router.asPath;
    const [basePath, queryString] = fullPath.split('?');
    const newRoute = `/${observationId}`;
    let newFullPath = `${basePath}${newRoute}`;
    const queryParams = { entity: entity, observationName: observationName, Id: id };
    localStorage.setItem("observationDescription", description)
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
  };

  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // if(newValue===1)
    // {
    //   setFilteredObservationData([])

    // }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchInput(searchTerm);
    const filteredData = observationData.filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredObservationData(filteredData);
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
      <SearchBar
        onSearch={handleSearch}
        value={searchInput}
        placeholder={t('OBSERVATION.SEARCH_OBSERVATIONS')}
      />

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
                .filter((item: any) => item.entityType === name)
                .map((item: any) => (
                  <Box key={item._id} sx={{ margin: 1 }}>
                    <ObservationCard
                      name={item.name}
                      onCardClick={() =>
                        onCardClick(item?.solutionId, item?.entityType, item?.name, item?._id, item?.description)
                      }
                      description={item?.description}
                      endDate={item?.endDate}
                    />
                  </Box>
                ))
            ) : value===0 &&(
              
              <Typography variant="h5" color="textSecondary">
                Observations are coming soon for {toPascalCase(name)}
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

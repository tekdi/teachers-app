import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import React, { useEffect, useState } from 'react';
import {
  
  targetSolution,
} from '@/services/ObservationServices';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { on } from 'events';
import { useRouter } from 'next/router';
import { FormContext, FormContextType, Role, Status } from '@/utils/app.constant';
import { entityList } from '../../../app.config';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/Searchbar';
import { toPascalCase } from '@/utils/Helper';


// const DummyResponse = [
//   {
//     _id: '670642e2df8e0200072c18d2',
//     name: 'Classroom Observation for Selection of Sectors',
//     description: 'Classroom Observation for Selection of Sectors',
//     entityType: 'center',
//     programId: '662b2ce03120ab000828bf1b',
//     solutionId: '662b2d41f69a1a00090f29f4',
//     language: ['English'],
//     creator: 'QA',
//     programName: 'AUEF-Classroom improvement Projects 3',
//   },
//   {
//     _id: '67061c97df8e0200072c1855',
//     name: 'Observation without rubric',
//     description: 'Observation for certificate download',
//     entityType: 'facilitator',
//     programId: '6703c453e234e60008e84849',
//     solutionId: '6703c458df8e0200072c1359',
//     language: ['English'],
//     creator: 'SG',
//     programName: 'SL_certificate_program',
//   },
//   {
//     _id: '670611cddf8e0200072c1834',
//     name: 'Observation without rubric',
//     description: 'Observation for certificate download',
//     entityType: 'learner',
//     programId: '6703c453e234e60008e84849',
//     solutionId: '6703c7bedf8e0200072c13b6',
//     language: ['English'],
//     creator: 'SG',
//     programName: 'SL_certificate_program',
//   },
//   {
//     _id: '6706113cdf8e0200072c181d',
//     name: 'Observation without rubric',
//     description: 'Observation for certificate download',
//     entityType: 'learner',
//     programId: '6703c453e234e60008e84849',
//     solutionId: '6703cadbdf8e0200072c14a3',
//     language: ['English'],
//     creator: 'SG',
//     programName: 'SL_certificate_program',
//   },
//   {
//     _id: '670610abdf8e0200072c17f4',
//     name: 'Observation without rubric',
//     description: 'Observation for certificate download',
//     entityType: 'facilitator',
//     programId: '6703c453e234e60008e84849',
//     solutionId: '6704ab3adf8e0200072c1656',
//     language: ['English'],
//     creator: 'SG',
//     programName: 'SL_certificate_program',
//   },
//   {
//     _id: '6704d13fdf8e0200072c1704',
//     name: 'Shiksha Test Obs Task - 11',
//     description:
//       'Selenium is an open source umbrella project for a range of tools and libraries aimed at supporting browser automation.',
//     entityType: 'center',
//     programId: '666048b77bd5aa0007f5fd26',
//     solutionId: '66604946d8b7ae0008086f23',
//     language: ['English'],
//     creator: 'Vinod',
//     programName: 'Test ML Program Shikshagraha',
//   },
// ];
const ObservationForms: React.FC = () => {
  const [entityNames, setEntityNames] = useState<String[]>();
  const [observationData, setObservationData] = useState<any>();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchEntityList = async () => {
      //  setLoading(true);
      try {
        const role = localStorage.getItem('role');
        if (role) {
          // const response = await getEntityList({ role: role });
          // setEntityNames(response);
          console.log(role, Role.TEACHER);
          if (role === Role.TEAM_LEADER) {
            const response = entityList.TEAM_LEADER;
            setEntityNames(response);
          } else if (role === Role.TEACHER) {
            const response = entityList.TEACHER;
            setEntityNames(response);
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
      } finally {
        // setLoading(false);
      }
    };
    fetchEntityList();
  }, []);

  useEffect(() => {
    const fetchObservationData = async () => {
      //  setLoading(true);
      try {
       
       
        let fieldData;
        if (typeof window !== 'undefined' && window.localStorage) {
          fieldData = JSON.parse(localStorage.getItem('fieldData') || '');
        }
        console.log("fieldData", fieldData.state)
      //   const scopeObject={
      //     "state": fieldData?.stateName,
      //     "district": fieldData?.districtName,
      //     "block": fieldData?.blockName,
      //     "mappedTo":"teamLeader",
      //     "roles": "Team Leader"
      // }
      const scopeObject={
        "state": "Maharashtra",
        "district": "Mumbai",
        "block": "Boriwali",
        "mappedTo":"teamLeader",
        "roles": "Team Leader"
    }
        const response=await targetSolution({scopeObject})
        setObservationData(response?.result?.data)

      } catch (error) {
        console.error('Error fetching cohort list:', error);
      } finally {
        // setLoading(false);
      }
    };
    fetchObservationData();
  }, [entityNames]);

  const onCardClick = (
    observationId: string,
    entity: string,
    observationName: string,
    id:string
  ) => {
    const fullPath = router.asPath;
    const [basePath, queryString] = fullPath.split('?');
    const newRoute = `/${observationId}`;
    let newFullPath = `${basePath}${newRoute}`;
    console.log('Clicked observation with ID:', observationId);
    const queryParams = { entity: entity, observationName: observationName ,Id:id};

    // router.push(newFullPath);
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
    // You can perform additional actions here
  };
  const [value, setValue] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState("");


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleSearch = () => {
  //  setValue(newValue);
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
            placeholder={t('OBSERVATION_SURVEYS.SEARCH_OBSERVATIONS')}
           // fullWidth={true}
          ></SearchBar>
      {entityNames &&
        entityNames.map((name, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              marginBottom: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="h2">
            
           {t('OBSERVATION_SURVEYS.OBSERVATIONS', {
                name:toPascalCase(name)
              })}
            </Typography>
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}
            >
               {observationData?.filter((item: any) => item.entityType === name).map(
                (item: any) => (
                  <Box key={item._id} sx={{ margin: 1 }}>
                    <ObservationCard
                      observationName={item.name}
                      onCardClick={() =>
                        onCardClick(item?.solutionId, item?.entityType, item?.name,item?._id)
                      }
                      observationDescription={item?.description}
                    />
                  </Box>
                )
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

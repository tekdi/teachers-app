import dynamic from 'next/dynamic';
// Assuming this is in the correct folder for Next.js
// import reportWebVitals from '../reportWebVitals';
import Header from '@/components/Header';
// import ObservationCard from '@/components/ObservationCard';
import { useEffect, useState } from 'react';
// import {
//   getEntityList,
//   getObservationList,
// } from '@/services/ObservationServices';
import { Box, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { on } from 'events';
import { useRouter } from 'next/router';
import { FormContext, FormContextType , Role} from '@/utils/app.constant';
// import { entityList } from '../../../app.config';
// import QuestionnaireApp from '@/components/QuestionnaireApp';
const QuestionnaireApp = dynamic(
  () => import('@/components/QuestionnaireApp'),
  {
    ssr: false,
    // loading: () => <p>Loading Questionnaire App...</p>, // Fallback to see if it's loading
  }
);
const DummyResponse = [
  {
    "_id": "670642e2df8e0200072c18d2",
    "name": "Classroom Observation for Selection of Sectors",
    "description": "Classroom Observation for Selection of Sectors",
    "entityType": "center",
    "programId": "662b2ce03120ab000828bf1b",
    "solutionId": "662b2d41f69a1a00090f29f4",
    "language": ["English"],
    "creator": "QA",
    "programName": "AUEF-Classroom improvement Projects 3"
  },
  {
    "_id": "67061c97df8e0200072c1855",
    "name": "Observation without rubric",
    "description": "Observation for certificate download",
    "entityType": "facilitator",
    "programId": "6703c453e234e60008e84849",
    "solutionId": "6703c458df8e0200072c1359",
    "language": ["English"],
    "creator": "SG",
    "programName": "SL_certificate_program"
  },
  {
    "_id": "670611cddf8e0200072c1834",
    "name": "Observation without rubric",
    "description": "Observation for certificate download",
    "entityType": "learner",
    "programId": "6703c453e234e60008e84849",
    "solutionId": "6703c7bedf8e0200072c13b6",
    "language": ["English"],
    "creator": "SG",
    "programName": "SL_certificate_program"
  },
  {
    "_id": "6706113cdf8e0200072c181d",
    "name": "Observation without rubric",
    "description": "Observation for certificate download",
    "entityType": "learner",
    "programId": "6703c453e234e60008e84849",
    "solutionId": "6703cadbdf8e0200072c14a3",
    "language": ["English"],
    "creator": "SG",
    "programName": "SL_certificate_program"
  },
  {
    "_id": "670610abdf8e0200072c17f4",
    "name": "Observation without rubric",
    "description": "Observation for certificate download",
    "entityType": "facilitator",
    "programId": "6703c453e234e60008e84849",
    "solutionId": "6704ab3adf8e0200072c1656",
    "language": ["English"],
    "creator": "SG",
    "programName": "SL_certificate_program"
  },
  {
    "_id": "6704d13fdf8e0200072c1704",
    "name": "Shiksha Test Obs Task - 11",
    "description": "Selenium is an open source umbrella project for a range of tools and libraries aimed at supporting browser automation.",
    "entityType": "center",
    "programId": "666048b77bd5aa0007f5fd26",
    "solutionId": "66604946d8b7ae0008086f23",
    "language": ["English"],
    "creator": "Vinod",
    "programName": "Test ML Program Shikshagraha"
  }
];
const ObservationForms: React.FC = () => {
  const [entityNames, setEntityNames] = useState<String[]>();
  const [observationData, setObservationData] = useState<any>();
  const router = useRouter();

//   useEffect(() => {
//     const fetchEntityList = async () => {
//       //  setLoading(true);
//       try {
//         const role = localStorage.getItem('role');
//         if (role) {
//           // const response = await getEntityList({ role: role });
//           // setEntityNames(response);
// console.log(role,Role.TEACHER)
//           if (role===Role.TEAM_LEADER) {
//             const response = entityList.TEAM_LEADER
//             setEntityNames(response);

            
//           }else if(role===Role.TEACHER){
//             const response = entityList.TEACHER
//             setEntityNames(response);

//           }
//         }
//       } catch (error) {
//         console.error('Error fetching cohort list:', error);
//       } finally {
//         // setLoading(false);
//       }
//     };
//     fetchEntityList();
//   }, []);

  // useEffect(() => {
  //   const fetchObservationData = async () => {
  //     //  setLoading(true);
  //     try {
  //       for (const name of entityNames || []) {
  //         console.log('name', name);
  //         let entityName = name; // Output each name

  //         if (entityName) {
  //           console.log('we are here', entityName);

  //           const response = await getObservationList({
  //             entityName: entityName,
  //           });
  //           //console.log("response", response);
  //           setObservationData((prevFilters: any) => ({
  //             ...prevFilters,
  //             [entityName as string]: response,
  //           }));
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching cohort list:', error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };
  //   fetchObservationData();
  // }, [entityNames]);
  // console.log('observationData', entityList);

  const onCardClick = (observationId: string, entity: string) => {
     const fullPath = router.asPath;
      const [basePath, queryString] = fullPath.split('?');
     const newRoute = `/${observationId}`;
       let newFullPath = `${basePath}${newRoute}`;
    console.log('Clicked observation with ID:', observationId);
    const queryParams = { entity: entity };

   // router.push(newFullPath);
    router.push({
      pathname: newFullPath,
      query: queryParams,
    });
    // You can perform additional actions here
  };

  return (
    <div>
      <Header />
      
   {/* {entityNames &&
  entityNames.map((name, index) => (
    <Box
      key={index}
      sx={{
        padding: 2,
        marginBottom: 2,
        borderRadius: 1,
      }}
    >
      <Typography variant="h2">{name}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
        {DummyResponse
          ?.filter(item => item.entityType === name)
          .map(item => (
            <Box key={item._id} sx={{ margin: 1 }}>
                <ObservationCard
                  observationName={item.name}
                  onCardClick={() => onCardClick(item?._id, item?.entityType)}
                />
            </Box>
          ))}
      </Box>
    </Box>
  ))} */}

  <QuestionnaireApp />
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

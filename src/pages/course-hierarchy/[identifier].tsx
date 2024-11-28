import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Link,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getContentHierarchy } from '@/services/CoursePlannerService';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';

const RecursiveAccordion = ({ data }: { data: any[] }) => {
  let router = useRouter();

  const renderAccordion = (nodes: any[], level = 0) => {
    return nodes.map((node, index) => (
      <Box key={`${node.name}-${index}`} sx={{ marginBottom: '16px' }}>
        {level === 0 ? (
          <>
            {/* Render level 0 name as heading */}
            <Typography
              variant="h1"
              sx={{
                marginBottom: '0.75rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #ddd',
                paddingBottom: '4px',
                paddingLeft: '4px'
              }}
            >
              {node.name}
            </Typography>
            {/* Render children as accordions */}
            {node.children && renderAccordion(node.children, level + 1)}
          </>
        ) : node.contentType === 'Resource' ? (
          <Box
            className="facilitator-bg"
            sx={{
              backgroundImage: `url(${node?.appIcon ? node.appIcon : '/decorationBg.png'})`,
              position: 'relative',
              marginLeft: `${(level - 1) * 2}px`, // Indentation for resources
              cursor: 'pointer',
              height: '50px',
              width: '50px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() =>
              router.push(`/play/content/${node?.identifier || node?.id}`)
            }
          ></Box>
        ) : (
          <Accordion sx={{ marginLeft: `${(level - 1) * 2}px` }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1" fontWeight={600}>
                {node?.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Recursively render children */}
              {node?.children && renderAccordion(node?.children, level + 1)}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    ));
  };

  return <Box>{renderAccordion(data)}</Box>;
};

export default function CourseHierarchy() {
  const router = useRouter();
  const [doId, setDoId] = useState<string | null>(null);
  const [courseHierarchyData, setCourseHierarchyData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (router.query.identifier) {
      setDoId(router.query.identifier as string);
    }
  }, [router.query.identifier]);

  useEffect(() => {
    const fetchCohortHierarchy = async (doId: string): Promise<any> => {
      try {
        const hierarchyResponse = await getContentHierarchy({
          doId,
        });
        setLoading(true);
        const hierarchyData = hierarchyResponse?.data?.result?.content;
        setCourseHierarchyData([hierarchyData]);

        console.log('hierarchyData:', hierarchyData);

        return hierarchyResponse;
      } catch (error) {
        console.error('Error fetching solution details:', error);
        throw error;
      } finally {
        setLoading(false); 
      }
    };

    if (typeof doId === 'string') {
      fetchCohortHierarchy(doId);
    }
  }, [doId]);

  if (loading) {
    return (
      <Loader showBackdrop={true} loadingText="Loading..." />
    );
  }

  return <RecursiveAccordion data={courseHierarchyData} />;
}

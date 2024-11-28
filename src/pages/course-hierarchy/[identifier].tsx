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
import Header from '@/components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import withAccessControl from '@/utils/hoc/withAccessControl';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { logEvent } from '@/utils/googleAnalytics';
import { useTheme } from '@mui/material/styles';
import { useDirection } from '../../hooks/useDirection';

const RecursiveAccordion = ({ data }: { data: any[] }) => {
  let router = useRouter(); 
  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'button click',
      category: 'content card',
      label: 'Back Button Clicked',
    });
  };
  const theme = useTheme<any>();
  const { dir, isRTL } = useDirection();

  const renderAccordion = (nodes: any[], level = 0) => {
    return (

      nodes.map((node, index) => (
        <Box key={`${node.name}-${index}`} sx={{ marginBottom: '16px' }}>
          {level === 0 ? (
            <>
              {/* Render level 0 name as heading */}
              <Box sx={{p:'12px', display:'flex', alignItems:'center', gap:'10px'}}>
                <KeyboardBackspaceOutlinedIcon
                  onClick={handleBackEvent}
                  cursor={'pointer'}
                  sx={{
                    color: theme.palette.warning['A200'],
                    transform: isRTL ? ' rotate(180deg)' : 'unset',
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    marginBottom: '0.75rem',
                    fontWeight: '400',
                    paddingBottom: '4px',
                    paddingLeft: '4px',
                    fontSize: '22px',
                    color: '#4D4639'
                  }}
                >
                  {node.name}
                </Typography>
              </Box>
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
                <Accordion sx={{ marginLeft: `${(level - 1) * 2}px`, boxShadow: level !== 1 ? '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)' : 'unset', }}>
              <AccordionSummary
                sx={{
                  '&.MuiAccordionSummary-root': {
                    backgroundColor: level === 1 ? '#F1E7D9' :'#fff',
                    borderBottom:'1px solid #D0C5B4'
                  },
                }}
                expandIcon={<ExpandMoreIcon />}>
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
      ))
    )
  };

  return <Box> <Box><Header /></Box> {renderAccordion(data)}</Box>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
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

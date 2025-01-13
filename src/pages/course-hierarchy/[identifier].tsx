import ContentCard from '@/components/ContentCard';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { getContentHierarchy } from '@/services/CoursePlannerService';
import { logEvent } from '@/utils/googleAnalytics';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDirection } from '../../hooks/useDirection';

const RecursiveAccordion = ({ data }: { data: any[] }) => {
  const router = useRouter(); 
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
      <Box>
        {level === 0 && (
          <>
            <Box sx={{ p: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <KeyboardBackspaceOutlinedIcon
                onClick={handleBackEvent}
                cursor={'pointer'}
                sx={{
                  color: theme.palette.warning['A200'],
                  transform: isRTL ? 'rotate(180deg)' : 'unset',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: '400',
                  paddingLeft: '4px',
                  fontSize: '22px',
                  color: '#4D4639',
                  marginBottom: '0px !important',
                }}
              >
                {nodes[0]?.name}
              </Typography>
            </Box>
          </>
        )}
        <Grid container spacing={2}>
          {nodes.map((node, index) => (
            <React.Fragment key={`${node.name}-${index}`}>
              {node.contentType === 'Resource' ? (
                <Grid item xs={6} md={4} lg={3}>
                  <ContentCard
                    name={node?.name}
                    identifier={node?.identifier || node?.id}
                    mimeType={node?.mimeType}
                    appIcon={node?.appIcon}
                    resourceType={node?.resourceType}
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Accordion
                    defaultExpanded
                    sx={{
                      marginLeft: `${(level - 1) * 0.2}px`,
                      boxShadow:
                        level !== 1
                          ? '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)'
                          : 'unset',
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        '&.MuiAccordionSummary-root': {
                          backgroundColor: level === 1 ? '#F1E7D9' : '#fff',
                          borderBottom: '1px solid #D0C5B4',
                        },
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: '#1F1B13' }} />}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ color: '#1F1B13', fontWeight: 500, fontSize: '14px' }}
                      >
                        {node?.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* Recursively render children */}
                      {node?.children && renderAccordion(node?.children, level + 1)}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    );
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

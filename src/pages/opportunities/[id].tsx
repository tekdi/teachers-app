'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { OpportunityList } from '@/types/opportunity';
import { getOpportunity } from '@/lib/api';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';

export default function OpportunityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [opportunity, setOpportunity] = useState<OpportunityList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      loadOpportunity();
    }
  }, [id]);

  async function loadOpportunity() {
    setIsLoading(true);
    try {
      const data = await getOpportunity(id as string);
      setOpportunity(data.result.data);
    } catch (error) {
      console.error('Failed to load opportunity:', error);
      router.push('/opportunities');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!opportunity) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">{t('OPPORTUNITY.NO_RESULT_FOUND')}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/opportunities')}
            sx={{ mb: 2 }}
          >
            {t('OPPORTUNITY.BACK_TO_OPPORTUNITY')}
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box
              display={{ md: 'flex' }}
              justifyContent={{ sm: 'space-between' }}
              width={'100%'}
            >
              <Typography
                variant="h1"
                color={'#4D4639'}
                component="h1"
                gutterBottom
              >
                {opportunity?.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  color: 'text.secondary',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" mb={0}>
                    {opportunity?.location.city}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" mb={0}>
                    {opportunity?.no_of_candidates} openings
                  </Typography>
                </Box>
                {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  Posted {format(new Date(opportunity.created_at), "MMM dd, yyyy")}
                </Typography>
              </Box> */}
              </Box>
            </Box>

            {/* <Chip
              label={opportunity.status}
              color={opportunity.status === 'open' ? 'success' : 'default'}
            /> */}
          </Box>
        </Box>

        <Grid
          container
          spacing={3}
          flexDirection={{ xs: 'column-reverse', md: 'row' }}
        >
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                }}
              >
                <CardHeader
                  sx={{
                    fontSize: '16px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                  title="Description"
                />
                <CardContent>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {opportunity?.description}
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                }}
              >
                <CardHeader
                  sx={{
                    fontSize: '16px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                  title="Required Skills"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {opportunity?.skillDetails.map((skill: any) => (
                      <Chip key={skill.skill_name} label={skill.skill_name} />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {opportunity?.work_experience && (
                <Card
                  sx={{
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                  }}
                >
                  <CardHeader
                    sx={{
                      fontSize: '16px',
                      borderBottom: '1px solid #D0C5B4',
                    }}
                    title="Work Experience"
                  />
                  <CardContent>
                    <Typography variant="body1">
                      {opportunity?.work_experience}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Card
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                }}
              >
                {opportunity?.status === 'approved' && (
                  <CardContent>
                    <Button
                      variant="contained"
                      sx={{
                        p: '10px',
                      }}
                      color="primary"
                      fullWidth
                      onClick={() =>
                        router.push(`/opportunities/map-youth/${id}`)
                      }
                    >
                      {t('OPPORTUNITY.MAP_YOUTH_TO_OPPORTUNITY')}
                    </Button>
                  </CardContent>
                )}
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                }}
              >
                <CardHeader
                  sx={{
                    fontSize: '16px',
                    borderBottom: '1px solid #D0C5B4',
                  }}
                  title="Opportunity Details"
                />
                <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {opportunity?.category?.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Salary Range
                    </Typography>
                    <Typography variant="body1">
                      {opportunity?.currency ? opportunity?.currency : 'KES'}{' '}
                      {opportunity?.min_salary} - ₹{opportunity?.max_salary}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Experience Level
                    </Typography>
                    <Typography variant="body1">
                      {opportunity?.experience_level}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1">
                      {opportunity?.opportunity_type}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Work Mode
                    </Typography>
                    <Typography variant="body1">
                      {opportunity.work_nature}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

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

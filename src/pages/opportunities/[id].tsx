"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
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
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PeopleIcon from "@mui/icons-material/People"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { OpportunityList } from "@/types/opportunity"
import { getOpportunity } from "@/lib/api"
import { GetStaticPaths } from 'next';

export default function OpportunityDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [opportunity, setOpportunity] = useState<OpportunityList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      loadOpportunity()
    }
  }, [id])

  async function loadOpportunity() {
    setIsLoading(true)
    try {
      const data = await getOpportunity(id as string)      
      setOpportunity(data.result.data)
    } catch (error) {
      console.error("Failed to load opportunity:", error)
      router.push("/opportunities")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!opportunity) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">{t('OPPORTUNITY.NO_RESULT_FOUND')}</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/opportunities")} sx={{ mb: 2 }}>
          {t('OPPORTUNITY.BACK_TO_OPPORTUNITY')}
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {opportunity.title}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, color: "text.secondary" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {opportunity.location.city} ({opportunity.is_remote ? "Remote" : "On-site"})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{opportunity.no_of_candidates} openings</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                {/* <Typography variant="body2">
                  Posted {format(new Date(opportunity.created_at), "MMM dd, yyyy")}
                </Typography> */}
              </Box>
            </Box>
          </Box>

          <Chip
            label={opportunity.status}
            color={opportunity.status === "open" ? "success" : "default"}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card>
              <CardHeader title="Description" />
              <CardContent>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {opportunity.description}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Required Skills" />
              <CardContent>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {opportunity.skillDetails.map((skill:any) => (
                    <Chip key={skill.skill_name} label={skill.skill_name} />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {opportunity.work_experience && (
              <Card>
                <CardHeader title="Work Experience" />
                <CardContent>
                  <Typography variant="body1">{opportunity.work_experience}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Card>
              <CardHeader title="Opportunity Details" />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{opportunity.category.name}</Typography>
                </Box>
                <Divider />
                <Box sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Salary Range
                  </Typography>
                  <Typography variant="body1">
                    KES {opportunity.min_salary} - ₹{opportunity.max_salary}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience Level
                  </Typography>
                  <Typography variant="body1">{opportunity.experience_level}</Typography>
                </Box>
                <Divider />
                <Box sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{opportunity.opportunity_type}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => router.push(`/opportunities/${id}/apply`)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
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
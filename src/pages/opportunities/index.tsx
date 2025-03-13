'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Header from '@/components/Header';
import { OpportunityForm } from '@/components/opportunity-form';
import { OpportunitiesList } from '@/components/opportunities-table';
import { SearchInput } from '@/components/search-input';
import { OpportunityFilters } from '@/components/opportunity-filters';
import { CustomPagination } from '@/components/pagination';
import type {
  Opportunity,
  OpportunityFormData,
  OpportunityList,
} from '@/types/opportunity';
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getMappedByMe,
} from '@/lib/api';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function OpportunitiesPage() {
  const router = useRouter();
  const {
    page = '1',
    search = '',
    industry,
    skills,
    category,
    status = 'approved',
    location,
  } = router.query;
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [selectedTab, setSelectedTab] = useState('all'); // "all" or "createdByMe"
  const [opportunities, setOpportunities] = useState<{
    items: OpportunityList[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>({
    items: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  useEffect(() => {
    loadOpportunities();
  }, [router.query, selectedTab]);

  async function loadOpportunities() {
    setIsLoading(true);
    try {
      let created_by = undefined;
      let finalStatus = 'approved';
      if (selectedTab !== 'mappedByMe') {
        if (selectedTab === 'createdByMe') {
          created_by = localStorage.getItem('userId') || undefined;
          finalStatus = status as string;
        }

        const result = await getOpportunities(search as string, Number(page), {
          category: category as string,
          skills: skills as string,
          status: finalStatus,
          location: location as string,
          created_by, // Pass userId if "Created by Me" tab is selected
        });

        setOpportunities(result);
      } else {
        created_by = localStorage.getItem('userId') || undefined;
        const response = await getMappedByMe(created_by);
        setOpportunities(response);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(data: OpportunityFormData) {
    await createOpportunity(data);
    setIsDialogOpen(false);
    loadOpportunities();
  }

  async function handleUpdate(data: OpportunityFormData) {
    if (!selectedOpportunity) return;
    await updateOpportunity(selectedOpportunity.id, data);
    setIsDialogOpen(false);
    setSelectedOpportunity(null);
    loadOpportunities();
  }

  async function handleDelete(opportunity: Opportunity) {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      await deleteOpportunity(opportunity.id);
      loadOpportunities();
    }
  }

  function handleSearch(term: string) {
    const query = { ...router.query, search: term, page: '1' } as {
      search?: string;
      page: string;
    };
    if (!term) delete query.search;
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function handleFilterChange(name: string, value: string) {
    const query = { ...router.query, [name]: value, page: '1' };
    if (value === 'all') delete query?.[name];
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function handleClearFilters() {
    const query = { page: '1' }; // Reset to default query with page 1
    router.push({
      pathname: router.pathname,
      query,
    });
  }

  function handlePageChange(newPage: number) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage.toString() },
    });
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h1" component="h1" mb={0}>
              {t('OPPORTUNITY.OPPORTUNITIES')}
            </Typography>
          </Box> */}

          <Box
            sx={{
              display: { xs: 'block', sm: 'flex' },
              // flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on md+
              gap: 2,
              mb: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <SearchInput
                placeholder={t('OPPORTUNITY.SEARCH_OPPORTUNITIES')}
                defaultValue={search as string}
                onSearch={handleSearch}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  sx={{ whiteSpace: 'nowrap' }}
                  label={showFilters ? 'Hide Filters' : 'Show Filters'}
                  control={
                    <Switch
                      checked={showFilters}
                      onChange={() => setShowFilters((prev) => !prev)}
                      color="primary"
                    />
                  }
                />
              </Box>
            </Box>

            <Box mb={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: '500', py: '10px', whiteSpace: 'nowrap' }}
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedOpportunity(null);
                  setIsDialogOpen(true);
                }}
              >
                {t('OPPORTUNITY.CREATE_NEW_OPPORTUNITY')}
              </Button>
            </Box>
          </Box>

          {showFilters && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <OpportunityFilters
                selectedCategory={category as string}
                selectedSkills={skills as string}
                selectedStatus={status as string}
                onFilterChange={handleFilterChange}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
              >
                {t('OPPORTUNITY.CLEAR_FILTERS')}
              </Button>
            </Box>
          )}
        </Box>

        {/* Tabs for All Opportunities and Created by Me */}
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label={t('OPPORTUNITY.ALL_OPPORTUNITIES')} value="all" />
          <Tab label={t('OPPORTUNITY.CREATED_BY_ME')} value="createdByMe" />
          <Tab label={t('OPPORTUNITY.MAPPED_BY_ME')} value="mappedByMe" />
        </Tabs>

        <Paper
          elevation={2}
          sx={{ mb: 3, overflow: 'hidden', boxShadow: 'none', padding: '10px' }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <OpportunitiesList
              data={opportunities.items}
              onEdit={(opportunity: any) => {
                setSelectedOpportunity(opportunity);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
              onView={(opportunity: any) =>
                router.push(`/opportunities/${opportunity.id}`)
              }
            />
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <CustomPagination
            totalPages={Math.ceil(opportunities.total / 9)}
            currentPage={opportunities.currentPage}
            onPageChange={handlePageChange}
          />
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={(event, reason) => {
            if (reason === 'backdropClick') {
              return;
            }
            setIsDialogOpen(false);
          }}
          fullWidth
          PaperProps={{
            sx: { maxWidth: '650px' },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #D0C5B4',
            }}
          >
            <Typography
              variant="h2"
              color={'#4D4639'}
              fontWeight={'500'}
              component="h2"
              mb={0}
            >
              {selectedOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
            </Typography>

            <CloseIcon
              onClick={() => setIsDialogOpen(false)}
              sx={{
                ml: 2,
                fontSize: '24px',
                color: '#4D4639',
                cursor: 'pointer',
              }}
            />
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <OpportunityForm
              initialData={selectedOpportunity || undefined}
              onSubmit={selectedOpportunity ? handleUpdate : handleCreate}
            />
          </DialogContent>
        </Dialog>
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

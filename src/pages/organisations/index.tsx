import { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TableContainer,
  Paper,
  Stack,
  Box,
  InputAdornment,
  Container,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  getOrganizations,
  createOrganisation,
  updateOrganisation,
} from '@/lib/api';
import Header from '@/components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Organisations() {
  const [organisations, setOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState({
    id: '',
    name: '',
    description: '',
    website: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrganisations();
  }, [search]);

  const fetchOrganisations = async () => {
    try {
      const name = search;
      const params = { name };
      const response = await getOrganizations(params);
      setOrganisations(response.result.data || []);
    } catch (error) {
      console.error('Error fetching organisations', error);
    }
  };

  const handleOpen = (
    org = { name: '', description: '', website: '', id: '' }
  ) => {
    setCurrentOrg(org);
    setEditMode(!!org.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentOrg({ name: '', description: '', website: '', id: '' });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await updateOrganisation(currentOrg, currentOrg.id);
      } else {
        await createOrganisation(
          currentOrg.name,
          currentOrg.description,
          currentOrg.website
        );
      }
      fetchOrganisations();
      handleClose();
    } catch (error) {
      console.error('Error saving organisation', error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          {/* <h1>Organisations</h1> */}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on md+
              gap: 2,
              mb: 4,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              placeholder="Search..."
              variant="standard"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: '25px',
                maxWidth: '300px',
                paddingX: 2,
                paddingY: 0.5,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />

            {/* Create Organisation Button */}
            <Box sx={{ width: { xs: '100%', sm: 'fit-content' } }} width={{}}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: '500', py: '10px', whiteSpace: 'nowrap' }}
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
              >
                Create Organisation
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#fdbe16' }}>
                <TableRow>
                  <TableCell sx={{ minWidth: 120 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Description</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Website</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organisations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell>{org.name}</TableCell>
                    <TableCell>{org.description}</TableCell>
                    <TableCell>
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {org.website}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                      >
                        <Button onClick={() => handleOpen(org)} size="small">
                          Edit
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog for Add/Edit Organisation */}
          <Dialog
            open={open}
            onClose={(e, reason) => {
              if (reason === 'backdropClick') {
                return;
              }
            }}
            fullWidth
            maxWidth="sm"
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
                {editMode ? 'Edit Organisation' : 'Add Organisation'}
              </Typography>

              <CloseIcon
                onClick={handleClose}
                sx={{
                  ml: 2,
                  fontSize: '24px',
                  color: '#4D4639',
                  cursor: 'pointer',
                }}
              />
            </DialogTitle>
            <DialogContent
              sx={{
                p: '6px 16px 18px !important',
                justifyContent: 'start',
                color: '#313131',
                fontWeight: '500',
              }}
            >
              <TextField
                label="Name"
                fullWidth
                value={currentOrg.name}
                onChange={(e) =>
                  setCurrentOrg({ ...currentOrg, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                label="Description"
                fullWidth
                value={currentOrg.description}
                onChange={(e) =>
                  setCurrentOrg({ ...currentOrg, description: e.target.value })
                }
                margin="normal"
              />
              <TextField
                label="Website"
                fullWidth
                value={currentOrg.website}
                onChange={(e) =>
                  setCurrentOrg({ ...currentOrg, website: e.target.value })
                }
                margin="normal"
              />
            </DialogContent>
            <DialogActions
              sx={{
                textAlign: 'center',
                p: '16px !important',
                borderTop: '1px solid #D0C5B4',
              }}
            >
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{ py: '10px', width: '100%', fontWeight: '500' }}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

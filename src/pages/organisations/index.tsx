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
import Image from 'next/image';
import editIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  getOrganizations,
  createOrganisation,
  updateOrganisation,
} from '@/lib/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '@/components/Header';
import { Edit } from '@mui/icons-material';

export default function Organisations() {
  const theme = useTheme<any>();
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
  const [websiteError, setWebsiteError] = useState('');

  const validateWebsite = (url: string) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/[\w-]*)*\/?$/;
    return urlRegex.test(url);
  };

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
    if (currentOrg.website.trim() && !validateWebsite(currentOrg.website)) {
      setWebsiteError('Please enter a valid URL.');
      return;
    }
    setWebsiteError('');
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
        <Box
          boxShadow={'0px 2px 6px 2px #00000026'}
          bgcolor={'white'}
          pt={2}
          borderRadius={2}
        >
          {/* <h1>Organisations</h1> */}

          <Box
            p={2}
            // borderBottom={'1px solid #0000001f'}
            // pb={0}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on md+
              gap: 2,
              // mb: 0,
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
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  color: '#000', // Changed text color to black
                  minWidth: '200px',
                  p: '8px 16px',
                  border: '1px solid #1E1B16',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                }}
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
              >
                Create Organisation
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 0 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8EFE7' }}>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: 120,
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#635E57',
                      border: 'none',
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 200,
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#635E57',
                      border: 'none',
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 200,
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#635E57',
                      border: 'none',
                    }}
                  >
                    Website
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 150,
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#635E57',
                      border: 'none',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organisations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell sx={{ color: '#353C44' }}>{org.name}</TableCell>
                    <TableCell sx={{ color: '#353C44' }}>
                      {org.description}
                    </TableCell>
                    <TableCell sx={{ color: '#353C44' }}>
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {org.website}
                      </a>
                    </TableCell>
                    <TableCell sx={{ color: '#353C44' }}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                      >
                        <Button
                          startIcon={<Edit />}
                          onClick={() => handleOpen(org)}
                        >
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
                required
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
                error={!!websiteError}
                helperText={websiteError}
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
                disabled={!currentOrg.name.trim()}
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

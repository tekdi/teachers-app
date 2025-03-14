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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
      <div style={{ padding: '16px' }}>
        <h1>Organisations</h1>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ffcc00',
              color: '#000',
              borderRadius: '25px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e6b800' },
            }}
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Create Organisation
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 2 }}>
          <Table>
            <TableHead>
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
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {editMode ? 'Edit Organisation' : 'Add Organisation'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              value={currentOrg.name}
              onChange={(e) =>
                setCurrentOrg({ ...currentOrg, name: e.target.value })
              }
              margin="dense"
            />
            <TextField
              label="Description"
              fullWidth
              value={currentOrg.description}
              onChange={(e) =>
                setCurrentOrg({ ...currentOrg, description: e.target.value })
              }
              margin="dense"
            />
            <TextField
              label="Website"
              fullWidth
              value={currentOrg.website}
              onChange={(e) =>
                setCurrentOrg({ ...currentOrg, website: e.target.value })
              }
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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

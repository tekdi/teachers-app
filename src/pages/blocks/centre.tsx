import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import Header from '../../components/Header';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Search from '@mui/icons-material/Search';
import {
  Apartment,
  ArrowDropDown,
  KeyboardArrowRight,
  SmartDisplayOutlined,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import FilterModalCenter from './components/FilterModalCenter';

interface BlocksProps {
  // Define any props if needed
}

interface Center {
  name: string;
  type: CenterType;
}

type CenterType = '' | 'regular' | 'remote';

const Blocks: React.FC<BlocksProps> = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [districts, setDistrict] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [blocks, setBlocks] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false); // State for filter modal
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [centers, setCenters] = useState<Center[]>([
    { name: 'Bhivapur', type: 'regular' },
    { name: 'Kamptee', type: 'regular' },
    { name: 'Katol', type: 'regular' },
    { name: 'Kuhi', type: 'remote' },
    { name: 'Mauda', type: 'remote' },
    { name: 'Savner', type: 'remote' },
    { name: 'ABC', type: 'regular' },
    { name: 'DEF', type: 'remote' },
    { name: 'XYZ', type: 'regular' },
  ]); // Initial centers
  const [filteredCenters, setFilteredCenters] = useState<Center[]>(centers); // State for filtered centers
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]); // State for selected centers
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order
  const [centerType, setCenterType] = useState<CenterType>(''); // State for center type

  const handleFilterModalOpen = () => setFilterModalOpen(true); // Function to open filter modal
  const handleFilterModalClose = () => setFilterModalOpen(false); // Function to close filter modal

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    filterCenters(event.target.value);
  };

  const filterCenters = (searchTerm: string) => {
    setFilteredCenters(
      centers?.filter((center) =>
        center?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    );
  };

  const applyFilters = () => {
    // Apply sorting and filtering based on selected options
    let updatedCenters = centers;

    // Apply sorting
    if (sortOrder === 'asc') {
      updatedCenters = updatedCenters?.sort((a, b) => a?.name?.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      updatedCenters = updatedCenters?.sort((a, b) => b?.name?.localeCompare(a.name));
    }

    // Apply center type filter
    if (centerType === 'regular') {
      updatedCenters = updatedCenters?.filter((center) =>
        center?.type === 'regular'
      );
    } else if (centerType === 'remote') {
      updatedCenters = updatedCenters?.filter((center) =>
        center?.type === 'remote'
      );
    }

    // Apply selected centers filter
    if (selectedCenters?.length > 0) {
      updatedCenters = updatedCenters?.filter((center) =>
        selectedCenters?.includes(center?.name)
      );
    }

    setFilteredCenters(updatedCenters);
  };

  useEffect(() => {
    const storedDistrict = localStorage.getItem('selectedBlockDistrict') || '';
    setDistrict(storedDistrict);

    const storedBlock = localStorage.getItem('selectedBlock') || '';
    setBlocks(storedBlock);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sortOrder, centerType, selectedCenters]);

  return (
    <Box minHeight="100vh">
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          width={'100%'}
          sx={{ backgroundColor: 'white', padding: '1.2rem' }}
        >
          <Typography
            textAlign={'left'}
            fontSize={'22px'}
            color={theme?.palette?.text?.primary}
          >
            {blocks}
          </Typography>
          <Typography
            textAlign={'left'}
            fontSize={'11px'}
            mb={'1rem'}
            fontWeight={'500'}
            color={theme?.palette?.text?.primary}
          >
            {districts}, {state}
          </Typography>
          <Box display={'flex'} alignItems={'center'} mb={2}>
            <TextField
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t('COMMON.SEARCH')}
              variant="outlined"
              size="medium"
              sx={{
                p: 2,
                justifyContent: 'center',
                height: '48px',
                flexGrow: 1,
                mr: 1,
                backgroundColor: theme?.palette?.warning?.A700,
                borderRadius: '40px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={handleFilterModalOpen}
              size="medium"
              endIcon={<ArrowDropDown />}
              sx={{
                borderRadius: '7px',
                border: `1px solid ${theme?.palette?.warning?.A700}`,
                pl: 3,
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              {t('COMMON.FILTERS')}
            </Button>
          </Box>
          <Button
            variant="outlined"
            size="medium"
            endIcon={<AddIcon />}
            sx={{ textTransform: 'none', mb: 2 }}
            // onClick={handleOpenModal}
          >
            {t('BLOCKS.CREATE_NEW')}
          </Button>
          <Typography variant="h5" color={theme?.palette?.text?.primary}>
            {t('CENTERS.REGULAR_CENTERS')}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FBF4E4',
              borderRadius: '8px',
              p: 2,
            }}
          >
            {filteredCenters
              ?.filter((center) => center?.type === 'regular')
              .map((center) => (
                <Button
                  key={center?.name}
                  fullWidth
                  sx={{
                    p: 0,
                    mt: 1,
                    justifyContent: 'space-between',
                    mb: '0.5rem',
                    backgroundColor: theme?.palette?.warning?.A400,
                    color: theme?.palette?.text?.primary,
                    textTransform: 'none',
                    borderRadius: '5px',
                    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)',

                    '&:hover': {
                      backgroundColor: theme?.palette?.warning?.A700,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: theme?.palette?.primary?.light,

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50px',
                        height: '50px',
                        mr: 1,
                      }}
                    >
                      <Apartment fontSize="small" /> {/* Left icon */}
                    </Box>
                    {center.name}
                  </Box>
                  <KeyboardArrowRight /> {/* Right icon */}
                </Button>
              ))}
          </Box>
          <Typography variant="h5" color={theme?.palette?.text?.primary} mt={2}>
            {t('CENTERS.REMOTE_CENTERS')}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FBF4E4',
              borderRadius: '8px',
              p: 2,
            }}
          >
            {filteredCenters
              ?.filter((center) => center?.type === 'remote')
              .map((center) => (
                <Button
                  key={center.name}
                  fullWidth
                  sx={{
                    p: 0,
                    mt: 1,
                    justifyContent: 'space-between',
                    mb: '0.5rem',
                    backgroundColor: theme?.palette?.warning?.A400,
                    color: theme?.palette?.text?.primary,
                    textTransform: 'none',
                    borderRadius: '5px',
                    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)',

                    '&:hover': {
                      backgroundColor: theme?.palette?.warning?.A700,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: theme?.palette?.primary?.light,

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50px',
                        height: '50px',
                        mr: 1,
                      }}
                    >
                      <Apartment fontSize="small" /> {/* Left icon */}
                    </Box>
                    {center.name}
                  </Box>
                  <KeyboardArrowRight /> {/* Right icon */}
                </Button>
              ))}
          </Box>
        </Box>
      </Box>
      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={centers?.map((center) => center?.name)} // Pass only the names of the centers
        selectedCenters={selectedCenters}
        setSelectedCenters={setSelectedCenters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        centerType={centerType}
        setCenterType={setCenterType as (type: string) => void} // Casting to match the expected type
        onApply={applyFilters}
      />
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Other props you want to pass to your component
    },
  };
}


export default Blocks;

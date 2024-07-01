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
import { ArrowDropDown, KeyboardArrowRight } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import CreateBlockModal from '@/components/blocks/CreateBlockModal';
import FilterModal from '@/components/blocks/FilterBlockModal';
interface BlocksProps {
  // Define any props if needed
}

const Blocks: React.FC<BlocksProps> = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const  district = 'Nagpur';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false); // State for modal
  const [filterModalOpen, setFilterModalOpen] = useState(false); // State for filter modal
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [blocks, setBlocks] = useState([
    'Bhivapur',
    'Kamptee',
    'Katol',
    'Kuhi',
    'Mauda',
    'Savner',
    'ABC',
    'DEF',
    'XYZ',
  ]); // Initial blocks
  const [filteredBlocks, setFilteredBlocks] = useState(blocks); // State for filtered blocks
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]); // State for selected blocks
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    const filtered = blocks?.filter((block) =>
      block.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlocks(filtered);
  };

  const handleApplyFilters = () => {
    let sortedBlocks = [...blocks];
    if (sortOrder === 'asc') {
      sortedBlocks.sort();
    } else {
      sortedBlocks.sort().reverse();
    }
    const filtered = sortedBlocks.filter((block) =>
      selectedBlocks.length > 0 ? selectedBlocks.includes(block) : true
    );
    setFilteredBlocks(filtered);
  };

  const handleSelectedBlock = (block: string) => {
    localStorage.setItem('selectedBlock', block);
  };

  useEffect(() => {
    if (typeof district === 'string') {
      localStorage.setItem('selectedBlockDistrict', district);
    }
  }, [district]);

  useEffect(() => {
    handleApplyFilters();
  }, [blocks, selectedBlocks, sortOrder]);

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
            {t('BLOCKS.TEACHING_BLOCKS')}
          </Typography>
          <Typography
            textAlign={'left'}
            fontSize={'11px'}
            mb={'1rem'}
            fontWeight={'500'}
            color={theme?.palette?.text?.primary}
          >
            {district}, Maharashtra
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
                backgroundColor: '#EDEDED',
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
                backgroundColor: 'white',
                borderRadius: '7px',
                border: '1px solid #EDEDED',
                color: '#4A4A4A',
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
            sx={{ textTransform: 'none', mt: 1, mb: 1 }}
            onClick={handleOpenModal}
          >
            {t('BLOCKS.CREATE_NEW')}
          </Button>

          <CreateBlockModal open={openModal} handleClose={handleCloseModal} />

          <FilterModal
            open={filterModalOpen}
            handleClose={handleFilterModalClose}
  
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onApply={handleApplyFilters}
          />

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
            {filteredBlocks.map((block) => (
              <Button
                key={block}
                onClick={() => handleSelectedBlock(block)}
                fullWidth
                sx={{
                  mt: 1,
                  justifyContent: 'space-between',
                  mb: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  color: theme?.palette?.text?.primary,
                  textTransform: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)',
                  padding: '0.75rem 1rem',
                  '&:hover': {
                    backgroundColor: '#F0F0F0',
                  },
                }}
                endIcon={<KeyboardArrowRight />}
              >
                {block}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
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

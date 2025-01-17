import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, FormControl, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import FilterModalCenter from '@/pages/blocks/components/FilterModalCenter';

const SortBy = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);
  const [appliedFilters, setAppliedFilters] = useState({
    centerType: '',
    sortOrder: '',
  });
  const [centerType, setCenterType] = useState<'regular' | 'remote' | ''>('');
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);

  const [sortOrder, setSortOrder] = useState('');

  const handleFilterApply = () => {
    setAppliedFilters({ centerType, sortOrder });
    // setFilteredCenters(getFilteredCenters);
    handleFilterModalClose();
  };
  return (
    <>
      <Grid item xs={6} mt={'1rem'}>
        <Box
          sx={{
            '@media (min-width: 900px)': {
              display: 'flex',
              justifyContent: 'end',
            },
          }}
        >
          <FormControl
            className="drawer-select"
            sx={{
              width: '100%',
              '@media (min-width: 900px)': {
                // width: '40%',
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleFilterModalOpen();
              }}
              size="medium"
              endIcon={<ArrowDropDown />}
              sx={{
                borderRadius: '7px',
                border: `1px solid ${theme?.palette?.warning?.A700}`,
                color: theme?.palette?.warning['300'],
                pl: 3,
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis'
              }}
              className="one-line-text"
            >
              {t('COMMON.SORT_BY')}
            </Button>
          </FormControl>
        </Box>
      </Grid>

      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={[]}
        selectedCenters={[]}
        setSelectedCenters={setSelectedCenters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        centerType={''}
        setCenterType={setCenterType}
        onApply={handleFilterApply}
      />
    </>
  );
};

export default SortBy;

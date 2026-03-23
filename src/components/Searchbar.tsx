import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { debounce } from '@/utils/Helper';
import { showToastMessage } from './Toastify';

export interface SearchBarProps {
  onSearch: (value: string) => void;
  value?: string;
  onClear?: () => void;
  placeholder: string;
  fullWidth?: boolean;
  showClearSearch?: boolean;
  resultsLength?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  value = '',
  onClear,
  placeholder = 'Search...',
  fullWidth = false,
  showClearSearch = false,
  resultsLength,
}) => {
  const theme = useTheme<any>();
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (resultsLength === 0 && searchTerm.trim()) {
      showToastMessage('No Data Found', 'info');
      setSearchTerm('');
      onSearch('');
      onClear?.();
    }
  }, [resultsLength, searchTerm, onSearch, onClear]);

  const handleSearchClear = () => {
    setSearchTerm('');
    handleSearch('');
    onSearch('');
    onClear?.();
  };

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      onSearch(searchTerm);
    }, 300), // Debounce for 300 milliseconds
    [onSearch]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch(searchTerm);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} md={fullWidth ?  12 : 6}>
        <Box sx={{ mt: 2, px: theme.spacing(2.5) }}>
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50px',
              background: theme.palette.warning.A700,
              boxShadow: 'none',
            }}
          >
            <InputBase
              value={searchTerm}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              sx={{ ml: theme.spacing(3), flex: 1, fontSize: '14px' }}
              placeholder={placeholder}
              inputProps={{ 'aria-label': placeholder }}
            />
            <IconButton
              type="button"
              onClick={searchTerm ? handleSearchClear : undefined}
              sx={{ p: theme.spacing(1.25) }}
              aria-label={searchTerm ? 'Clear' : 'Search'}
            >
              {searchTerm ? <ClearIcon /> : <SearchIcon />}
            </IconButton>
          </Paper>
          {showClearSearch && searchTerm && (
            <Box sx={{ mt: 1, textAlign: 'right' }}>
              <Button
                size="small"
                onClick={handleSearchClear}
                sx={{ textTransform: 'none' }}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SearchBar;

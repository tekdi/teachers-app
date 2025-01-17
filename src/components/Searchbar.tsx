import React, { useCallback, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  InputBase,
  Paper,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { debounce } from '@/utils/Helper';
import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';

export interface SearchBarProps {
  onSearch: (value: string) => void;
  value?: string;
  onClear?: () => void;
  placeholder: string;
  fullWidth?: boolean;
  backgroundColor?:any
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  value = '',
  placeholder = 'Search...',
  fullWidth = false,
  backgroundColor="#EDEDED"
}) => {
  const theme = useTheme<any>();
  const [searchTerm, setSearchTerm] = useState(value);

  const handleSearchClear = () => {
    onSearch('');
    setSearchTerm('');
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

    if(searchTerm.length>=3|| searchTerm==="")
    {

      handleSearch(searchTerm);


      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split("/")[0];
      const telemetryInteract = {
        context: {
          env: env,
          cdata: [],
        },
        edata: {
          id: 'search-value:'+searchTerm,
          type: Telemetry.SEARCH,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
      telemetryFactory.interact(telemetryInteract);
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
              background: backgroundColor,
              boxShadow: 'none',
            }}
          >
            <InputBase
              value={searchTerm}
              onChange={handleChange}
              sx={{ ml: theme.spacing(3), flex: 1, fontSize: '14px' }}
              placeholder={placeholder}
              inputProps={{ 'aria-label': placeholder }}
            />
            <IconButton
              type="button"
              onClick={searchTerm ? handleSearchClear : undefined}
              sx={{ p: theme.spacing(1.25) }}
              aria-label={searchTerm ? 'Clear' : 'Search'}
              className='one-line-text'
            >
              {searchTerm ? <ClearIcon /> : <SearchIcon />}
            </IconButton>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SearchBar;

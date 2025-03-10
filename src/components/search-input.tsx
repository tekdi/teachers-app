'use client';

import type React from 'react';

import { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebouncedCallback } from 'use-debounce';

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (term: string) => void;
}

export function SearchInput({
  placeholder = 'Search...',
  defaultValue = '',
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <TextField
      placeholder={placeholder}
      sx={{
        bgcolor: '#EDEDED',
        border: 'none',
        borderRadius: '28px',
        '& fieldset': { border: 'none' },
        p: '14px 16px',
        '& input': { p: 0, pr : '10px' },
        '.MuiOutlinedInput-root': { padding: '0px' },

      }}
      value={value}
      onChange={handleChange}
      variant="outlined"
      fullWidth
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

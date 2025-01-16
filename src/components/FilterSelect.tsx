import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface FilterSelectProps {
  menuItems: { value: string; label: string }[];
  selectedOption: string;
  handleFilterChange: (event: SelectChangeEvent) => void;
  label: string;
  sx?: object;
  px?:string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  menuItems,
  selectedOption,
  handleFilterChange,
  label,
  px,
  sx = {}
}) => {
  return (
    <FormControl sx={{
      width: { xs: '100%', sm: '100%',  },
     
    }}  variant="outlined" margin="normal">
      <InputLabel sx={{mx:px}} id="filter-label">{label}</InputLabel>
      <Select
        labelId="filter-label"
        value={selectedOption}
        onChange={handleFilterChange}
        label={label}
        sx={{height:"50px", mx:px}}

      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;

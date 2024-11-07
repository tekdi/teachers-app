import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface FilterSelectProps {
  menuItems: { value: string; label: string }[];
  selectedOption: string;
  handleFilterChange: (event: SelectChangeEvent) => void;
  label: string;
  sx?: object;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  menuItems,
  selectedOption,
  handleFilterChange,
  label,
  sx = {}
}) => {
  return (
    <FormControl sx={{ minWidth: 200, marginLeft: "20px", backgroundColor: "#F0F0F0", ...sx }} variant="outlined" margin="normal">
      <InputLabel id="filter-label">{label}</InputLabel>
      <Select
        labelId="filter-label"
        value={selectedOption}
        onChange={handleFilterChange}
        label={label}
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

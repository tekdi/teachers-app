import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DropdownProps {
  name: string;
  values: string[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ name, values, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{name}</InputLabel>
      <Select
        value={selectedValue}
        label={name}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownIcon}
      >
        {values.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;

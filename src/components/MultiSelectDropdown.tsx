import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { WidgetProps } from '@rjsf/utils';

const MultiSelectDropdown: React.FC<WidgetProps> = ({
  options,
  value = [],
  required,
  disabled,
  readonly,
  onChange,
  schema,
}) => {
  const isEnumArray = (items: any): items is { enum: any[] } => {
    return items && Array.isArray(items.enum);
  };

  const selectOptions = isEnumArray(schema?.items)
    ? schema.items.enum.map((val, index) => ({
        value: val,
        label: schema.enumNames ? schema.enumNames[index] : val,
      }))
    : [];

  const handleChange = (_event: any, newValue: any[]) => {
    onChange(newValue.map((option) => option.value));
  };

  return (
    <Autocomplete
      multiple
      options={selectOptions}
      getOptionLabel={(option) => option.label}
      value={selectOptions.filter((opt) => value.includes(opt.value))}
      onChange={handleChange}
      disableCloseOnSelect
      disabled={disabled || readonly}
      renderInput={(params) => (
        <TextField
          {...params}
          label={schema?.title}
          variant="outlined"
          required={required}
        />
      )}
    />
  );
};

export default MultiSelectDropdown;

import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { WidgetProps } from '@rjsf/utils';
import React from 'react';

const MultiSelectDropdown: React.FC<WidgetProps> = ({
  options,
  value,
  required,
  disabled,
  readonly,
  onChange,
  schema,
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  const isEnumArray = (items: any): items is { enum: any[] } => {
    return items && Array.isArray(items.enum);
  };

  const selectOptions = isEnumArray(schema?.items)
    ? schema.items.enum.map((val, index) => ({
        value: val,
        label: schema.enumNames ? schema.enumNames[index] : val,
      }))
    : [];

  return (
    <TextField
      select
      label={schema?.title}
      value={value || []}
      onChange={handleChange}
      variant="outlined"
      SelectProps={{
        multiple: true,
        renderValue: (selected) =>
          (selected as string[])
            .map(
              (val) =>
                selectOptions?.find((opt: any) => opt.value === val)?.label
            )
            .join(', '),
      }}
      InputLabelProps={{ required: required }}
      fullWidth
      disabled={disabled || readonly}
    >
      {selectOptions?.map((option: any) => (
        <MenuItem key={option.value} value={option.value}>
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </TextField>
  );
};

export default MultiSelectDropdown;

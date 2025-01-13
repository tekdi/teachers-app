import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { WidgetProps } from '@rjsf/utils';

const CustomRadioWidget: React.FC<WidgetProps> = ({
  id,
  value,
  required,
  disabled,
  readonly,
  label,
  options,
  onChange,
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup id={id} value={value} onChange={handleChange} row>
        {options?.enumOptions?.map((option: any) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={disabled || readonly}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default CustomRadioWidget;

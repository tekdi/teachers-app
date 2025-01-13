import { TextField } from '@mui/material';
import { useState } from 'react';

const NumberInputField = (props: any) => {
  const { onChange, ...rest } = props;
  const [error, setError] = useState('');

  const handleChange = (event: any) => {
    const value = event.target.value;

    const regex = props?.schema?.maxLength
      ? new RegExp(`^\\d{0,${props.schema.maxLength}}$`)
      : /^\d*$/;

    if (regex.test(value)) {
      // Allow only up to 10 digits
      if (props?.schema?.maxLength) {
        if (value.length === props.schema.maxLength) {
          setError(''); // Clear any existing error
          onChange(Number(value));
        } else {
          setError(`Must be exactly ${props.schema.maxLength} digits`);
          onChange(undefined); // Clear the form data
        }
      }
    }
  };

  return (
    // <input
    //   {...rest}
    //   type="text" // Use type="text" to handle custom input validation
    //   onChange={handleChange}
    // />
    <>
      <TextField
        {...rest}
        id={props.schema.name}
        label={props.schema.title}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
      />
      <p color={'red'}>{error}</p>
    </>
  );
};

export default NumberInputField;

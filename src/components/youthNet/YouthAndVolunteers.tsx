import React, { useState } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  Typography,
  SelectChangeEvent,
  Grid,
  Box,
} from '@mui/material';
import RegistrationStatistics from './RegistrationStatistics';

interface Props {
  selectOptions: { label: string; value: string }[];
  data?: string;
}

const YouthAndVolunteers: React.FC<Props> = ({ selectOptions, data }) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    selectOptions[0]?.value || ''
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div style={{ padding: '16px' }}>
      {data && (
        <Typography
          variant="h2"
          sx={{ fontSize: '16px', color: 'black' }}
          gutterBottom
        >
           Total Youth and Volunteers{/* to do */}
        </Typography>
      )}
      <FormControl style={{ marginBottom: '8px', width: '100%' }}>
        <Select
          value={selectedValue}
          onChange={handleChange}
          style={{
            borderRadius: '8px',

            fontSize: '16px',
          }}
          displayEmpty
        >
          {selectOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="body1" style={{ fontWeight: 300, color: 'black' }}>
        {data}
      </Typography>
      {data && (
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <RegistrationStatistics
                avatar={true}
                statistic={4}
                subtile={'Youth'}
              />
            </Grid>
            <Grid item xs={6}>
              <RegistrationStatistics
                avatar={true}
                statistic={4}
                subtile={'Volunteer'}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default YouthAndVolunteers;

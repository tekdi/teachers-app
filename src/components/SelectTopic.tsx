import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

function SelectTopic() {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ padding: '8px 16px' }}>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: theme?.palette?.warning['A200'],
              background: theme?.palette?.warning['A400'],
              padding: '2px 8px',
            }}
            id="demo-multiple-select-label"
          >
            {t('CENTER_SESSION.TOPIC')}
          </InputLabel>
          <Select
            labelId="demo-multiple-select-label"
            id="demo-multiple-select"
            multiple
            value={selectedValues}
            onChange={handleChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
            style={{ borderRadius: '4px' }}
            className="topic-select"
          >
            <MenuItem value={'Food & Nutrition'}>
              <Checkbox
                sx={{
                  '&.Mui-checked': {
                    color: theme?.palette?.warning['300'],
                  },
                }}
                checked={selectedValues.indexOf('Food & Nutrition') > -1}
              />
              <ListItemText primary="Food & Nutrition" />
            </MenuItem>

            {/* Add more MenuItem components as needed */}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ my: 2 }}>
        <FormControl fullWidth>
          <InputLabel
            style={{ color: theme?.palette?.warning['A200'] }}
            id="demo-simple-select-label"
          >
            {t('CENTER_SESSION.SUBTOPIC')}
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Subject"
            style={{ borderRadius: '4px' }}
          >
            {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default SelectTopic;

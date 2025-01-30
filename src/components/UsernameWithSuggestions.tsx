import {
  Box,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';

import React from 'react';
interface UsernameWidgetProps {
  formContext: {
    suggestions: string[];
    onSuggestionSelect: (suggestion: string) => void;
  };
  value: string;
  onChange: (value: string) => void;
  onBlur: (field: string, value: string) => void;
}
const UsernameWithSuggestions: React.FC<UsernameWidgetProps> = ({
  formContext,
  value,
  onBlur,
  onChange,
  ...rest
}) => {
  console.log("value", value);        
  const { suggestions, onSuggestionSelect } = formContext;
  const { t } = useTranslation();

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event.target.name, event.target.value);
    }
  };

  const handleWheel = (event: any) => {
    if (event.target instanceof HTMLInputElement) {
      event.target.blur();
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <TextField
        value={value}
        onChange={handleUsernameChange}
        onBlur={handleBlur}
        InputLabelProps={{
          shrink: value ? true : false,
        }}
        {...rest}
      />
      {suggestions?.length > 0 && (
        <div>
          {suggestions?.map((suggestion: any, index: number) => (
            <Box>
              {value!=="" &&(<Typography variant="h6"  sx={{marginLeft:"12px", mt:"2px"}} color="error" gutterBottom>
                {t('FORM.USERNAME_ALREADY_EXIST')}
              </Typography>)}
              <Typography variant="h6" m="2px"  sx={{marginLeft:"12px"}}color="textSecondary" gutterBottom>
                {t('FORM.AVAILABLE_SUGGESTIONS')}
              </Typography>
              <Typography
                onClick={() => onSuggestionSelect(suggestion)}
                sx={{ cursor: 'pointer', color: 'green', marginLeft:"12px" }}
              >
                {suggestion}
              </Typography>
            </Box>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsernameWithSuggestions;

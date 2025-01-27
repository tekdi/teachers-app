import { ListItemText, MenuItem, TextField } from "@mui/material";
import { WidgetProps } from "@rjsf/utils";
import React from "react";
interface UsernameWidgetProps {
  formContext: any
  value: any;
  onChange: (value: any) => void;
  onBlur: (field: any ,value: any) => void;


}
const UsernameWithSuggestions: React.FC<UsernameWidgetProps> = ({
  formContext,
  value,
  onBlur,
  onChange,
  ...rest
}) => {
  const { suggestions, onSuggestionSelect } = formContext;

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event.target.name, event.target.value); // Forwarding onBlur event to the parent
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
        // label="Username"
        value={value}
        onChange={handleUsernameChange}  
        onBlur={handleBlur}
        InputLabelProps={{
          shrink: value ? true : false,
        }}
        // onWheel={handleWheel}
        {...rest}
      />
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((suggestion: any, index: number) => (
            <MenuItem
              key={index}
              onClick={() => onSuggestionSelect(suggestion)} 
            >
              <ListItemText primary={suggestion} />
            </MenuItem>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsernameWithSuggestions;





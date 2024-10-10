import * as React from 'react';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
interface ButtonFunctionalProps {
  handleClickButton: () => void;
  buttonName: string;
}
export default function ButtonFunctional({
  handleClickButton,
  buttonName,
}: ButtonFunctionalProps) {
  const theme = useTheme<any>();
  return (
    <Button
      variant="contained"
      className="one-line-text"
      style={{
        boxShadow: 'none',
        background:
          theme.components.MuiButton.styleOverrides.containedSecondary
            .backgroundColor,
        color: theme.components.MuiButton.styleOverrides.root.color,
        borderRadius: '100px',
        width: '100%',
        height: '40px',
        // marginTop: '20px'
      }}
      onClick={handleClickButton}
    >
      {buttonName}
    </Button>
  );
}

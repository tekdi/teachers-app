import React from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTheme } from '@mui/material/styles';

interface BottomDrawerProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  buttonLabel: string;
  onAction: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  open,
  onClose,
  title,
  buttonLabel,
  onAction,
}) => {
  const theme = useTheme<any>();
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '28px 28px 0 0',
          padding: '16px',
          minHeight: '180px',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={onClose}
        sx={{
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            width: '40px',
            height: '4px',
            backgroundColor: theme?.palette?.warning['400'],
            borderRadius: '2px',
            marginBottom: '12px',
          }}
        />
      </Box>
      <Typography
        sx={{
          marginTop: '25px',
          fontSize: '16px',
          color: theme?.palette?.warning['400'],
          marginBottom: '16px',
        }}
      >
        {title}
      </Typography>
      <Button
        variant="outlined"
        startIcon={
          <SwapHorizIcon
            sx={{ fontSize: '20px', color: theme?.palette?.warning['400'] }}
          />
        }
        sx={{
          width: '200px',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 300,
          marginBottom: '12px',
          '&:hover': {
            backgroundColor: 'transparent',
            border: 'none',
          },
        }}
        onClick={onAction}
      >
        {buttonLabel}
      </Button>
      <Divider />
    </Drawer>
  );
};

export default BottomDrawer;

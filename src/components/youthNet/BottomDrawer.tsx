import React from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ButtonData {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface BottomDrawerProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  buttons: ButtonData[];
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  open,
  onClose,
  title,
  buttons,
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

      {buttons?.map((button, index) => (
        <>
          <Button
            key={index}
            variant="outlined"
            startIcon={button?.icon}
            sx={{
              width: '100%',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 300,
              justifyContent: 'flex-start',
              textAlign: 'left',
              marginBottom: '12px',
              '&:hover': {
                backgroundColor: 'transparent',
                border: 'none',
              },
            }}
            onClick={button.onClick}
          >
            {button?.label}
          </Button>
          <Divider />
        </>
      ))}
    </Drawer>
  );
};

export default BottomDrawer;

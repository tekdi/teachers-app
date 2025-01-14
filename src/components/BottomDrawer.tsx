import { BottomDrawerProps } from '@/utils/Interfaces';
import { Menu, MenuItem, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

// Type alias for the anchor positions

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  toggleDrawer,
  state,
  optionList,
  listItemClick,
  renderCustomContent,
  children,
  setAnchorEl,
  anchorEl,
  isMobile,
}) => {
  const theme = useTheme<any>();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const Listbox = () => (
    <Box
      sx={{
        width: isMobile ? 'auto' : '450px',
      }}
    >
      {isMobile && (
        <Box
          sx={{
            padding: '30px 40px 40px',
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={toggleDrawer('bottom', anchorEl, false)}
        >
          <Box className="bg-grey"></Box>
        </Box>
      )}

      {renderCustomContent?.()}
      {children}
      <List>
        {optionList.map(({ label, icon, name }) => (
          <ListItem disablePadding key={name}>
            <ListItemButton
              sx={{
                borderBottom: '1px solid #D0C5B4',
                padding: '20px',
                fontSize: '14px',
                color: theme.palette.warning['300'],
              }}
              onClick={(e) => listItemClick(e, name)}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          onClose={toggleDrawer('bottom', anchorEl, false)}
          open={state.bottom ?? false}
          className="modal-bottom"
        >
          <Listbox />
        </Drawer>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            padding: '0',
            '& .MuiList-root': {
              paddingTop: '0px',
              paddingBottom: '0px',
            },
          }}
        >
          {optionList.map(({ label, icon, name }) => (
            <MenuItem
              key={name}
              sx={{
                borderBottom: '1px solid #D0C5B4',
                padding: '20px',
                fontSize: '14px',
                color: theme.palette.warning['300'],
              }}
              onClick={(e) => {
                listItemClick(e, name);
                handleMenuClose();
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
};

export default BottomDrawer;

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

type Anchor = 'bottom';

interface BottomDrawerProps {
  toggleDrawer: (
    anchor: Anchor,
    open: boolean
  ) => (event: React.MouseEvent) => void;
  state: { [key in Anchor]?: boolean };
  optionList: {
    label: string;
    icon: React.ReactNode;
    name: string;
  }[];
  listItemClick: (event: React.MouseEvent, name: string) => void;
  renderCustomContent?: () => React.ReactNode;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  toggleDrawer,
  state,
  optionList,
  listItemClick,
  renderCustomContent
}) => {
  const theme = useTheme<any>();

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: 'auto',
      }}
      role="presentation"
    >
      <Box
        sx={{
          padding: '30px 40px 40px',
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick={toggleDrawer(anchor, false)}
      >
        <Box className="bg-grey"></Box>
      </Box>
      {renderCustomContent && renderCustomContent()} {/* render custom content if provided */}
      <List>
        {optionList.map(({ label, icon, name }, index) => (
          <ListItem disablePadding key={index}>
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
      <Drawer anchor="bottom" open={state.bottom} className="modal-bottom">
        {list('bottom')}
      </Drawer>
    </div>
  );
};

export default BottomDrawer;

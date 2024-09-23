import React from 'react';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FacilitatorDrawerProps } from '@/utils/Interfaces';
import taxonomyStore from '@/store/taxonomyStore';

const FacilitatorDrawer: React.FC<FacilitatorDrawerProps> = ({
  secondary,
  primary,
  toggleDrawer,
  drawerState,
  onPrimaryClick,
  selectedCount, 
}) => {
  const theme = useTheme<any>();
  const tStore = taxonomyStore();

  return (
    <div>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.bottom}
        onClose={() => toggleDrawer(false)()}
        onOpen={() => toggleDrawer(true)()}
        sx={{
          position: 'unset',
          '@media (min-width: 900px)': {
            '& .MuiPaper-root': {
              marginLeft: '352px',
            },
          },
        }}
        className="facilitator-drawer"
        BackdropProps={{ invisible: true }}
      >
        <Box
          sx={{
            py: '20px',
            px: '16px',
            background: '#4A4640',
            boxShadow: '0px 1px 2px 0px #0000004D',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        >
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              color: theme?.palette?.warning['A400'],
              '@media (min-width: 600px)': {
                textAlign: 'center',
              },
            }}
          >
            {tStore?.center}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {/* Show selected count */}
            <Box sx={{ color: '#fff' }}>
              {selectedCount > 0
                ? `${selectedCount} subtopics selected`
                : 'No subtopics selected'}
            </Box>

            {secondary && (
              <Box onClick={() => toggleDrawer(false)()}>
                <Button variant="outlined">{secondary}</Button>
              </Box>
            )}
            {primary && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onPrimaryClick}
                >
                  {primary}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default FacilitatorDrawer;

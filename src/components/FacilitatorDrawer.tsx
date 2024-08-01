import React from 'react';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FacilitatorDrawerProps } from '@/utils/Interfaces';

const FacilitatorDrawer: React.FC<FacilitatorDrawerProps> = ({
  secondary,
  primary,
  toggleDrawer,
  drawerState,
}) => {
  const theme = useTheme();

  return (
    <div>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.bottom}
        onClose={toggleDrawer(true)}
        onOpen={toggleDrawer(true)}
        sx={{ position: 'unset' }}
        BackdropProps={{ invisible: true }}
      >
        <Box sx={{ py: '20px', px: '16px', background: 'black' }}>
          <Box
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              color: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            Khapari Dharmu (Chimur, Chandrapur)
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {secondary && (
              <Box>
                <Box
                  onClick={toggleDrawer(false)}
                  sx={{ padding: '20px 16px' }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      '&.Mui-disabled': {
                        backgroundColor: theme?.palette?.primary?.main,
                      },
                      minWidth: '84px',
                      padding: theme.spacing(1),
                      fontWeight: '500',
                      width: '128px',
                      height: '40px',
                      color: '#FFFFFF',
                      border: '1px solid #FFFFFF',
                      '@media (max-width: 430px)': {
                        width: '100%',
                      },
                    }}
                    // onClick={handleSecondaryModel} // Uncomment and implement this function if needed
                  >
                    {secondary}
                  </Button>
                </Box>
              </Box>
            )}
            {primary && (
              <Box sx={{ width: secondary ? 'unset' : '100%' }}>
                <Box sx={{ padding: '20px 16px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      '&.Mui-disabled': {
                        backgroundColor: theme?.palette?.primary?.main,
                      },
                      minWidth: '84px',
                      padding: theme.spacing(1),
                      fontWeight: '500',
                      width: secondary ? '199px' : '100%',
                      height: '40px',
                      '@media (max-width: 430px)': {
                        width: '100%',
                      },
                    }}
                    // onClick={handlePrimaryModel} // Uncomment and implement this function if needed
                  >
                    {primary}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default FacilitatorDrawer;

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
  const theme = useTheme<any>();

  return (
    <div>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.bottom}
        onClose={toggleDrawer(true)}
        onOpen={toggleDrawer(true)}
        sx={{
          position: 'unset',
          '@media (min-width: 900px)': {
            '& .MuiPaper-root': {
              marginLeft: '352px',
              // bottom:'3rem',
              // borderRadius:'16px'
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
            Khapari Dharmu (Chimur, Chandrapur) {/*  will come from API */}
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
                  sx={{ padding: '20px 16px 0' }}
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
                      color: theme?.palette?.warning['A400'],
                      border: `1px solid ${theme?.palette?.warning['A400']}`,
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
                <Box sx={{ padding: '20px 16px 0' }}>
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
                    onClick={toggleDrawer(false)}
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

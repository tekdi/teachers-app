import React from 'react';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FacilitatorDrawerProps } from '@/utils/Interfaces';
import taxonomyStore from '@/store/taxonomyStore';
import { useTranslation } from 'next-i18next';

const FacilitatorDrawer: React.FC<FacilitatorDrawerProps> = ({
  secondary,
  primary,
  toggleDrawer,
  drawerState,
  onPrimaryClick,
  selectedCount,
  onSecondaryClick,
}) => {
  const theme = useTheme<any>();
  const tStore = taxonomyStore();
  const { t } = useTranslation();

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
          {/* Show selected count */}
          <Box
            sx={{
              color: theme?.palette?.warning['A400'],
              fontSize: '14px',
              fontWeight: '400',
              '@media (min-width: 500px)': {
                textAlign: 'center',
              },
            }}
          >
            {selectedCount > 0
              ? `${selectedCount} ${t('COURSE_PLANNER.SUBTOPICS_SELECTED')}`
              : `${t('ASSESSMENTS.NO_SUBTOPIC_SELECTED')}`}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              '@media (min-width: 500px)': {
                justifyContent: 'center',
              },
              mt: 1.5,
            }}
          >
            {secondary && (
              <Box onClick={onSecondaryClick}>
                <Button
                  sx={{
                    border: `1px solid ${theme?.palette?.warning['A400']}`,
                    color: theme?.palette?.warning['A400'],
                    width: 'fit-content',
                    px: '20px',
                  }}
                  variant="outlined"
                >
                  {secondary}
                </Button>
              </Box>
            )}
            {primary && (
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onPrimaryClick}
                  sx={{ width: 'fit-content', px: '20px' }}
                  className="one-line-text"
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

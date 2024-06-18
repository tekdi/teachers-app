import BottomDrawer from './BottomDrawer';
import { Box } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DropOutModal from './DropOutModal';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import React from 'react';
import Woman2Icon from '@mui/icons-material/Woman2';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

type Anchor = 'bottom';

const LearnersList = () => {
  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, bottom: open });
    };
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);

  const listItemClick = (event: React.MouseEvent, name: string) => {
    if (name === 'mark-drop-out') {
      setShowModal(true);
    }
  };

  return (
    <>
      <Box px={'18px'} mt={2} sx={{ borderBottom: '1px solid #D0C5B4' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '15px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Box className="box_shadow_center">
              <Woman2Icon
                sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
              />
            </Box>
            <Box>
              <Box
                sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
              >
                Aanya Gupta
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{ fontSize: '12px', color: theme.palette.warning['400'] }}
                >
                  19 y/o
                </Box>
                <FiberManualRecordIcon
                  sx={{ fontSize: '9px' }}
                  className="textCD"
                />
                <Box
                  sx={{ fontSize: '12px', color: theme.palette.warning['400'] }}
                >
                  1102929282
                </Box>
              </Box>
            </Box>
          </Box>
          <MoreVertIcon
            onClick={toggleDrawer('bottom', true)}
            sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
          />
        </Box>
      </Box>

      <Box px={'18px'} mt={2} sx={{ borderBottom: '1px solid #D0C5B4' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '15px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Box className="box_shadow_center">
              <Woman2Icon
                sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
              />
            </Box>
            <Box>
              <Box
                sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
              >
                Aanya Gupta
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{ fontSize: '12px', color: theme.palette.warning['300'] }}
                >
                  19 y/o
                </Box>
                <FiberManualRecordIcon
                  sx={{ fontSize: '9px' }}
                  className="textCD"
                />
                <Box
                  sx={{
                    fontSize: '12px',
                    color: theme.palette.warning['300'],
                    background: theme.palette.error.light,
                    fontWeight: '500',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                  }}
                >
                  <Box sx={{ marginTop: '1px' }}>Dropped Out</Box>
                  <ErrorOutlineIcon style={{ fontSize: '13px' }} />
                </Box>
              </Box>
            </Box>
          </Box>
          <MoreVertIcon
            onClick={toggleDrawer('bottom', true)}
            sx={{ fontSize: '24px', color: theme.palette.warning['300'] }}
          />
        </Box>
        <BottomDrawer
          toggleDrawer={toggleDrawer}
          state={state}
          listItemClick={listItemClick}
          optionList={[
            {
              label: t('COMMON.MARK_DROP_OUT'),
              icon: (
                <NoAccountsIcon sx={{ color: theme.palette.warning['300'] }} />
              ),
              name: 'mark-drop-out',
            },
            {
              label: t('COMMON.REMOVE_FROM_CENTER'),
              icon: (
                <DeleteOutlineIcon
                  sx={{ color: theme.palette.warning['300'] }}
                />
              ),
              name: 'remove-from-center',
            },
          ]}
        />
      </Box>
      <DropOutModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default LearnersList;

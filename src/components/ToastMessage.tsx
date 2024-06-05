import React from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toastAutoHideDuration } from '../../app.config';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

const DEFAULT_POSITION: Pick<State, 'vertical' | 'horizontal'> = {
  vertical: 'bottom',
  horizontal: 'center',
};

function ToastMessage({ message }: { message: string }) {
  const [state, setState] = React.useState<State>({
    openModal: true,
    ...DEFAULT_POSITION,
  });
  const { vertical, horizontal } = state;

  const handleClose = () => {
    setState({ ...state, openModal: false });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={state.openModal}
      onClose={handleClose}
      className="alert"
      autoHideDuration={toastAutoHideDuration}
      key={vertical + horizontal}
      message={message}
      action={
        <IconButton size="small" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

export default ToastMessage;

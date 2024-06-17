import React from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { toastAutoHideDuration } from '../../app.config';
import { generateRandomString } from '@/utils/Helper';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

type ToastTypes = 'success' | 'error' | 'warning' | 'info';

const DEFAULT_POSITION: Pick<State, 'vertical' | 'horizontal'> = {
  vertical: 'bottom',
  horizontal: 'center',
};

function ToastMessage({
  message,
  type = 'error',
  onClose,
}: {
  message: string;
  type?: ToastTypes;
  onClose?: () => void;
}) {
  const [state, setState] = React.useState<State>({
    openModal: true,
    ...DEFAULT_POSITION,
  });
  const { vertical, horizontal } = state;

  const handleClose = () => {
    setState({ ...state, openModal: false });
    onClose && onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={state.openModal}
      onClose={handleClose}
      autoHideDuration={toastAutoHideDuration}
      disableWindowBlurListener={true}
      key={'key_' + generateRandomString(3)}
    >
      <Alert severity={type} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ToastMessage;

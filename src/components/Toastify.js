import { toast } from 'react-toastify';

const options = {
  position: 'bottom-center',
  hideProgressBar: true,
  closeButton: false,
  autoClose: 3000
};

export const showToastMessage = (message, type='success') => {
  const commonOptions = {
    ...options,
    style: {
      color: '#fff'
    }
  };

  switch(type) {
    case 'error':
      toast.error(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: '#FF0000'
        }
      });
      break;
    case 'success':
      toast.success(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: '#019722'
        }
      });
      break;
    case 'info':
      toast.info(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: '#017AFF'
        }
      });
      break;
    case 'warning':
      toast.warning(message, {
        ...commonOptions,
        style: {
          ...commonOptions.style,
          background: '#FFA500'
        }
      });
      break;
    default:
      throw new Error(`Unknown toast type: ${type}`);
  }
};

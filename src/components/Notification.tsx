import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { onMessageListener } from './../../firebase.js';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationPayload {
  title: string;
  body: string;
  icon: string;
  navigate_to?: string;
}

const Notification: React.FC = () => {
  const [notification, setNotification] = useState<NotificationPayload>({
    title: '',
    body: '',
    icon: '',
    navigate_to: '',
  });

  const notify = () =>
    toast(<ToastDisplay />, {
      duration: Infinity,
    });

  const closeNotification = () => toast.dismiss();

  const ToastDisplay: React.FC = () => (
    <Box
      className="notification-container"
      sx={{ display: 'flex', gap: '8px' }}
      onClick={handleNotificationClick}
    >
      {notification.icon && (
        <img
          className="notification-icon"
          src={notification.icon}
          alt="Notification"
        />
      )}

      <Box>
        <Box sx={{ fontSize: '16px', fontWeight: '500', color: '#019722' }}>
          {notification.title}
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#1F1B13',
            marginTop: '8px',
          }}
        >
          {notification.body}
        </Box>
      </Box>
      <Box
        className="close-icon"
        onClick={(e) => {
          e.stopPropagation();
          closeNotification();
        }}
      >
        <CloseIcon
          sx={{ color: '#1C1B1F', fontSize: '16px', cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );

  const handleNotificationClick = () => {
    if (notification.navigate_to) {
      const url = notification.navigate_to;
      const pathname = new URL(url).pathname;
      window.location.href = pathname;
    }
  };

  useEffect(() => {
    if (notification.title) {
      notify();
    }
  }, [notification]);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        if (payload?.notification?.title) {
          setNotification({
            title: payload.notification.title,
            body: payload.notification.body,
            icon: payload.notification.icon,
            navigate_to: payload.notification.navigate_to,
          });
        }
      })
      .catch((err) => console.error('Failed to receive notification:', err));
  }, []);

  return <Toaster />;
};

export default Notification;

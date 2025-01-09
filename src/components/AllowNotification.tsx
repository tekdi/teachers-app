import { useEffect, useState } from 'react';
import { requestPermission } from './../../firebase';
import { UpdateDeviceNotification } from '../services/NotificationService';
import { tenantId } from '../../app.config';

const AllowNotification = () => {
  const [permissionStatus, setPermissionStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notification API is not available in this environment.');
      return;
    }

    const handlePermissionChange = () => {
      setPermissionStatus(Notification.permission);

      if (Notification.permission === 'default') {
        localStorage.removeItem('deviceID');
        console.log('Notification permission reset and deviceID removed');
      }
    };

    navigator.permissions
      .query({ name: 'notifications' })
      .then((permission) => {
        permission.addEventListener('change', handlePermissionChange);
      })
      .catch((error) =>
        console.error('Failed to query notification permission:', error)
      );

    return () => {
      navigator.permissions
        .query({ name: 'notifications' })
        .then((permission) => {
          permission.removeEventListener('change', handlePermissionChange);
        })
        .catch((error) =>
          console.error(
            'Failed to remove notification permission listener:',
            error
          )
        );
    };
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return;
      }

      const deviceID = localStorage.getItem('deviceID');
      const authToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (permissionStatus === 'default') {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      }

      if (permissionStatus === 'granted' && !deviceID) {
        try {
          const token = await requestPermission();
          if (token && userId && authToken) {
            await UpdateDeviceNotification({ deviceId: token, action: 'add' }, userId, {
              tenantId,
              Authorization: `Bearer ${authToken}`,
            });
            localStorage.setItem('deviceID', token);
          }
        } catch (error) {
          console.error('Failed to save notification token:', error);
        }
      } else if (permissionStatus === 'denied' && deviceID) {
        localStorage.removeItem('deviceID');
        console.log('Notification token removed from local storage');
      }
    };

    fetchToken();
  }, [permissionStatus]);

  return null;
};

export default AllowNotification;

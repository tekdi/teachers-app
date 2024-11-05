import { useEffect, useState } from 'react';
import { requestPermission } from './../../firebase';
import { UpdateDeviceNotification } from '../services/NotificationService';
import { tenantId } from '../../app.config';

const AllowNotification = () => {
  const [permissionStatus, setPermissionStatus] = useState(
    Notification.permission
  );

  useEffect(() => {
    const handlePermissionChange = () => {
      setPermissionStatus(Notification.permission);
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
      const deviceID = localStorage.getItem('deviceID');
      const authToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (permissionStatus === 'default') {
        // Request permission from the user
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      }

      if (permissionStatus === 'granted' && !deviceID) {
        try {
          const token = await requestPermission();
          if (token && userId && authToken) {
            await UpdateDeviceNotification([{ deviceId: token }], userId, {
              tenantId,
              Authorization: `Bearer ${authToken}`,
            });
            localStorage.setItem('deviceID', token);
            console.log('Notification token saved to the database');
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

  useEffect(() => {
    const handlePermissionChange = () => {
      setPermissionStatus(Notification.permission);
    };

    navigator.permissions
      .query({ name: 'notifications' })
      .then((permission) => {
        permission.addEventListener('change', handlePermissionChange);
      });

    return () => {
      navigator.permissions
        .query({ name: 'notifications' })
        .then((permission) => {
          permission.removeEventListener('change', handlePermissionChange);
        });
    };
  }, []);

  return null;
};

export default AllowNotification;
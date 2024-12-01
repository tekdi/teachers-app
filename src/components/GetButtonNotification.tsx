import { Button } from '@mui/material';
import React from 'react';
import { readUserId, sendNotification } from '@/services/NotificationService';

const GetButtonNotification = () => {
  const getNotification = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID is not found in local storage.');
        return;
      }

      const userDetails = await readUserId(userId, true);
      console.log('API Response:', userDetails);

      const deviceId = userDetails?.result?.userData?.deviceId;

      console.log('Device ID from API:', deviceId);

      if (deviceId) {
        const result = await sendNotification({
          isQueue: false,
          context: 'USER',
          key: 'onReassignTLbyAdmin',
          push: {
            receipients: [deviceId],
          },
        });

        console.log('Notification sent successfully:', result);
      } else {
        console.log('No deviceId found in user details.');
      }
    } catch (error) {
      console.error('Error in getNotification:', error);
    }
  };

  return (
    <div>
      <Button onClick={getNotification}>Get Notification</Button>
    </div>
  );
};

export default GetButtonNotification;

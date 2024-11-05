import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import config from './config.json';

const firebaseApp = initializeApp(config.firebaseConfig);
let messaging;

if (typeof window !== 'undefined') {
  messaging = getMessaging(); 
}

export const requestPermission = async () => {
  console.log('Requesting notification permission...');
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: "BOZ_JkC62vr767LoC7APU26ZdGYW5htBkfqIEtsVX6zmE3Fi-XgcN_TggSaXKh5rGKcaa4vuQxaYiRPU2B955GI",
    });
    console.log('Notification token:', token);
    return token;
  } else {
    console.warn("Notification permission denied");
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Received foreground message:", payload);
        resolve(payload);
      });
    }
  });         

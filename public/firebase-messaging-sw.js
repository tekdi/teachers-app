// import firebaseConfig from '../firebaseConfig';

self.addEventListener('install', async () => {
  try {
    // Scripts for firebase and firebase messaging
    importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

    const response = await fetch('/api/env');
    const env = await response.json();
    const firebaseConfig = {
      apiKey: env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_FCM_PROJECT_FCM_ID,
      storageBucket: env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_FCM_MESSAGING_SENDER,
      appId: env.NEXT_PUBLIC_FCM_FCM_APP_ID,
      measurementId: env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
    };

    // Initialize the Firebase app in the service worker by passing the generated config
    firebase.initializeApp(firebaseConfig);
    // Retrieve firebase messaging
    const messaging = firebase.messaging();
    // messaging.onBackgroundMessage((payload) => {
    //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
    //   const notificationTitle = payload.notification.title;
    //   const notificationOptions = {
    //     body: payload.notification.body,
    //     icon: payload.notification.icon,
    //   };


    //   self.registration.showNotification(notificationTitle, notificationOptions);
    // });
    messaging.onBackgroundMessage(function (payload) {
      console.log('Received background message ', payload);


      // const notificationTitle = payload.data.title;
      // const navigate_to = payload.data.navigate_to;
      // const notificationOptions = {
      //   body: payload.data.body,
      //   icon: payload.data.icon,
      //   vibrate: [100, 50, 100],
      //   data: {
      //     dateOfArrival: Date.now(),
      //     primaryKey: 1,
      //   },
      // };
      const notificationTitle = payload.notification.title;
      const navigate_to = payload.notification.navigate_to;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
      };


      self.registration.showNotification(notificationTitle, notificationOptions);
      if (navigate_to != "" && navigate_to != undefined) {
        // Open the specified URL when the notification is clicked
        self.addEventListener('notificationclick', function (event) {
          event.notification.close();
          event.waitUntil(
            clients.openWindow(navigate_to)
          );
        });
      }
    });
  } catch (error) {
    console.error('An error occurred while retrieving the environment');
  }

});
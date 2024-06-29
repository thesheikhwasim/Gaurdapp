
import { PushNotifications } from '@capacitor/push-notifications';

export const addListeners = async () => {
    console.log("addListeners function of PUSH NOTIFICATION CALLED-----> ");
  await PushNotifications.addListener('registration', token => {
    console.log('PUSH NOTIFICATION Registration token: ', token.value);
    localStorage.setItem('deviceId', token.value);
  });

  await PushNotifications.addListener('registrationError', err => {
    console.error('PUSH NOTIFICATION Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('PUSH NOTIFICATION received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('PUSH NOTIFICATION action performed', notification.actionId, notification.inputValue);
  });
}

export const registerNotifications = async () => {
    console.log("REGISTER FUNCTION FOR PUSH NOTIFICATION CALLED.");
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions for PUSH NOTIFICATION!');
  }

  await PushNotifications.register();
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}
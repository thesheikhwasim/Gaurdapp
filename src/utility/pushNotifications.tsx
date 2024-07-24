
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
    console.log('PUSH NOTIFICATION action performed', notification.actionId);
    if(notification.actionId == 'tap'){
      console.log('NAVIAGTE NAVIGATE NAVIGATE')
      hitActionOnTap();
    }
  });
}

export const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions for PUSH NOTIFICATION!');
  }

  await PushNotifications.register();
}

export const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}

const hitActionOnTap = () => {
  const token = localStorage.getItem('token');
  if(token){
    window.location.href = '/pages/tabs/Dashboard/Notice';
  }
}
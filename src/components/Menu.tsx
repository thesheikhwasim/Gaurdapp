import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  calendarClearOutline,
  informationCircleOutline,
  personCircleOutline,
  paperPlaneOutline,
  notificationsOutline,
  personAddOutline,
  languageOutline,
  logOutOutline,
  logInOutline,
} from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import './Menu.css';

const Menu: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status every 500 milliseconds
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      console.log('Login status:', loggedInStatus); // Debugging line
      setIsLoggedIn(loggedInStatus);
    };

    checkLoginStatus(); // Initial check

    const interval = setInterval(checkLoginStatus, 500);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const menuItems = [
    {
      title: t('Home'),
      url: '/pages/Dashboard',
      iosIcon: calendarClearOutline,
      mdIcon: calendarClearOutline,
    },
    {
      title: t('Duty Info'),
      url: '/pages/DutyInfo',
      iosIcon: informationCircleOutline,
      mdIcon: informationCircleOutline,
    },
    {
      title: t('Profile'),
      url: '/pages/Accountupd',
      iosIcon: personCircleOutline,
      mdIcon: personCircleOutline,
    },
    {
      title: t('Requests'),
      url: '/pages/getRequest',
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
    },
    {
      title: t('Tickets'),
      url: '/pages/getTicket',
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
    },
    {
      title: t('Notification'),
      url: '/pages/Notice',
      iosIcon: notificationsOutline,
      mdIcon: notificationsOutline,
    },
    {
      title: t('Add New Guard'),
      url: '/pages/AddNewGuard',
      iosIcon: personAddOutline,
      mdIcon: personAddOutline,
    },
    {
      title: t('Your ID Card'),
      url: '/pages/idCard',
      iosIcon: personAddOutline,
      mdIcon: personAddOutline,
    },
    {
      title: t('Change Language'),
      url: '/pages/LanguageSelector',
      iosIcon: languageOutline,
      mdIcon: languageOutline,
    },
    {
      title: t('Logout'),
      url: '/pages/Logout',
      iosIcon: logOutOutline,
      mdIcon: logOutOutline,
    },
  ];

  const loginItem = {
    title: t('Login'),
    url: '/pages/Login',
    iosIcon: logInOutline,
    mdIcon: logInOutline,
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{t('Guard App')}</IonListHeader>
          {/* <IonNote>{t('Hi User')}</IonNote> */}
          {isLoggedIn ? (
            menuItems.map((appPage, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))
          ) : (
            <IonMenuToggle autoHide={false}>
              <IonItem className={location.pathname === loginItem.url ? 'selected' : ''} routerLink={loginItem.url} routerDirection="none" lines="none" detail={false}>
                <IonIcon aria-hidden="true" slot="start" ios={loginItem.iosIcon} md={loginItem.mdIcon} />
                <IonLabel>{loginItem.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

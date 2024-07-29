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
  IonImg,
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
  peopleCircleOutline,
} from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import './Menu.css';

const Menu: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserData, setLoggedUserData] = useState();

  // Check login status every 500 milliseconds
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      const loggedUserData = localStorage.getItem('loggedInUser');

      console.log('Login status:', loggedInStatus); // Debugging line
      setLoggedUserData(JSON.parse(loggedUserData));
      setIsLoggedIn(loggedInStatus);
    };
    // const loggedUserStatus = localStorage.getItem('isLoggedIn');
    // console.log("SH verify logged Status", loggedUserStatus);

    checkLoginStatus(); // Initial check

    const interval = setInterval(checkLoginStatus, 500);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    console.log("Sessionizes useEffect Called", isLoggedIn);
    if(isLoggedIn){
      console.log("Inide if ---- ", isLoggedIn);
        const loggedUserData = localStorage.getItem('loggedInUser');
        setLoggedUserData(JSON.parse(loggedUserData));
        console.log("SH verify logged data inner case", loggedUserData);
    }
  }, [isLoggedIn]);

  const menuItems = [
    {
      title: t('Home'),
      url: '/pages/tabs/Dashboard',
      iosIcon: calendarClearOutline,
      mdIcon: calendarClearOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Duty Info'),
      url: '/pages/tabs/Dashboard/DutyInfo',
      iosIcon: informationCircleOutline,
      mdIcon: informationCircleOutline,
      isManager: false,
      enabled: loggedUserData?.dutydisplay == 1 ? true: false
    },
    {
      title: t('Profile'),
      url: '/pages/Accountupd',
      iosIcon: personCircleOutline,
      mdIcon: personCircleOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Requests'),
      url: '/pages/tabs/getRequest',
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Tickets'),
      url: '/pages/tabs/getTicket',
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Notification'),
      url: '/pages/tabs/Notice',
      iosIcon: notificationsOutline,
      mdIcon: notificationsOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Add New Guard'),
      url: '/pages/AddNewGuard',
      iosIcon: personAddOutline,
      mdIcon: personAddOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Your ID Card'),
      url: '/pages/idCard',
      iosIcon: personAddOutline,
      mdIcon: personAddOutline,
      isManager: false,
      enabled: true
    },{
      title: t('Manager'),
      url: '/pages/MapView',
      iosIcon: personAddOutline,
      mdIcon: personAddOutline,
      isManager: true,
      enabled: true
    },
    {
      title: t('Change Language'),
      url: '/pages/LanguageSelector',
      iosIcon: languageOutline,
      mdIcon: languageOutline,
      isManager: false,
      enabled: true
    },
    {
      title: t('Logout'),
      url: '/pages/Logout',
      iosIcon: logOutOutline,
      mdIcon: logOutOutline,
      isManager: false,
      enabled: true
    },
  ];

  const loginItem = {
    title: t('Login'),
    url: '/pages/Login',
    iosIcon: logInOutline,
    mdIcon: logInOutline,
  };

  return (
    <IonMenu className='sidebar' contentId="main" type="overlay">
      <IonContent className='sidebarbg'>
        <IonList id="inbox-list">
          <IonListHeader>{t('Guard App')}</IonListHeader>
          {isLoggedIn && <div className='userNameImageContainer'>
            <div className='userImageDiv'>
            {loggedUserData?.photo ?
                <IonImg
                  src={`https://guard.ghamasaana.com/guard_new_api/emp_image/${loggedUserData.photo}`}
                  style={{ height: '26px', width: '26px' }}
                ></IonImg>
            : <IonImg src="./assets/imgs/user.svg" alt="header" style={{ height: '26px', width: '26px' }} />}
            
            </div>
            <div className='userNameDIv'>
              {loggedUserData?.full_name}
            </div>
          </div> 
          }
          {/* <IonNote>{loggedUserData?.full_name}</IonNote> */}
          {isLoggedIn ? (
            menuItems.map((appPage, index) => ( (!appPage.isManager && appPage.enabled) &&
              <IonMenuToggle className='reree' key={index} autoHide={false}>
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

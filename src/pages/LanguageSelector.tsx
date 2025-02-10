import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonSelect, IonSelectOption, IonFooter } from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import './Page.css';
import { registerNotifications } from '../utility/pushNotifications';
import CustomHeader from './CustomHeader';
import { t } from 'i18next';

const LanguageSelector: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const { i18n } = useTranslation();
  const history = useHistory();

  const [lang, setLang] = useState<string>(localStorage.getItem('language') || 'ENGLISH'); // Read language from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    registerNotifications();
  


    if (storedData === "true" && token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Set the language if it's stored in localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Save selected language to localStorage
  };

  const handleLanguageUpdate = async () => {
    try {
      
      if (lang === 'ENGLISH' || lang === 'HINDI' || lang === 'PUNJABI' || lang === 'TELUGU'
         || lang === 'TAMIL'  || lang ==='KANNADA'  || lang ==='ODIA'
      ) {
        changeLanguage(lang);
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
          history.push('/pages/tabs/Dashboard');
        } else {
          history.push('/pages/Login');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <CustomHeader />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <IonCard className='ion-text-center shadowCard'>
          <IonCardHeader>
            <IonCardTitle className='title' color={'dark'}>Select Language / भाषा चुने</IonCardTitle>
            <IonCardSubtitle className='subtitle' color={'dark'}>{t('Welcome to Guard Commander')}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem className='ion-margin-bottom'>
                <IonSelect
                  value={lang}
                  placeholder="Select Language / भाषा चुने"
                  onIonChange={(e) => setLang(e.detail.value)}
                >
                  <IonSelectOption value="ENGLISH">English</IonSelectOption>
                  <IonSelectOption value="HINDI">हिंदी / Hindi</IonSelectOption>
                  <IonSelectOption value="PUNJABI">ਪੰਜਾਬੀ / Punjabi</IonSelectOption>
                  <IonSelectOption value="TELUGU">తెలుగు / Telugu</IonSelectOption>
                  <IonSelectOption value="TAMIL">தமிழ் / Tamil</IonSelectOption>
                  <IonSelectOption value="KANNADA">ಕನ್ನಡ / Kannada</IonSelectOption>
                  <IonSelectOption value="ODIA">ଓଡିଆ / Odia</IonSelectOption>
                  
                </IonSelect>
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonButton style={{ width: '100%' }} expand="block" color="primary" size="default" onClick={handleLanguageUpdate}>Confirm / पुष्टि करना</IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
 
      </IonContent>
    </IonPage>
  );
};

export default LanguageSelector;

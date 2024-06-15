import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonSelect, IonSelectOption, IonFooter } from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import './Page.css';

const LanguageSelector: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const { i18n } = useTranslation();
  const history = useHistory();

  const [lang, setLang] = useState<string>(localStorage.getItem('language') || ''); // Read language from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    
  


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
      
      if (lang === 'en' || lang === 'hi') {
        changeLanguage(lang);
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
          history.push('/pages/Dashboard');
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
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '40px', width: '100%', margin: '0px' }} />
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
            <IonCardSubtitle className='subtitle' color={'dark'}>Welcome to Gurad Commander</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem className='ion-margin-bottom'>
                <IonSelect
                  value={lang}
                  placeholder="Select Language / भाषा चुने"
                  onIonChange={(e) => setLang(e.detail.value)}
                >
                  <IonSelectOption value="en">English</IonSelectOption>
                  <IonSelectOption value="hi">हिंदी</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonButton style={{ width: '100%' }} expand="block" color="primary" size="default" onClick={handleLanguageUpdate}>Confirm / पुष्टि करना</IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <div className='footer'>
          <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LanguageSelector;

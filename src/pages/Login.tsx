import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonFooter } from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import axios from 'axios';

import './Page.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string; }>();
  const history = useHistory();

  const [empid, setUsername] = useState<string>('');
  const [mpin, setPassword] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<any>('');
  const [isLoggedIn, setIsLoggedIn] = useState<any>(null);
  const [btnEnabled, setBtnEnabled] = useState<boolean>(false);

  const { photos, takePhoto } = usePhotoGallery();

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('isLoggedIn');
    if (storedData === "true") {
      setIsLoggedIn(storedData);
      history.push('/pages/Dashboard');
    }
  }, [history]);

  useEffect(() => {
    formValidation();
  }, [empid, mpin, mobileNumber]);

  const saveToStorage = () => {
    // Save data to local storage
    localStorage.setItem('isLoggedIn', "true");
    // Update state
    setIsLoggedIn("true");
  };

  async function loginApi(formData) {
    try {
      alert(formData);
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/login.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const formValidation = () => {
    if(empid != '' && mpin != '' && mobileNumber != ''){
      setBtnEnabled(true);
    }else if(btnEnabled){
      setBtnEnabled(false);
    }
    console.log(btnEnabled);
  }

  const handleLogin = async () => {
    try {
      // await takePhoto();
      const formData = new FormData();
      formData.append('empid', empid);
      formData.append('mpin', mpin);
      formData.append('mobile', mobileNumber);
      formData.append('action', "login");

      const response = await loginApi(formData);
      if (response) {

        if (response.success) {
          saveToStorage();

          // if (!photos || !photos.filepath) {
          //   await takePhoto();
          // }

          // if (photos && photos.filepath) {
            
            localStorage.setItem('loggedInUser', JSON.stringify(response.employee_data));
            localStorage.setItem('token', response.token);
            history.push('/pages/Dashboard');
          // } else {
          //   alert('Please click a photo before logging in');
          // }
        } else {
          alert(response.message || 'Wrong User Name or Password');
        }
      } else {
        alert('Wrong User Name or Password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '40px', width: '100%' }} />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <IonCard className='ion-text-center'>
          <IonCardHeader >
            <IonCardTitle className='logintitle' color={'dark'}>{t('LogIn')}</IonCardTitle>
            <IonCardSubtitle className='subtitle' color={'dark'}>{t('WelcomeGaurd')}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList>
              <IonItem className='ion-margin-bottom ion-margin-top'>
                <IonInput
                  type="tel"
                  value={empid}
                  placeholder={t('Employee ID')}
                  onIonInput={(e) => {
                    setUsername(e.detail.value!);
                  }}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonInput
                  type="password"
                  value={mpin}
                  placeholder={t('Employee Password')}
                  onIonInput={(e) => {
                    setPassword(e.detail.value!);
                  }}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonInput
                  type="number"
                  value={mobileNumber}
                  placeholder={t('Mobile Number')}
                  onIonInput={(e) => {
                    setMobileNumber(e.detail.value!);
                  }}
                />
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonButton disabled={!btnEnabled} style={{ width: '100%' }} expand="block" color="primary" size="default" onClick={()=> handleLogin()}>{t('Login')}</IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <div className='footer'>
          <IonTitle className='footer ion-text-center'>{t('Helpline')} | +91 90999 XXXXX</IonTitle>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonFooter, useIonToast } from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import './Page.css';
import { PushNotifications } from '@capacitor/push-notifications';
import { registerNotifications } from '../utility/pushNotifications';
import { Sim } from '@jonz94/capacitor-sim';
import { Device } from '@capacitor/device';
import CustomHeader from './CustomHeader';

const sampleSimCardNumber = [
  {
  carrierName : "airtel",
  isoCountryCode:"in",
  mobileCountryCode: "404",
  mobileNetworkCode : "10",
  number : "+918877665544",
},
{
  carrierName : "jio",
  isoCountryCode:"in",
  mobileCountryCode: "404",
  mobileNetworkCode : "10",
  number : "919898989877",
}
]

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string; }>();
  const history = useHistory();

  const [empid, setUsername] = useState<string>('');
  const [mpin, setPassword] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<any>('');
  const [isLoggedIn, setIsLoggedIn] = useState<any>(null);
  const [btnEnabled, setBtnEnabled] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const { photos, takePhoto } = usePhotoGallery();
  const [present, dismiss] = useIonToast();
  const [simCardsFromDevice, setSimCardsFromDevice] = useState([]);

  useEffect(() => {
    registerLocationPermissions();
    registerNotifications();
    let tempDeviceId = localStorage.getItem('deviceId');
    setDeviceId(tempDeviceId);
    getSimCards();
  }, []);

  const getSimCards = async () => {
    const { simCards } = await Sim.getSimCards();
    if(simCards){
      setSimCardsFromDevice(simCards);
    }
  }

  function getSimCardsToDisplay(simArr){
    console.log("simArr ---", simArr);
    let tempSim = 'Your Phone Numbers: ';
    // return tempSim;

    if(simArr && simArr.length > 0){
      simArr.map((e, key) => {
        if(key == 0){
          tempSim = tempSim + e.number
        }else{
          tempSim = tempSim + ',' + e.number
        }
      });
    }
    // alert(tempSim)
    return tempSim;

  }

  async function hitCheckPermissionsForGeolocation (){
    const checkPermissions = await Geolocation.checkPermissions();
    console.log("Login page checkPermissions rendered", checkPermissions);
    if (checkPermissions?.location == "denied") {
      present({
        message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
        duration: 5000,
        position: 'bottom',
      });
    }
  }

  async function registerLocationPermissions() {
    hitCheckPermissionsForGeolocation();
    const permissions = await Geolocation.requestPermissions();

    // console.log("PERMISSION", permissions);
    // Case to validate permission is denied, if denied error message alert will be shown
    console.log("Login page permissions rendered", permissions);
    Geolocation.getCurrentPosition()
    .then((position) => {
      if(position &&( position?.coarseLocation == 'denied' || position?.location == 'denied')){
        present({
          message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
          duration: 5000,
          position: 'bottom',
        });
      }
      console.info("There will be no issue dashboard related to location. ", position);
    })
    .catch((error) => {
      present({
        message: `Error in fetching location, re-start app by veryfying permissions!`,
        duration: 5000,
        position: 'bottom',
      });
      console.error("There will be issue on dashboard related to location. ", error);
    });
  }

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('isLoggedIn');
    if (storedData === "true") {
      setIsLoggedIn(storedData);
      history.push('pages/tabs/Dashboard');
    }
  }, [history]);

  useEffect(() => {
    formValidation();
  }, [empid, mpin]);

  const saveToStorage = () => {
    // Save data to local storage
    localStorage.setItem('isLoggedIn', "true");
    // Update state
    setIsLoggedIn("true");
  };

  async function loginApi(formData) {
    try {
      // alert(formData);
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/login.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const formValidation = () => {
    if (empid != '' && mpin != '') {
      setBtnEnabled(true);
    } else if (btnEnabled) {
      setBtnEnabled(false);
    }
    console.log(btnEnabled);
  }

  const handleLogin = async () => {
    try {
      hitCheckPermissionsForGeolocation();
      // await takePhoto();
      const formData = new FormData();
      formData.append('empid', empid);
      formData.append('mpin', mpin);
      // formData.append('mobile', mobileNumber);
      formData.append('action', "login");
      formData.append('deviceId', deviceId);

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
          history.push('/pages/tabs/Dashboard');
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
        <CustomHeader />
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
              {simCardsFromDevice && simCardsFromDevice.length> 0 && <IonItem className='ion-margin-bottom'>
                <label>{getSimCardsToDisplay(simCardsFromDevice)}</label>
                {/* <IonInput
                  type="number"
                  disabled={true}
                  value={getSimCardsToDisplay(mobileNumber)}
                  placeholder={t('Mobile Number')}
                  // onIonInput={(e) => {
                  //   setMobileNumber(e.detail.value!);
                  // }}
                /> */}
              </IonItem>}
              <IonItem className='ion-margin-bottom'>
                <IonButton
                  disabled={!btnEnabled}
                  style={{ width: '100%' }}
                  expand="block"
                  color="primary"
                  size="default"
                  onClick={() => handleLogin()}>{t('Login')}</IonButton>
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

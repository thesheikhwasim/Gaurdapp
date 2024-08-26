import React, { useState, useEffect } from 'react';
import {
  IonButtons,
  IonList,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonCardSubtitle,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonModal,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  useIonToast,
  IonAlert,
  IonIcon,
  IonTextarea,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonRouter,
} from '@ionic/react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import '../utilities_constant';
import axios from 'axios';
import { Geolocation } from '@capacitor/geolocation';
import './Page.css';
import { PushNotifications } from '@capacitor/push-notifications';
import { registerNotifications } from '../utility/pushNotifications';
import { Sim } from '@jonz94/capacitor-sim';
import { Device } from '@capacitor/device';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { close, closeOutline, personCircleOutline } from 'ionicons/icons';
import { BASEURL } from '../utilities_constant';
import {Md5} from 'ts-md5';
const sampleSimCardNumber = [
  {
  carrierName : "airtel",
  isoCountryCode:"in",
  mobileCountryCode: "404",
  mobileNetworkCode : "10",
  number : "+91345345345435",
},
{
  carrierName : "jio",
  isoCountryCode:"in",
  mobileCountryCode: "404",
  mobileNetworkCode : "10",
  number : "91345345345",
}
]

const Login: React.FC = () => {
  const router = useIonRouter();
  const { t } = useTranslation();
  const { name } = useParams<{ name: string; }>();
  const history = useHistory();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setReqType] = useState('Forgot Password');
  const [empid, setUsername] = useState<string>('');
  const [mpin, setPassword] = useState<string>('');
  const [reqforgotmobile, setreqforgotmobile] = useState<any>('');
  const [mobileNumber, setMobileNumber] = useState<any>('');
  const [isLoggedIn, setIsLoggedIn] = useState<any>(null);
  const [btnEnabled, setBtnEnabled] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [sim1no, setsim1no] = useState<string>('');
  const [sim2no, setsim2no] = useState<string>('');
  const { photos, takePhoto } = usePhotoGallery();
  const [present, dismiss] = useIonToast();
  const [simCardsFromDevice, setSimCardsFromDevice] = useState([]);
  const [simonenumber, setsimonenumber] = useState('');
  const [simtwonumber, setsimtwonumber] = useState('');
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
    let tempSim = '';
    // return tempSim;

    if(simArr && simArr.length > 0){
      simArr.map((e, key) => {
        if(key == 0){
        
         
         
          tempSim = e.number;
           
        }else{
         
       
          
    
          tempSim = tempSim + ',' + e.number;
        }
      });
    }

    return tempSim;

  }

  async function hitCheckPermissionsForGeolocation (){
    const checkPermissions = await Geolocation.checkPermissions();
    console.log("Login page checkPermissions 0", checkPermissions);
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
      router.push('/pages/tabs/Dashboard', 'forward', 'replace');
    }
  }, [history]);

  useEffect(() => {
    formValidation();
  }, [empid, mpin,mobileNumber]);

  const saveToStorage = () => {
    // Save data to local storage
    localStorage.setItem('isLoggedIn', "true");
    // Update state
    setIsLoggedIn("true");
  };

  async function loginApi(formData) {
    try {
      // alert(formData);
      const response = await axios.post(BASEURL+'login.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const formValidation = () => {
    if (empid != '' && mpin != '' && mobileNumber !='') {
      setBtnEnabled(true);
    } else if (btnEnabled) {
      setBtnEnabled(false);
    }
    console.log(btnEnabled);
  }

  const handleLogin = async () => {
    const storedLang = localStorage.getItem('language');
    try {
      hitCheckPermissionsForGeolocation();
      // await takePhoto();
      const formData = new FormData();
      formData.append('empid', empid);
      formData.append('mpin', Md5.hashStr(mpin));
      formData.append('mobile', mobileNumber);
      formData.append('action', "login");
      formData.append('deviceId', deviceId);
      formData.append('language', storedLang);
if(simCardsFromDevice && simCardsFromDevice.length> 0)
{
  
  const simdetail =  getSimCardsToDisplay(simCardsFromDevice);
  const simArray = simdetail.split(",");
  if(simCardsFromDevice.length==1)
  {
    simArray[1]='';
  }
 
if(simArray.length>0 && simArray[0]==='' && simArray[1]==='')
{
  const response = await loginApi(formData);

  if (response) {

    if (response.success) {
      saveToStorage();


      localStorage.setItem('loggedInUser', JSON.stringify(response.employee_data));
      localStorage.setItem('token', response.token);
      router.push('/pages/tabs/Dashboard', 'forward', 'replace');
    
    } else {
      alert(response.message || 'Wrong User Name or Password');
    }
  } else {
    alert('Wrong User Name or Password');
  }
   
}
else
{

 
  if ((simArray[0]!='' &&  (simArray[0]===('91'+mobileNumber) || simArray[0]===(mobileNumber))) || (simArray[1]!="" &&  (simArray[1]===('91'+mobileNumber) || simArray[1]===(mobileNumber))))
  {
    
    const response = await loginApi(formData);

  if (response) {

    if (response.success) {
      saveToStorage();


      localStorage.setItem('loggedInUser', JSON.stringify(response.employee_data));
      localStorage.setItem('token', response.token);
      router.push('/pages/tabs/Dashboard', 'forward', 'replace');
    
    } else {
      alert(response.message || 'Wrong User Name or Password');
    }
  } else {
    alert('Wrong User Name or Password');
  }
  }
  else
  {
    alert('Your Mobile Number not Matching with Device Mobile Number. Please use the same device');
    }
}
}
else
{
 
  const response = await loginApi(formData);
  if (response) {

    if (response.success) {
      saveToStorage();


      localStorage.setItem('loggedInUser', JSON.stringify(response.employee_data));
      localStorage.setItem('token', response.token);
      router.push('/pages/tabs/Dashboard', 'forward', 'replace');
    
    } else {
      alert(response.message || 'Wrong User Name or Password');
    }
  } else {
    alert('Wrong User Name or Password');
  }
 
}
   
    } catch (error) {
      console.error('Error:', error);
    }
  };

//+response.data.employee_data.New_MPIN

  const handleForgotPassword = () => {
    const formData = new FormData();
    formData.append('action', 'forgot_password');
    formData.append('reqforgotmobile', reqforgotmobile);
      axios
      .post(BASEURL+'forgotpassword.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
        
          present({
            message: `Your New MPIN request has been created successfully!  `,
            duration: 1000,
            position: 'top',
          });
          setShowRequestModal(false);
          setreqforgotmobile('');
         
        } else {
          present({
            message: `Failed to Generate New MPIN request. Please try again.`,
            duration: 2000,
            position: 'top',
          });
        }
      })
      .catch((error) => {
        console.error(`Error creating ${reqType} request:`, error);
        present({
          message: `An error occurred. Please try again.`,
          duration: 2000,
          position: 'top',
        });
      });
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
             {/*  {simCardsFromDevice && simCardsFromDevice.length> 0 && <IonItem className='ion-margin-bottom'>
                <label>{getSimCardsToDisplay(simCardsFromDevice)}</label>
                <IonInput
                  type="number"
                  disabled={true}
                  value={getSimCardsToDisplay(mobileNumber)}
                  placeholder={t('Mobile Number')}
                  // onIonInput={(e) => {
                  //   setMobileNumber(e.detail.value!);
                  // }}
                /> 
              </IonItem>}*/}
              <IonItem className='ion-margin-bottom'>
                <IonButton
                  disabled={!btnEnabled}
                  style={{ width: '100%' }}
                  expand="block"
                  color="primary"
                  size="default"
                  onClick={() => handleLogin()}>{t('Login')}</IonButton>
              </IonItem>

              <IonItem className='ion-margin-bottom'>
              <IonButton expand="block" color="danger" onClick={() => { setReqType('sos'); setShowRequestModal(true); }}>{t('Forgot Password?')}
                </IonButton>
              
              </IonItem>

            </IonList>
          </IonCardContent>
        </IonCard>

        <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{'Generate New MPIN'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowRequestModal(false)}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Enter Your Registered Mobile No</IonLabel>
                <IonInput type='number' value={reqforgotmobile} onIonChange={e => setreqforgotmobile(e.detail.value!)}
                      onIonInput={(e) => {
                        setreqforgotmobile(e.detail.value!);
                      }}
                  ></IonInput>
              </IonItem>
           
                  </IonList>
            <IonButton expand="full" onClick={handleForgotPassword}>{'Submit'}</IonButton>
          </IonContent>
        </IonModal>

        <div className='footer'>
        <CustomFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

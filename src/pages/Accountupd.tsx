import {
  IonButtons,
  IonList,
  IonContent,
  IonHeader,
  IonMenuButton,
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
  IonRefresher,
  IonSpinner,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';

import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';

const Dashboard: React.FC = () => {
  const [duty, setDuty] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const token = localStorage.getItem('token');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [prevLatitude, setPrevLatitude] = useState('');
  const [prevLongitude, setPrevLongitude] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [present, dismiss] = useIonToast();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setReqType] = useState('sos');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqOtherDetail, setReqOtherDetail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dutystartinfo, setdutystartinfo] = useState<any>(null);
  const [ProfileData, setProfileData] = useState<any>({});
  const [reloader, setReloader] = useState(false);
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');

    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
    if (storedToken) {
      ongoingNewHandlerWithLocation();
     
    }
  }, []);

  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const { takePhoto } = usePhotoGallery();


  const fetchProfileData = async (dataParam) => {
    const url = BASEURL+'profile.php';
    const formData = new FormData();
    formData.append('action', 'profile_data');
    formData.append('token', localStorage.getItem('token'));
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.employee_data) {
        setProfileData(response.data.employee_data);
      }
      // else {
      //   history.push('/pages/login');
      // }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // history.push('/pages/login');
    } finally {
      setLoading(false);
    }
  };

  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
        setLocationPermissionchk(true);
 
       
        fetchProfileData(res);

      }else{
        setLocationPermissionchk(false);


        setTimeout(async() => {
        
          window.location.reload();
        }, 500);
      
      }
    }).catch((error)=>{
     
  
    });
  }



  const captureLocation = (fromParam:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        console.log("PERMISSION to show message and send DUMMY", permissions);
        console.log("ABOVE PERMISSION WAS ASKED FROM--- ", fromParam);
        // Case to validate permission is denied, if denied error message alert will be shown
        if (permissions?.location == "denied") {
          setLocationPermissionchk(false);
           present({
            message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
            duration: 500,
            position: 'bottom',
          });
      
        }
        else
        {
          setLocationPermissionchk(true);
        }

        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        Geolocation.getCurrentPosition(options)
          .then((position) => {
            if (position && position.coords.latitude) {
              // console.log("CAPTURE LOCATION is setting lat long:::: ",position.coords.latitude.toString(), "-- longitude--", position.coords.longitude.toString());
              setLatitude(position.coords.latitude.toString());
              setLongitude(position.coords.longitude.toString());
            }
            resolve(position);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
   
    setTimeout(() => {
      ongoingNewHandlerWithLocation();
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
  }
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

      <IonContent className="page-content">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <div className="content">
          <div className="header_title">
            <IonTitle className="header_title ion-text-center">{t('Welcome')} {loggedInUser?.full_name}</IonTitle>
          </div>
          <IonCard className="shift-details-card profilepage">
          {!locationPermissionchk ? (
             <><div className='errorDashboardData'>
             <IonSpinner name="lines"></IonSpinner>
             <i style={{ marginLeft: '10px', color: '#000' }}>
               {!locationPermissionchk ? (<>{`Check device’s GPS Location Service Enable it manually`}</>) : (<>
                
               </>)}
 
             </i>
           </div></>
         ) :(<>
            <IonCardHeader>
              <IonCardTitle>{t('Your Profile Detail')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="shift-details-card-content">
              <div className="shift-details-column">
                <div>
                {ProfileData?.photo && <div className='profileImageParentSh'>
        <div>
        <IonImg
          className='imageionclass'
          src={BASEURL+`emp_image/${ProfileData.photo}`}
        ></IonImg>
        </div>
      </div>}
                </div>
                <p><strong>{t('Full Name')}:</strong> <span>{ProfileData?.full_name}</span></p>
                <p><strong>{t('Roll Number')}:</strong><span> {ProfileData?.roll_no}</span></p>
                <p><strong>{t('Emp ID')}:</strong> <span>{ProfileData?.emp_id}</span></p>
                <p><strong>{t('Designation')}:</strong><span> {ProfileData?.designation}</span></p>
               {/* <p><strong>State:</strong><span> {ProfileData?.recruit_state}</span></p>*/}
                <p><strong>{t('Mobile Number')}:</strong> <span>{ProfileData?.reg_mobile_no}</span></p>
                {/*<p><strong>Current Status:</strong><span> {ProfileData?.emp_status}</span></p>*/}
                <p><strong>{t('DOB')}:</strong><span> {ProfileData?.dob}</span></p>
                <p><strong>{t('Registration Date')}:</strong><span> {ProfileData?.reg_date} </span></p>
               {/* <p><strong>DOJ:</strong><span> {ProfileData?.doj}</span></p>
                <p><strong>Id Card Valid UPTO:</strong><span>{ProfileData?.id_card_valid_upto}</span></p>
                <p><strong>Mobile Verified:</strong><span> {ProfileData?.mobile_verified} </span></p>
                
                <p><strong>Last Updated On:</strong> <span>{ProfileData?.last_updated_on}</span></p>
                <p><strong>Aadhar No:</strong> {ProfileData?.aadhar_no}</p>*/}
              </div>
            </IonCardContent>
            </>)}
          </IonCard>
        </div>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>
  );
};

export default Dashboard;

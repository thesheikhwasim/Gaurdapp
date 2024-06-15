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

const Dashboard: React.FC = () => {
  const [duty, setDuty] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const token = localStorage.getItem('token');
  const [Latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [prevLatitude, setPrevLatitude] = useState('');
  const [prevLongitude, setPrevLongitude] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
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
  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
    if (storedToken) {
      fetchProfileData(storedToken);
    }
  }, []);

  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const { takePhoto } = usePhotoGallery();


  const fetchProfileData = async (token: string) => {
    const url = 'https://guard.ghamasaana.com/guard_new_api/profile.php';
    const formData = new FormData();
    formData.append('action', 'profile_data');
    formData.append('token', token);

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














  


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg
            className="header-image"
            src="./assets/imgs/logo.jpg"
            alt="header"
            style={{ display: 'flex', height: '60px', width: '100%' }}
          />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="page-content">
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <div className="content">
          <div className="header_title">
        <IonTitle className="header_title ion-text-center">Welcome {loggedInUser?.full_name}</IonTitle>
      </div>
          <IonCard className="shift-details-card profilepage">

            <IonCardHeader>
              <IonCardTitle>{t('Your Profile Detail')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="shift-details-card-content">
              <div className="shift-details-column">
                <p><strong>Full Name:</strong> <span>{ProfileData?.full_name}</span></p>
                <p><strong>Roll Number:</strong><span> {ProfileData?.roll_no}</span></p>
                <p><strong>Emp ID:</strong> <span>{ProfileData?.emp_id}</span></p>
                <p><strong>Designation:</strong><span> {ProfileData?.designation}</span></p>
                <p><strong>State:</strong><span> {ProfileData?.recruit_state}</span></p>
                <p><strong>Mobile Number:</strong> <span>{ProfileData?.reg_mobile_no}</span></p>
                <p><strong>Current Status:</strong><span> {ProfileData?.emp_status}</span></p>
                <p><strong>DOB:</strong><span> {ProfileData?.dob}</span></p>
                <p><strong>DOJ:</strong><span> {ProfileData?.doj}</span></p>
                <p><strong>Id Card Valid UPTO:</strong><span>{ProfileData?.id_card_valid_upto}</span></p>
                <p><strong>Mobile Verified:</strong><span> {ProfileData?.mobile_verified} </span></p>
                <p><strong>Registeration Date:</strong><span> {ProfileData?.reg_date} </span></p>
                <p><strong>Last Updated On:</strong> <span>{ProfileData?.last_updated_on}</span></p>
                <p><strong>Aadhar No:</strong> {ProfileData?.aadhar_no}</p>
               
              </div>
           
            </IonCardContent>
             </IonCard>

  

    

       
        </div>
      </IonContent>
      <div className="footer">
        <IonTitle className="footer ion-text-center">Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    </IonPage>
  );
};

export default Dashboard;

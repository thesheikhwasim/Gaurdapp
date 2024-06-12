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
          <IonCard className="shift-details-card">

            <IonCardHeader>
              <IonCardTitle>{t('Your Profile Detail')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="shift-details-card-content">
              <div className="shift-details-column">
                <p><strong>Full Name:</strong> {ProfileData?.full_name}</p>
                <p><strong>Roll Number:</strong> {ProfileData?.roll_no}</p>
                <p><strong>Emp ID:</strong> {ProfileData?.emp_id}</p>
                <p><strong>Designation:</strong> {ProfileData?.designation}</p>
                <p><strong>State:</strong> {ProfileData?.recruit_state}</p>
                <p><strong>Mobile Number:</strong> {ProfileData?.reg_mobile_no}</p>
                <p><strong>Current Status:</strong> {ProfileData?.emp_status}</p>
                <p><strong>DOB:</strong> {ProfileData?.dob}</p>
                <p><strong>DOJ:</strong> {ProfileData?.doj}</p>
                <p><strong>Id Card Valid UPTO:</strong> {ProfileData?.id_card_valid_upto}</p>
                <p><strong>Mobile Verified:</strong> {ProfileData?.mobile_verified}</p>
                <p><strong>Registeration Date:</strong> {ProfileData?.reg_date}</p>
                <p><strong>Last Updated On:</strong> {ProfileData?.last_updated_on}</p>
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

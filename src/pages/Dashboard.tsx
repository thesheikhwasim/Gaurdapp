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
  const [Longitude, setLongitude] = useState('');
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
  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
    if (storedToken) {
      fetchOngoingDuty();
    }
  }, []);

  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const { takePhoto } = usePhotoGallery();

  const fetchOngoingDuty = async () => {
    try {
      const formData = new FormData();
      formData.append('action', 'duty_ongoing');
      formData.append('token', token);

      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/ongoing_duty.php', formData);
      const data = response.data;

      if (data.success && data.employee_data.duty_ongoing_info && data.employee_data.duty_ongoing_info.duty_end_date === null) {
        setDuty(true);
        setIsRunning(true);
        setElapsedTime(convertRemainingTime(data.employee_data.remaining_time));
       // actuastart?.innerHTML('')=data.employee_data.duty_ongoing_info.duty_start_date;
       setdutystartinfo(data.employee_data.duty_ongoing_info);
       const today = new Date();
   
       var delta = Math.abs(today - data.employee_data.duty_ongoing_info.duty_start_date) / 1000;
       

       var days = Math.floor(delta / 86400);
       delta -= days * 86400;
       var hours = Math.floor(delta / 3600) % 24;
       delta -= hours * 3600;
       var minutes = Math.floor(delta / 60) % 60;
       delta -= minutes * 60;
       var seconds = delta % 60;

       intervalRef.current = setInterval(() => {
          setElapsedTime((prevTime) => prevTime - 1);
        }, 1000);
        
      }
    } catch (error) {
      console.error('Error fetching ongoing duty:', error);
    }
  };

  const convertRemainingTime = (remainingTime) => {
    const [days, hours, minutes, seconds] = remainingTime
      .split('-')
      .map((timePart) => parseInt(timePart.replace(/[^\d]/g, ''), 10));
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  };

  const captureLocation = () => {
    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition()
          .then((position) => {
            if (position && position.coords.latitude) {
              setLatitude(position.coords.latitude.toString());
              setLongitude(position.coords.longitude.toString());
            }
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  async function dutyApi(formData, dutyEnd) {
    try {
      const response = dutyEnd
        ? await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystop.php', formData)
        : await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystart.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async function dutyMovementApi() {
    try {
      if (Latitude !== prevLatitude || Longitude !== prevLongitude) {
        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('action', 'duty_movement');
        formData.append('token', token);
        formData.append('latitude', Latitude);
        formData.append('longitude', Longitude);

        const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystartmovement.php', formData);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleDutyStart = async () => {
    captureLocation().then(() => {
      if (Latitude !== '') {
      

        takePhoto().then(() => {
          
          const formData = new FormData();
          const token = localStorage.getItem('token');
          formData.append('action', 'punch_in');
          formData.append('token', token);
          formData.append('latitude', Latitude);
          formData.append('longitude', Longitude);
          dutyApi(formData, false)
            .then((response) => {
              if (response && response.success) {
                intervalRef.current = setInterval(() => {
                  setElapsedTime((prevTime) => prevTime + 1);
                }, 1000);
                setIsRunning(true);

                // Call duty movement API
                dutyMovementApi().then((movementResponse) => {
                  if (movementResponse && !movementResponse.success) {
                    setAlertMessage(movementResponse.message);
                    setShowAlert(true);
                  } else {
                    // Update previous location only if API call was successful
                    setPrevLatitude(Latitude);
                    setPrevLongitude(Longitude);
                  }
                });
              } else if (response.success === false) {
                setAlertMessage(response.message);
                setShowAlert(true);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
      } else {
        setAlertMessage('Something went wrong getting your location, Try again');
        setShowAlert(true);
      }
    });
  };

  const handleDutyEnd = async () => {
    clearInterval(intervalRef.current);
    captureLocation().then(() => {
      if (Latitude !== '') {
        takePhoto().then(() => {
          const formData = new FormData();
          const token = localStorage.getItem('token');
          formData.append('action', 'punch_out');
          formData.append('token', token);
          formData.append('latitude', Latitude);
          formData.append('longitude', Longitude);
          formData.append('duty_end_verification', 'Face_Recognition');
          formData.append('end_verification_status', 'Approved');

          dutyApi(formData, true)
            .then((response) => {
              if (response && response.success) {
                setIsRunning(false);
              } else if (response.success === false) {
                setAlertMessage(response.message);
                setShowAlert(true);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
      } else {
        setAlertMessage('Something went wrong getting your location, Try again');
        setShowAlert(true);
      }
    });
  };

  const handleCreateRequest = () => {
    const formData = new FormData();
    formData.append('action', 'add_new_request');
    formData.append('token', token);
    formData.append('reqtype', reqType);
    formData.append('reqsubject', reqSubject);
    formData.append('ReqDesc', reqDesc);
    formData.append('reqotherdetail', reqOtherDetail);

    axios
      .post('https://guard.ghamasaana.com/guard_new_api/add_new_request.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          present({
            message: `Your ${reqType} request has been created successfully!`,
            duration: 2000,
            position: 'top',
          });
          setShowRequestModal(false);
          setReqSubject('');
          setReqDesc('');
          setReqOtherDetail('');
        } else {
          present({
            message: `Failed to create ${reqType} request. Please try again.`,
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

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        <IonTitle className="header_title ion-text-center">{t('Welcome')} {loggedInUser?.full_name}</IonTitle>
      </div>
          <IonCard className="shift-details-card">

            <IonCardHeader>
              <IonCardTitle>{t('Your Current Duty Detail')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="shift-details-card-content">
              <div className="shift-details-column">
                <p><strong>Client Name:</strong> {loggedInUser?.client_name}</p>
                <p><strong>Site Name & Address:</strong> <span className='text-right'>{loggedInUser?.site_name}, {loggedInUser?.site_city}, {loggedInUser?.site_state}</span></p>
                <p><strong>Site Status:</strong> {loggedInUser?.site_status}</p>
              </div>
              <div className="shift-details-column">
                <p><strong>Authorized Shift:</strong> {loggedInUser?.auth_shift}</p>
                <p><strong>Shift Start Time:</strong> {loggedInUser?.shift_start_time}</p>
                <p><strong>Shift End Time:</strong> {loggedInUser?.shift_end_time}</p>
                {isRunning ? (
                 <p><strong>Duty Started On :</strong>{dutystartinfo?.duty_start_date} </p>
                  ) : ('')}

              </div>
            </IonCardContent>
            <IonGrid className="ion-text-center">
              <IonRow>
                <IonCol size="12">
                  {isRunning ? (
                    <IonButton expand="block" onClick={handleDutyEnd} color="danger">
                      {t('punchOut')}
                    </IonButton>
                  ) : (
                    <IonButton expand="block" onClick={handleDutyStart} color="primary">
                      {t('punchIn')}
                    </IonButton>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>

          <IonGrid className="ion-margin ion-text-center">
            <IonRow>
              <IonCol size="4" size-md="4" size-lg="4">
                <IonButton expand="block" color="secondary" onClick={() => { setReqType('ticket'); setShowRequestModal(true); }}>{t('ticket')}</IonButton>
              </IonCol>
              <IonCol size="4" size-md="4" size-lg="4">
                <IonButton expand="block" color="warning" onClick={() => { setReqType('leaveapplication'); setShowRequestModal(true); }}>{t('leave')}</IonButton>
              </IonCol>
              <IonCol size="4" size-md="4" size-lg="4">
                <IonButton expand="block" color="danger" onClick={() => { setReqType('sos'); setShowRequestModal(true); }}>{t('sos')}</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Alert'}
            message={alertMessage}
            buttons={['OK']}
          />

          <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{reqType === 'sos' ? 'Create SOS Request' : reqType === 'leaveapplication' ? 'Create Leave Request' : 'Create Ticket'}</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowRequestModal(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Subject</IonLabel>
                  <IonInput value="{reqSubject}" onIonChange={e => setReqSubject(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Description</IonLabel>
                  <IonInput value={reqDesc} onIonChange={e => setReqDesc(e.detail.value!)}></IonInput>
                </IonItem>
                {reqType === 'leaveapplication' ? (
                  <IonItem>
                    <IonLabel position="floating">Other Details (From - To Date)</IonLabel>
                    <IonInput value={reqOtherDetail} onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>
                  </IonItem>
                ) : reqType === 'ticket' ? (
                  <IonItem>
                    <IonLabel>Priority</IonLabel>
                    <IonSelect value={priority} onIonChange={e => setPriority(e.detail.value)}>
                      <IonSelectOption value="LOW">Low</IonSelectOption>
                      <IonSelectOption value="MEDIUM">Medium</IonSelectOption>
                      <IonSelectOption value="HIGH">High</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                ) : null}
              </IonList>
              <IonButton expand="full" onClick={handleCreateRequest}>Create {reqType === 'ticket' ? 'Ticket' : reqType === 'leaveapplication' ? 'Leave Request' : 'SOS Request'}</IonButton>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
      <div className="footer">
        <IonTitle className="footer ion-text-center">Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    </IonPage>
  );
};

export default Dashboard;

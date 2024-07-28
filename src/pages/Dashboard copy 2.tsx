import { IonButtons, IonList, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow, IonModal, IonLabel, IonItem, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import { useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import './Page.css';
import CustomHeader from './CustomHeader';

const Dashboard: React.FC = () => {
  const [duty, setDuty] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [token, setToken] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [present, dismiss] = useIonToast();

  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    if (storedData) {
      setLoggedInUser(storedData);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { name } = useParams<{ name: string; }>();
  const { t } = useTranslation();
  const { takePhoto } = usePhotoGallery();

  const captureLocation = () => {
    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition().then((position) => {
          if (position && position.coords.latitude) {
            setLatitude(JSON.stringify(position.coords.latitude));
            setLongitude(JSON.stringify(position.coords.longitude));
          }
          resolve(); 
        }).catch(error => {
          reject(error); 
        });
      } catch (error) {
        reject(error); 
      }
    });
  };

  async function dutyStartApi(formData) {
    try {
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystart.php', formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleDutyStart = async () => {
    captureLocation()
      .then(() => {
        if (latitude !== '') {
          const formData = new FormData();
          formData.append('action', "punch_in");
          formData.append('token', token);
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          dutyStartApi(formData)
            .then(response => {
              if (response && response.success) {
                takePhoto();
                intervalRef.current = setInterval(() => {
                  setElapsedTime((prevTime) => prevTime + 1);
                }, 1000);
                setIsRunning(true);
              } else if (response.success === false) {
                alert(response.message);
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } else {
          alert("Something went wrong getting your location, Try again");
        }
      });
  }

  const handleDutyEnd = () => {
    clearInterval(intervalRef.current);
    captureLocation();
    setIsRunning(false);
  }

  const handleCreateTicket = () => {
    const formData = new FormData();
    formData.append('action', 'createTicket');
    formData.append('token', "6129cb48639158eaacceebfd7e5cbc358fe3cfc0fc9f8342aca037de99fb133c");
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('priority', priority);

    axios.post('https://guard.ghamasaana.com/admin/ticket.php', formData)
      .then(response => {
        if (response.data && response.data.success) {
          present({
            message: 'Your ticket has been created successfully!',
            duration: 2000,
            position: 'top',
          });
          setShowModal(false);
          setSubject('');
          setMessage('');
          setPriority('LOW');
        } else {
          present({
            message: 'Failed to create ticket. Please try again.',
            duration: 2000,
            position: 'top',
          });
        }
      })
      .catch(error => {
        console.error('Error creating ticket:', error);
        present({
          message: 'An error occurred. Please try again.',
          duration: 2000,
          position: 'top',
        });
      });
  }

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
          <CustomHeader />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <IonCard color="medium" className='ion-margin-bottom ion-text-center'>
          <IonCardHeader>
            <IonCardTitle>Dashboard</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonGrid className='ion-margin ion-text-center'>
          <IonRow>
            {isRunning ? (
              <IonCol size="12" size-md="12" size-lg="6"><IonTitle>{t('Elapsed Time')}: {formatTime(elapsedTime)}</IonTitle></IonCol>
            ) : (
              <IonCol size="6" size-md="12" size-lg="6"><IonTitle>{t('shiftTimingDetails')}</IonTitle></IonCol>
            )}
            <IonCol size="6" size-md="4" size-lg="6">
              {isRunning ? (
                <IonButton onClick={() => handleDutyEnd()} color="danger" shape='round' size="small">{t('punchOut')}</IonButton>
              ) : (
                <IonButton onClick={() => handleDutyStart()} color="secondary" shape='round' size="small">{t('punchIn')}</IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid className='ion-margin ion-text-center'>
          <IonRow>
            <IonCol size="4" size-md="4" size-lg="4">
              <IonButton color="secondary" onClick={() => setShowModal(true)}>{t('Request')}</IonButton>
            </IonCol>
            <IonCol size="4" size-md="4" size-lg="4"><IonButton color="warning">{t('leave')}</IonButton></IonCol>
            <IonCol size="4" size-md="4" size-lg="4"><IonButton color="danger">{t('sos')}</IonButton></IonCol>
          </IonRow>
        </IonGrid>
        <div className='footer'>
          <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create Ticket</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Subject</IonLabel>
                <IonInput value={subject} onIonChange={e => setSubject(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Message</IonLabel>
                <IonInput value={message} onIonChange={e => setMessage(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Priority</IonLabel>
                <IonSelect value={priority} onIonChange={e => setPriority(e.detail.value)}>
                  <IonSelectOption value="LOW">Low</IonSelectOption>
                  <IonSelectOption value="MEDIUM">Medium</IonSelectOption>
                  <IonSelectOption value="HIGH">High</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={handleCreateTicket}>Create Ticket</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

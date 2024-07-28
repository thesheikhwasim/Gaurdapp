import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonCol, IonGrid, IonRow, IonDatetime, IonFooter, IonList, IonItem, IonProgressBar} from '@ionic/react';
import { useParams } from 'react-router';
import { archiveOutline, archiveSharp, bookmarkOutline, cameraOutline, documentAttachOutline, fingerPrintOutline, folderOpenOutline, handLeftOutline, heartOutline, heartSharp, logInOutline, mailOutline, mailSharp, mapOutline, newspaperOutline, paperPlaneSharp, thumbsUpOutline, trashOutline, trashSharp, warningOutline, warningSharp, calendarClearOutline, informationCircleOutline, personCircleOutline, paperPlaneOutline, addCircleOutline, notificationsOutline, alertCircleOutline, personAddOutline, languageOutline, logOutOutline } from 'ionicons/icons';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import ExploreContainer from '../components/ExploreContainer';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import { Geolocation, Position } from '@capacitor/geolocation';
import axios from 'axios';

import './Page.css';
import { log } from 'console';
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

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedData = localStorage.getItem('loggedInUser');

    const storedToken = localStorage.getItem('token');
    console.log(localStorage);
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
  let res;

  // const captureLocation = async () => {
  //   try {
  //     // const status = await Geolocation.requestPermissions();

  //     const position: Position = await Geolocation.getCurrentPosition();
  //     console.log('Current Position:', position);

  //     if (position && position.coords.latitude) {
  //       setLatitude(JSON.stringify(position.coords.latitude));
  //       setLongitude(JSON.stringify(position.coords.longitude));
  //     }

  //   } catch (error) {
  //     console.error('Error getting location', error);
  //   }
  // };

  const captureLocation = () => {
    return new Promise((resolve, reject) => {
      try {
        Geolocation.getCurrentPosition().then((position) => {
          console.log('Current Position:', position);
          
          if (position && position.coords.latitude) {
            setLatitude(JSON.stringify(position.coords.latitude));
            setLongitude(JSON.stringify(position.coords.longitude));
          }
          
          resolve(); // Resolve the promise since the operation succeeded
        }).catch(error => {
          console.error('Error getting location', error);
          reject(error); // Reject the promise if there's an error
        });
      } catch (error) {
        console.error('Error getting location', error);
        reject(error); // Reject the promise if there's an error
      }
    });
  };

  async function dutyStartApi(formData) {
    try {
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystart.php', formData);

  // const response = await axios.post('https://guard.ghamasaana.com/admin/dutystart.php', formData);
      console.log(response.data); 
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }


  const handleDutyStart = async () => {
    captureLocation()
      .then(() => {
        if (latitude != '') {
          console.log("token",token);
          
          // const userToken = JSON.parse(token);
          const formData = new FormData();
          formData.append('action', "punch_in");
          formData.append('token', token);

          formData.append('latitude', latitude);
          formData.append('longitude', longitude);
    
          // formData.append('latitude', "13.827513");
          // formData.append('longitude', "77.493152");
          // const response = await axios.post('https://guard.ghamasaana.com/admin/dutystart.php', formData);
    
          // console.log(response);

          dutyStartApi(formData)
          .then(response => {
            if (response && response.success == true) {
              res = takePhoto();
              intervalRef.current = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
              }, 1000);
              setIsRunning(true);
            } else if (response.success == false){
              alert(response.message)
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
  
        } else {
          alert("Something went wrong getting your location, Try again");
        }
      })
    
    
    

    // setDuty(true);
  }

  const handleDutyEnd = () => {
    clearInterval(intervalRef.current);
    captureLocation();
    setIsRunning(false);
    // setDuty(false);
  }

  const emp = {
    username: "1000",
    password: "12345",
    name: "Dummy Guard",
    mobile: 8090096328,
    email: "dummy@guard.com",
    address: "6777, First Floor, Indira Nagar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: 226010
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return formattedTime;
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
        <IonHeader  collapse="condense">
        <IonTitle>{name}</IonTitle>
        </IonHeader>        
        <IonCard color="medium" className='ion-margin-bottom ion-text-center'>
        <IonCardHeader>
          {/* <IonCardTitle>{loggedInUser != '' && 
          (JSON.parse(loggedInUser).FullName + " " + JSON.parse(loggedInUser).RollNo)
          }</IonCardTitle>          */}
           <IonCardTitle>Dashboard</IonCardTitle>    

        </IonCardHeader>
      </IonCard>
      <IonGrid className='ion-margin ion-text-center'>
        <IonRow>
          {/* <IonCol size="6" size-md="4" size-lg="6"><IonTitle>Shift Timing Details</IonTitle></IonCol> */}

          {isRunning ? (
            <IonCol size="12" size-md="12" size-lg="6"><IonTitle>{t('Elapsed Time')}: {formatTime(elapsedTime)}</IonTitle></IonCol>
          ) : (
            <IonCol size="6" size-md="12" size-lg="6"><IonTitle>{t('shiftTimingDetails')}</IonTitle></IonCol>
          )}
          {/* <IonCol size="6" size-md="4" size-lg="6"><IonButton color="secondary" shape='round' size="small">Punch In</IonButton></IonCol> */}
          <IonCol size="6" size-md="4" size-lg="6">
        
            {isRunning ? (
            <IonButton onClick={() => handleDutyEnd()} color="danger" shape='round' size="small">{t('punchOut')}</IonButton>
            ) : 
            (
              <IonButton onClick={() => handleDutyStart()} color="secondary" shape='round' size="small">{t('punchIn')}</IonButton>
            )}
            {/* <IonButton onClick={() => handleDutyStart()} color="secondary" shape='round' size="small">{t('punchIn')}</IonButton> */}
          </IonCol>

        </IonRow>
      </IonGrid>
      {/* <IonList >
        <IonItem className='ion-margin ion-text-center'>
      <IonDatetime className='ion-margin ion-text-center'
              presentation="date"
              // value="2024-02-01"
              highlightedDates={[
                {
                  date: '2024-02-05',
                  textColor: '#800080',
                  backgroundColor: '#FF0000',
                },
                {
                  date: '2024-02-06',
                  textColor: '#09721b',
                  backgroundColor: '#90EE90',
                },
                {
                  date: '2024-02-07',
                  textColor: '#09721b',
                  backgroundColor: '#90EE90',
                },
                {
                  date: '2024-02-08',
                  textColor: '#09721b',
                  backgroundColor: '#90EE90',
                },
              ]}
            ></IonDatetime>
            </IonItem>
            {
              isRunning ? (
                <IonItem className='ion-margin ion-text-center'>
                  <IonTitle size='small'>10:00am</IonTitle>
                    <IonProgressBar value={0.25} buffer={0.5}></IonProgressBar>
                  <IonTitle size='small'>07:00pm</IonTitle>
              </IonItem>
              ) : null
            }
            </IonList>       */}
      <IonGrid className='ion-margin ion-text-center'>
        <IonRow>
          
          <IonCol size="4" size-md="4" size-lg="4"><IonTitle><IonButton color="secondary">{t('ticket')}</IonButton></IonTitle></IonCol>
          <IonCol size="4" size-md="4" size-lg="4"><IonButton color="warning">{t('leave')}</IonButton></IonCol>
          <IonCol size="4" size-md="4" size-lg="4"><IonButton color="danger">{t('sos')}</IonButton></IonCol>
        </IonRow>
      </IonGrid>
      <div className='footer'>
    <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    {/* <IonFooter style={{"background-color": "yellow"}}>
        <IonToolbar className="footer">
          <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
          <IonImg class='header-image' src="./assets/imgs/footer.jpg" alt="header" style={{display:'flex',height:'100px',width:'100%',margin:'7px'}}/> 
        </IonToolbar>
      </IonFooter> */}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

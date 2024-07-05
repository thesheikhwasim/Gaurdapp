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
  IonIcon,
  IonTextarea,
} from '@ionic/react';

import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

import { useParams } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth';
import { close, closeOutline, personCircleOutline } from 'ionicons/icons';
import MyStopwatch from './DashboardMyTimer';

const DashboardComp: React.FC = ({onLocalStorageChange}) => {
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
  const [dutyDetailsFromOngoingDuty, setDutyDetailsFromOngoingDuty] = useState<any>({});
  const [inRange, SetInRange] = useState<boolean>(true);
  const [inAlert, SetInAlert] = useState<boolean>(false);
  const [movementAlertMessage, SetMovementAlertMessage] = useState<string>('');
  const [elapsedState, setElapsedState] = useState<number>(0);
  const [alertModal, setAlertModal] = useState(false);
  const [alertReplyInput, setAlertReplyInput] = useState('');

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

  useEffect(() => {
    captureLocation().then((res) => {
      dutyMovementHandler();
    });
  }, [elapsedTime])

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

      // Case to validate API was success and employee data is available
      if (data?.success && data?.employee_data) {
        setDutyDetailsFromOngoingDuty(data.employee_data);

        // Case to validate start date is available which is responsible to show Duty timer
        if(data?.employee_data && data?.employee_data?.duty_ongoing_info && data?.employee_data?.duty_ongoing_info?.duty_start_date){
          let past = new Date(data?.employee_data?.duty_ongoing_info?.duty_start_date);
          // assigning present time to new variable 
          let now = new Date();
          let elapsed = (now - past);
          setElapsedState(elapsed / 1000);
        }
      }

      //Case to validate if page was refreshed/reloaded and ongoing duty is mapped
      if (data.success && data.employee_data.duty_ongoing_info && data.employee_data.duty_ongoing_info.duty_end_date === null) {
        setDuty(true);
        setIsRunning(true);
        setElapsedTime(convertRemainingTime(data.employee_data.remaining_time));
        setdutystartinfo(data.employee_data.duty_ongoing_info);
        if(intervalRef.current == null){
          intervalRef.current = setInterval(() => {
            setElapsedTime((prevTime) => prevTime - 1);
          }, 5000);
        }
      } else {
        console.log("Ongoing re-fetched else case, check when there is difference after refresh ");
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
    return new Promise(async(resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        console.log("PERMISSION", permissions);
        // Case to validate permission is denied, if denied error message alert will be shown
        if(permissions?.location == "denied"){
          present({
            message: `"Location permission is denied, kindly enable from settings.`,
            duration: 2000,
            position: 'bottom',
          });
        }
        Geolocation.getCurrentPosition()
          .then((position) => {
            if (position && position.coords.latitude) {
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

  async function dutyApi(formData, dutyEnd) {
    try {
      const response = dutyEnd
        ? await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystop.php', formData)
        : await axios.post('https://guard.ghamasaana.com/guard_new_api/dutystart.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
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
        if (response && response?.data && 'range_status' in response.data[0]) {
          if(inRange != response.data[0]?.range_status){
            SetInRange(response.data[0]?.range_status);
          }
          // if(inAlert == response.data[0]?.display_alert){
          //   let localVal = localStorage.getItem('guardalertkey');
            let timeSTT = new Date().getTime();
            let obj:object = {
              lat: Latitude,
              long: Longitude,
              movementAlertMessage: response.data[0]?.display_message,
              alertKey: response.data[0]?.display_alert,
              token: token,
              timeStamp: timeSTT
            }

            //Setting in local storage, base on which localstorage listner is triggered to validate 
            localStorage.setItem('guardalertkey', JSON.stringify(obj));
            onLocalStorageChange(obj);

            // if(localVal == true){
            //   console.error("no need to et again!------ already set", localVal)
            // }else{
            //   console.error("setting in localstorage----->");
            //   localStorage.setItem('guardalertkey', response.data[0]?.display_alert); 
            // }
            SetInAlert(response.data[0]?.display_alert);
          // }
          if(movementAlertMessage != response.data[0]?.display_message){
            SetMovementAlertMessage(response.data[0]?.display_message);
          }
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleDutyStart = async () => {
    captureLocation().then((res) => {
      if (Latitude !== '') {
        takePhoto().then(async (photoData) => {
          console.log("Photo Data Returned From Camera Base64 format---", photoData);
          const formData = new FormData();
          const token = localStorage.getItem('token');
          formData.append('action', 'punch_in');
          formData.append('token', token);
          formData.append('latitude', Latitude);
          formData.append('longitude', Longitude);
          formData.append('duty_start_verification', 'Face_Recognition');
          formData.append('duty_start_pic', JSON.stringify(photoData));
          dutyApi(formData, false)
            .then((response) => {
              if (response && response.success) {
                fetchOngoingDuty();
                intervalRef.current = setInterval(() => {
                  setElapsedTime((prevTime) => prevTime + 1);
                  console.log("Timer is set for every 5 seconds", intervalRef);
                }, 5000);
                setIsRunning(true);
                dutyMovementHandler();
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

  const dutyMovementHandler = () => {
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
  }

  //Duty End API Call
  const handleDutyEnd = async () => {
    clearInterval(intervalRef.current);
    captureLocation().then(() => {
      if (Latitude !== '') {
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
            localStorage.setItem('guardalertkey', JSON.stringify({}));
          })
          .catch((error) => {
            console.error('Error:', error);
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
    console.log(token);
    console.log("formDATA create----> ", JSON.stringify(formData));
    // return false;

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

  function handleAlertReply() {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'alert_msg_status');
    formData.append('token', token);
    formData.append('latitude', Latitude);
    formData.append('longitude', Longitude);
    formData.append('alertreply', alertReplyInput);
    formData.append('alertmsg', movementAlertMessage );

    axios.post('https://guard.ghamasaana.com/guard_new_api/alert_message_status.php', formData).then((response) => {
      if (response.data && response.data.success) {
        present({
          message: `Your alert reply has been submitted successfully!`,
          duration: 2000,
          position: 'bottom',
        });
        setAlertModal(false);
        setAlertReplyInput('');
      } else {
        present({
          message: `Failed to submit alery reply. Please try again.`,
          duration: 2000,
          position: 'bottom',
        });
      }
    }).catch((error) => {
      console.error(`Error replying request:`, error);
      present({
        message: `An error occurred. Please try again.`,
        duration: 2000,
        position: 'bottom',
      });
    });
  }
    console.log("re-render check")

  return (
    <div>
      {/* <IonHeader>
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
      </IonHeader> */}

      {/* <IonContent className="page-content"> */}
        {/* <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader> */}
        <div className="content">
          {/* <div className="header_title">
            <IonTitle className="header_title ion-text-center">{t('Welcome')} {loggedInUser?.full_name}</IonTitle>
          </div> */}
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
                  <p><strong>Duty Started On :</strong>{dutystartinfo?.duty_start_date}</p>
                ) : ('')}
              </div>
            </IonCardContent>
            <div className='not-range-parent'>
              <span>
                {!inRange && 'You are not in range of duty!'}
              </span>
            </div>
            {/* {!inAlert && <AlertComponent movementAlertMessage={movementAlertMessage} inAlert={inAlert}
          setAlertModal={()=>{
            setAlertModal(true);
          }}  />} */}
            {isRunning && elapsedState && <div>
              <MyStopwatch test={elapsedState} />
            </div>}
            <IonGrid className="ion-text-center">
              <IonRow>
                <IonCol size="12">
                  {isRunning ? ( //Duty ENd Button
                    <IonButton expand="block" onClick={handleDutyEnd} color="danger">
                      {t('punchOut')}
                    </IonButton>
                  ) : ( //Duty Start BUtton
                    <IonButton disabled={!dutyDetailsFromOngoingDuty?.dutystartbuttonstatus} expand="block" onClick={handleDutyStart} color="primary">
                      {t('punchIn')}
                    </IonButton>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>

          <IonGrid className="ion-margin ion-text-center">
            <IonRow>
              <IonCol size="12" size-md="12" size-lg="12">
                {/* <IonButton expand="block" color="danger" onClick={() => { setReqType('sos'); setShowRequestModal(true); }}>{t('sos')}</IonButton> */}
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
                  <IonButton onClick={() => setShowRequestModal(false)}>
                    <IonIcon icon={closeOutline} size="large"></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Subject</IonLabel>
                  <IonInput value={reqSubject} onIonChange={e => setReqSubject(e.detail.value!)}></IonInput>
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
      {/* </IonContent> */}
      <div className="footer">
        <IonTitle className="footer ion-text-center">Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    </div>
  );
};

const Dashboard = () =>{
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [inAlert, SetInAlert] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [movementAlertMessage, SetMovementAlertMessage] = useState('sheikh test');
  const [itemFromLocalStorage, setItemFromLocalStorage] = useState(
    localStorage.getItem('guardalertkey') || ''
  );
  // const [reqSubjectModal, setreqSubjectModal] = useState('');


  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
  }, []);

  const handleLocalStorageChange = useCallback((newValue) => {
    if(newValue?.alertKey != itemFromLocalStorage?.alertKey){
      setItemFromLocalStorage(newValue);
      console.log(`LocalStorage 'guardalertkey' changed:`, newValue);
    }else{
      console.error("no effect due to new val ", newValue);
    }
  }, []);
  // Empty dependency array ensures effect runs only once

  return(
    <>
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
          {itemFromLocalStorage && itemFromLocalStorage?.alertKey && <div
          style={{paddingRight:'10px', paddingLeft:'10px'}}
          ><AlertComponent movementAlertMessage={movementAlertMessage} inAlert={inAlert}
          setAlertModal={()=>{
            setAlertModal(true);
          }}  /></div>}
{/* <IonItem>
<IonInput value={reqSubjectModal}
onIonInput={e => 
{
console.log(e);
setreqSubjectModal(e.detail.value!)                                }
}></IonInput>
</IonItem> */}
          <DashboardComp onLocalStorageChange={handleLocalStorageChange} />
        </div>
        {/* ALERT MODAL GOES BELOW */}

        {<ModalComponent alertModal={alertModal} movementAlertMessage={movementAlertMessage} inAlert={inAlert}
          setAlertModal={()=>{
            console.log("setAlertModal(false) called", alertModal);
            setAlertModal(false);
          }}
          itemFromLocalStorage={itemFromLocalStorage}
          />
        }
        </IonContent>
        </IonPage>
    </>
  )
}

export default Dashboard;


function AlertComponent(props){

  return(
    <div className='alertClassForMessage not-range-parent' style={{
      marginTop: "5px", marginBottom: '5px',
      padding: '15px', border: '2px solid red', position: 'relative'
    }}>
      <div>
        ALERT!
      </div>
      <div style={{fontSize:'12px'}}>
        Please answer below alert question!
      </div>
      <div className='blink_me' style={{color:'#000', marginTop:'5px'}}>
        {`Alert Question: ${JSON.stringify(props.movementAlertMessage)}`}
      </div>
      <div>
        <IonButton expand="block" onClick={()=> props.setAlertModal()} color="danger">
          {'REPLY ALERT'}
        </IonButton>
      </div>
    </div>
  )
}

function ModalComponent(props){
  const [present, dismiss] = useIonToast();
  console.log("itemFromLocalStorage---------------------------------------", props.itemFromLocalStorage);
  const [alertModal, setAlertModal] = useState(false);
  const [alertReplyInput, setAlertReplyInput] = useState('');
  // const [reqSubjectModal, setreqSubjectModal] = useState('');


  function handleAlertReply() {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'alert_msg_status');
    formData.append('token', props.itemFromLocalStorage.token);
    formData.append('latitude', props.itemFromLocalStorage.lat);
    formData.append('longitude', props.itemFromLocalStorage.long);
    formData.append('alertreply', alertReplyInput);
    formData.append('alertmsg', props.itemFromLocalStorage.movementAlertMessage );

    axios.post('https://guard.ghamasaana.com/guard_new_api/alert_message_status.php', formData).then((response) => {
      if (response.data && response.data.success) {
        present({
          message: `Your alert reply has been submitted successfully!`,
          duration: 2000,
          position: 'bottom',
        });
        props.setAlertModal();
        setAlertReplyInput('');
      } else {
        present({
          message: `Failed to submit alery reply. Please try again.`,
          duration: 2000,
          position: 'bottom',
        });
      }
    }).catch((error) => {
      console.error(`Error replying request:`, error);
      present({
        message: `An error occurred. Please try again.`,
        duration: 2000,
        position: 'bottom',
      });
    });
  }

  return(
    <IonModal isOpen={props.alertModal} onDidDismiss={() => props.setAlertModal()}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{'Alert Reply'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setAlertModal()}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">{!props.inAlert && `Alert Question: ${props.itemFromLocalStorage.movementAlertMessage}`}</IonLabel>
            <IonTextarea value={alertReplyInput} onIonInput={(e) => {
              setAlertReplyInput(e.detail.value!)
            }}></IonTextarea>
          </IonItem>
{/* <IonItem>
<IonInput value={reqSubjectModal} onIonInput={e => 
{
console.log(e.detail.value!);
setreqSubjectModal(e.detail.value!)                                }
}></IonInput>
</IonItem> */}
        </IonList>
        <IonButton expand="full" onClick={() => handleAlertReply()}>Submit Alert Reply</IonButton>
      </IonContent>
    </IonModal>
  )
}

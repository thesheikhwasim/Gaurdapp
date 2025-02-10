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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonLoading,
  IonLoading,
  IonSpinner,
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
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { useHistory } from 'react-router-dom';
import '../utilities_constant';
import { BASEURL } from '../utilities_constant';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';

const DashboardComp: React.FC = ({ onLocalStorageChange, reloadPage }:any) => {
  const history = useHistory();
  const [duty, setDuty] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const token = localStorage.getItem('token');
  const [showselfie, setshowselfie] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selfiedetail, setSelfiedetail] = useState('');
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
  const [showfullModal, setshowfullModal] = useState(false);
  const [showimagepath, setshowimagepath] = useState('');
  
  const [reqType, setReqType] = useState('sos');
  const [reqSubject, setReqSubject] = useState('');
  const [currentsiteid, setCurrentSiteId] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqOtherDetail, setReqOtherDetail] = useState('');
  const [dutyAssigned, setDutyAssigned] = useState(true);
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [imgSelfie, setimgselfie] = useState('');
  const [dutystartinfo, setdutystartinfo] = useState<any>(null);
  const [dutyTimeToStart, setDutyTimeToStart] = useState<any>('');
  const [selfiebuttonstatus, setSelfiebuttonstatus] = useState(true);
  const [dutyStartbutton, setDutyStartbutton] = useState(true);
  const [dutyEndbutton, setDutyEndbutton] = useState(true);
  const [dutyDetailsFromOngoingDuty, setDutyDetailsFromOngoingDuty] = useState<any>({});
  const [otherdutyDetails, setotherdutyDetails] = useState<any>({});
  const [inRange, SetInRange] = useState<boolean>(true);
  const [inAlert, SetInAlert] = useState<boolean>(false);
  const [movementAlertMessage, SetMovementAlertMessage] = useState<string>('asdasdasda');
  const [elapsedState, setElapsedState] = useState<number>(0);
  const [alertModal, setAlertModal] = useState(false);
  const [alertReplyInput, setAlertReplyInput] = useState('');
  const [Otherdutyinfo, setOtherdutyinfo] = useState<boolean>(false);
  const [simonenumber, setsimonenumber] = useState('');
  const [simtwonumber, setsimtwonumber] = useState('');
  const [upcomingtitle, setupcomingtitle] = useState<boolean>(false);
  const [showspinner, setshowspinner] = useState<boolean>(false);
  const [inrangeduty, setInRangeDuty] = useState<boolean>(false);
  const [guardmovementhit, setGuardMovementHit] = useState<number>(5000);
  
  useEffect(() => {
    logoutvalidate();
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    const sellanguage = localStorage.getItem('language');
    const guard_movementhit=localStorage.getItem('guard_movementhit');
    if(guard_movementhit!='')
    {
      setGuardMovementHit(guard_movementhit); 
    }

  
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
      
    
    }
    if (storedToken) {
      ongoingNewHandlerWithLocation();
    

    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');

    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
      if(loggedInUser!=null)
      {
        setCurrentSiteId(loggedInUser.site_id);
      
      }
  
  
    }
   
  }, []);

 
  async function logoutvalidate()
  {
  
  const checklogin= await Checkvalidtoken();
 
  if(checklogin){
    history.push('/pages/login');
    window.location.reload();
    return false;
}

}

  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      if((res && res?.coords && res?.coords?.latitude)){
        setPrevLatitude(res?.coords?.latitude);
        setPrevLongitude(res?.coords?.longitude);
 
        setLocationPermissionchk(true);
        fetchOngoingDuty(res);
     
      }else{
        setLocationPermissionchk(false);
        present({
          message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
          duration: 500,
          position: 'bottom',
        });
        setTimeout(async() => {
    
          window.location.reload();
        }, 5000);
      }
    }).catch((error)=>{
      setLocationPermissionchk(false);
      present({
        message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
        duration: 5000,
        position: 'bottom',
      });
    setTimeout(async() => {
    
        window.location.reload();
      }, 5000);
     
    });
  }

  //Added to re-load ongoing duty on refresher pulled
  useEffect(() => {
    if(reloadPage){
      ongoingNewHandlerWithLocation();
    }
  },[reloadPage])

/*  useEffect(() => {
    captureLocation('fromElapsed').then((res) => {
       if((res && res?.coords && res?.coords?.latitude) && (prevLatitude != res?.coords?.latitude || prevLongitude != res?.coords?.longitude) && prevLatitude){
        setPrevLatitude(res?.coords?.latitude);
        setPrevLongitude(res?.coords?.longitude);
       
      }

      console.log('Logs every minute elaplsed:: ',MINUTE_MS);
      
    }).catch((error)=>{
      console.error("ELAPSEDTIME LOCATION ERROR",error);
    });
  }, [elapsedTime])
*/

const MINUTE_MS =localStorage.getItem('guard_movementhit');

 
useEffect(() => {

  
  
    
    const interval = setInterval(() => {
 
      captureLocation('fromElapsed').then((res) => {
        console.error("ELAPSEDTIME LOCATION ERROR", res);
        if((res && res?.coords && res?.coords?.latitude)){
         setLatitude(res?.coords?.latitude);
         setLongitude(res?.coords?.longitude);
         
         
         dutyMovementHandler(res?.coords?.latitude,res?.coords?.longitude);
      console.log('Logs every minutedddd: ',MINUTE_MS);
       }
      
       
     }).catch((error)=>{
       console.error("ELAPSEDTIME LOCATION ERROR");
     });
  
  
     
    }, MINUTE_MS);
  return () => clearInterval(interval);
  // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])

  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const { takePhoto } = usePhotoGallery();

  const fetchOngoingDuty = async (dataParam=0) => {
    // console.log("Inside Ongoing function");
    try {
 
      let formData = new FormData();
      formData.append('action', 'duty_ongoing');
      formData.append('token', token);

      const newlatlong= await captureLocation('fromDutyStart')


                    if((newlatlong && newlatlong?.coords && newlatlong?.coords?.latitude)){
   
        formData.append('latitude', newlatlong?.coords?.latitude);
        formData.append('longitude', dataParam?.coords?.longitude);
   
      }else{
    
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
      }
    
       
      const response = await axios.post(BASEURL+'ongoing_duty.php', formData);
      const data = response.data;

      // Case to validate API was success and employee data is available
      if (data?.success && data?.employee_data) {
        setDutyDetailsFromOngoingDuty(data.employee_data);
        setDutyStartbutton(data.employee_data.dutystartbuttonstatus);
        setDutyTimeToStart(data.employee_data.timetostartduty);
        setDutyEndbutton(data.employee_data.dutyendbuttonstatus);
        setCurrentSiteId(data.employee_data.site_id);
        setOtherdutyinfo(data.employee_data.other_duty_info);
        setotherdutyDetails(data.employee_data.other_duty_detail);
        setupcomingtitle(data.employee_data.upcomming_duty);
        setDutyAssigned(true);
        // Case to validate start date is available which is responsible to show Duty timer
        if (data?.employee_data && data?.employee_data?.duty_ongoing_info && data?.employee_data?.duty_ongoing_info?.duty_start_date) {
          let past = new Date(data?.employee_data?.duty_ongoing_info?.duty_start_date);
          // assigning present time to new variable 
          let now = new Date();
          let elapsed = (now - past);
          setElapsedState(elapsed / 1000);
        }
      }
      else{
        if(data?.message=='You Have not assigned any duty.')
        {        
          setDutyAssigned(false);
        
      }
    }
      //Case to validate if page was refreshed/reloaded and ongoing duty is mapped
      if (data.success && data.employee_data.duty_ongoing_info && data.employee_data.duty_ongoing_info.duty_end_date === null) {
        setDuty(true);
        setIsRunning(true);
        setElapsedTime(convertRemainingTime(data.employee_data.remaining_time));
        setdutystartinfo(data.employee_data.duty_ongoing_info);
        if (intervalRef.current == null) {
          intervalRef.current = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
          }, 5000);
        }
      } else {
        setIsRunning(false);
        setElapsedTime(data.employee_data.duty_ongoing_info);
        setdutystartinfo(data.employee_data.duty_ongoing_info);
       
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

  const captureLocation = (fromParam:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
       if (permissions?.location == "denied") {
          setLocationPermissionchk(false);
          present({
            message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
            duration: 5000,
            position: 'bottom',
          });
          setTimeout(async() => {
        
            window.location.reload();
          }, 5000);
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
          //    setLatitude(position.coords.latitude.toString());
          //    setLongitude(position.coords.longitude.toString());
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
        ? await axios.post(BASEURL+'dutystop.php', formData)
        : await axios.post(BASEURL+'dutystart.php', formData, {
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



 

  // console.log("Ongoing Duty formdata:: ", formData);
  

  async function dummyExplicitMovementApi(){
    try{
      let formData = new FormData();
      const token = localStorage.getItem('token');
      formData.append('action', 'duty_movement');
      formData.append('token', token);
      formData.append('latitude', 'latitude disabled');
      formData.append('longitude', 'longitude disabled');
      let DUMMY_MOVEMENT_URL = BASEURL+'dutystartmovement.php';
      const response = await axios.post(DUMMY_MOVEMENT_URL, formData);
      console.log("response DUMMY -- -", response);
    }catch (error) {
      console.error('Error:', error);
      return null;
    }
  }




//

  async function dutyMovementApi(latitudeparam:any,longitudeparam:any) {
    try {
     
      if(localStorage.getItem('unreadnotification')==='0')
      {
        localStorage.setItem('unreadnotification','0');
      }
     
  if((longitude!='' && longitude!='') || (latitudeparam!='' && longitudeparam!=''))
    {
    
      if((longitude!='' && longitude!=''))
      {
        const response=await DutyMovementGlobalApi(latitude,longitude);
        if(response.data[0]?.unreadnotification==='0')
          {
            localStorage.setItem('unreadnotification',response.data[0]?.unreadnotification);
          }
       
if(response.data.success && response.data[0]?.APP_CURRENT_VERSION!='2411211243')
{

  present({
    message: `Your don't have the updated APP. Please download and update your APP`,
    duration: 3000,
    position: 'bottom',
  });
}
        setSelfiedetail(response.data[0]?.selfiedetail);
        if(localStorage.getItem('guard_movementhit')!=response.data[0]?.guardmovementtimer)
        {
          localStorage.setItem('guard_movementhit', response.data[0]?.guardmovementtimer);
        }
        setSelfiebuttonstatus(response.data[0]?.selfiebuttonstatus);
        if (response && response?.data && response.data[0]?.range_status) {
          // SetDutyEndbutton();
    
           // dutyEndbutton
           if (inRange != response.data[0]?.range_status) {
             SetInRange(response.data[0]?.range_status);
             setIsRunning(true);
             setDutyEndbutton(response.data[0]?.dutyendbuttonstatus);
 
           }
           
           let timeSTT = new Date().getTime();
           let obj: object = {
             lat: latitude,
             long: longitude,
             movementAlertMessage: response.data[0]?.display_message,
             alertKey: response.data[0]?.display_alert,
             token: token,
             timeStamp: timeSTT
           }
 
           //Setting in local storage, base on which localstorage listner is triggered to validate 
           localStorage.setItem('guardalertkey', JSON.stringify(obj));
           
           SetInAlert(response.data[0]?.display_alert);
           // }
     
           if (movementAlertMessage != response.data[0]?.display_message) {
             SetMovementAlertMessage(response.data[0]?.display_message);
           }
           onLocalStorageChange(obj);
         }
         else{
          if(response.data[0]?.dutyrunningstatus)
            {
              setDutyTimeToStart(response.data[0]?.range_msg); 
            }
            else
            {
              setDutyTimeToStart(response.data[0]?.timetostartduty); 
            }
          
          
           if(response.data[0]?.dutyrunningstatus)
           {
            SetInRange(response.data[0]?.range_status);
            setIsRunning(true);
             setDutyEndbutton(response.data[0]?.dutyendbuttonstatus);
           }
         }
      }
      else
      {
        const response=await DutyMovementGlobalApi(latitudeparam,longitudeparam);
          setSelfiedetail(response.data[0]?.selfiedetail);
          if(response.data.success && response.data[0]?.APP_CURRENT_VERSION!='2411211243')
            {
            
              present({
                message: `Your don't have the Latest APP. Please update your APP`,
                duration: 3000,
                position:'bottom',
              });
            }

          if(localStorage.getItem('guard_movementhit')!=response.data[0]?.guardmovementtimer)
            {
              localStorage.setItem('guard_movementhit', response.data[0]?.guardmovementtimer);
            }
        setSelfiebuttonstatus(response.data[0]?.selfiebuttonstatus);
        setDutyEndbutton(response.data[0]?.dutyendbuttonstatus);
        if (response && response?.data && response.data[0]?.range_status) {
          // SetDutyEndbutton();
    
           // dutyEndbutton
           if (inRange != response.data[0]?.range_status) {
             SetInRange(response.data[0]?.range_status);
             setIsRunning(true);
             setDutyEndbutton(response.data[0]?.dutyendbuttonstatus);
 
           }
           
           let timeSTT = new Date().getTime();
           let obj: object = {
             lat: latitude,
             long: longitude,
             movementAlertMessage: response.data[0]?.display_message,
             alertKey: response.data[0]?.display_alert,
             token: token,
             timeStamp: timeSTT
           }
 
           //Setting in local storage, base on which localstorage listner is triggered to validate 
           localStorage.setItem('guardalertkey', JSON.stringify(obj));
           
           SetInAlert(response.data[0]?.display_alert);
           // }
     
           if (movementAlertMessage != response.data[0]?.display_message) {
             SetMovementAlertMessage(response.data[0]?.display_message);
           }
           onLocalStorageChange(obj);
         }
         else{
          if(response.data[0]?.dutyrunningstatus)
            {
              setDutyTimeToStart(response.data[0]?.range_msg); 
            }
            else
            {
              setDutyTimeToStart(response.data[0]?.timetostartduty); 
            }
           if(response.data[0]?.dutyrunningstatus)
           {
             setIsRunning(true);
           }
         }
      }
 
    
       
 
  
     
      
        
      // }
      return null;
    }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const handleDutyStart = async () => {
    captureLocation('fromDutyStart').then((res) => {
      alert(latitude+"Camera opend");
      if (latitude !== '') {
        takePhoto().then(async (photoData) => {
          alert(latitude+"Duty start clicked");
          setshowspinner(true);
          const token = localStorage.getItem('token');
                    let formDatachk = new FormData();
                    formDatachk.append('action', 'duty_ongoing');
                    formDatachk.append('token', token);
                  
                   const newlatlong= await captureLocation('fromDutyStart')


                    if((newlatlong && newlatlong?.coords && newlatlong?.coords?.latitude)){
                     
                      formDatachk.append('latitude', newlatlong?.coords?.latitude);
                        formDatachk.append('longitude', newlatlong?.coords?.longitude); 
                      }
                      else
                      {
                        present({
                          message: `Something went wrong. Please try again  `,
                          duration: 5000,
                          position: 'bottom',
                        });
                        return false;
                      }
                 
            const response = await axios.post(BASEURL+'ongoing_duty.php', formDatachk);
            const data = response.data;
            alert(data.employee_data.dutystartbuttonstatus+"checking final data"+newlatlong?.coords?.latitude);
            if(data.employee_data.dutystartbuttonstatus)
            {
          // console.log("Photo Data Returned From Camera Base64 format---", photoData);
          
          alert(data.employee_data.site_id+"Passed to final submission");
          const formData = new FormData();
          
          formData.append('action', 'punch_in');
          formData.append('token', token);
      
            formData.append('latitude', latitude);
            formData.append('longitude', longitude); 
        
          formData.append('cursiteid', data.employee_data.site_id);
          formData.append('duty_start_verification', 'Face_Recognition');
          formData.append('duty_start_pic', JSON.stringify(photoData));
        
        
          dutyApi(formData, false)
            .then((response) => {
              if (response && response.success) {
                setshowspinner(false);
                ongoingNewHandlerWithLocation();
                intervalRef.current = setInterval(() => {
                  setElapsedTime((prevTime) => prevTime + 1);
                  // console.log("Timer is set for every 5 seconds", intervalRef);
                }, 5000);
                setIsRunning(true);
                setshowspinner(false);
                dutyMovementHandler();
                
              } else if (response.success === false) {
                setAlertMessage(response.message);
                setShowAlert(true);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
          else
          {

            setshowspinner(false);
            setDutyStartbutton(false);
            setDutyTimeToStart(data.employee_data.timetostartduty);
            present({
              message: `You are out of your duty range. Please go to your specified Site and then Try to start Duty.`,
              duration: 5000,
              position: 'bottom',
            });
          }
        });
     
      } else {

        present({
          message: `Something went wrong getting your location, Try again.`,
          duration: 5000,
          position: 'bottom',
        });
    //    setAlertMessage('Something went wrong getting your location, Try again');
      //  setShowAlert(true);
      }
    });
  };

  const dutyMovementHandler =async (latitudeparam:any,longitudeparam:any) => {
    
    // Call duty movement API
    dutyMovementApi(latitudeparam,longitudeparam).then((movementResponse) => {
      if (movementResponse && !movementResponse.success) {
        setAlertMessage(movementResponse.message);
        setShowAlert(true);
      } 
    
    });
    
  }

/*  const dutyMovementHandler =async () => {
    const validmobile=await ValidateSimcardnumber();
    if(validmobile)
    {
    // Call duty movement API
    dutyMovementApi().then((movementResponse) => {
      if (movementResponse && !movementResponse.success) {
        setAlertMessage(movementResponse.message);
        setShowAlert(true);
      } 
    
    });
     }
     else
     {
      present({
        message: `You mobile no not matching with Sim card number. you will be logged out.`,
        duration: 5000,
        position: 'bottom',
      });
      setTimeout(async() => {
        const forceLogout=await GlobalLogout();
        if(forceLogout){
        history.push('/pages/login');
        window.location.reload()
}
      }, 5000);

     }
  } */

  //Duty End API Call
  const handleDutyEnd = async () => {
    clearInterval(intervalRef.current);
    captureLocation('fromDutyEnd').then(() => {
      if (latitude !== '') {

        takePhoto().then(async (photoData) => {

          let formDataend = new FormData();
          formDataend.append('action', 'duty_ongoing');
          formDataend.append('token', token);
          const newlatlong= await captureLocation('fromDutyStart')
          setshowspinner(true);

          if((newlatlong && newlatlong?.coords && newlatlong?.coords?.latitude)){
           
            formDataend.append('latitude', newlatlong?.coords?.latitude);
            formDataend.append('longitude', newlatlong?.coords?.longitude); 
            }
            else
            {
              present({
                message: `Something went wrong. Please try again  `,
                duration: 5000,
                position: 'bottom',
              });
              return false;
            }
       
  const response = await axios.post(BASEURL+'ongoing_duty.php', formDataend);
  const data = response.data;
  if(data.employee_data.dutyendbuttonstatus)
  {


    setDutyEndbutton(false);

        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('action', 'punch_out');
        formData.append('token', token);
        formData.append('latitude', newlatlong?.coords?.latitude);
        formData.append('longitude', newlatlong?.coords?.longitude);
        formData.append('duty_end_verification', 'Face_Recognition');
        formData.append('end_verification_status', 'Approved');
        formData.append('duty_end_pic', JSON.stringify(photoData));
        dutyApi(formData, true)
          .then((response) => {
            if (response && response.success) {
              setIsRunning(false);
              setshowspinner(false);
              setDutyEndbutton(false);
             // fetchOngoingDuty();
             ongoingNewHandlerWithLocation();
             present({
              message: `Your Duty ended successfully.`,
              duration: 5000,
              position: 'bottom',
            });


            } else if (response.success === false) {
              setAlertMessage(response.message);
              setShowAlert(true);
            }
            localStorage.setItem('guardalertkey', JSON.stringify({}));
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
        else
        {
          setshowspinner(false);
          setDutyEndbutton(false);
          setDutyTimeToStart(data.employee_data.timetostartduty);
          present({
            message: `You are out of your duty range. Please go to your specified Site and then Try to end Duty.`,
            duration: 5000,
            position: 'bottom',
          });
        }

        });
      } else {
        setAlertMessage('Something went wrong getting your location, Try again');
        setShowAlert(true);
      }
    });
  };

  const handleCreateRequest = async() => {
    captureLocation('fromDutyStart').then((res) => {
    const formData = new FormData();
    formData.append('action', 'add_alert_message_selfie');
    formData.append('token', token);
    formData.append('alertmsg', '1');
    formData.append('alertreply', imgSelfie);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    setshowspinner(true);
    // return false;

    axios
      .post(BASEURL+'alert_message_status.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          present({
            message: `Your Selfie created successfully!`,
            duration: 2000,
            position: 'bottom',
          });
        
          setReqSubject('');
          setReqDesc('');
          setReqOtherDetail('');
          setshowspinner(false);
          setShowRequestModal(false);
          setimgselfie('');
          
          
        } else {
          present({
            message: `Failed to add selfie. Please try again.`,
            duration: 2000,
            position: 'bottom',
          });
        }
      })
      .catch((error) => {
        console.error(`Error creating ${reqType} request:`, error);
        present({
          message: `An error occurred. Please try again.`,
          duration: 2000,
          position: 'bottom',
        });
      });
    });
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  const handlecameraStart = async () => {
    takePhoto().then(async (photoData) => {
      setimgselfie(JSON.stringify(photoData));
  });
};
  function handleAlertReply() {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'alert_msg_status');
    formData.append('token', token);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('alertreply', alertReplyInput);
    formData.append('alertmsg', movementAlertMessage);

    axios.post(BASEURL+'alert_message_status.php', formData).then((response) => {
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
  // console.log("Page state updated and re-rendered")

  return (
    <div>
      <div className="content">
        {JSON.stringify(dutyDetailsFromOngoingDuty) != "{}" ? 
        <IonCard className="shift-details-card">

<IonCardHeader>
  <IonCardTitle>{t('Your Current Duty Detail')}</IonCardTitle>
</IonCardHeader>
<IonCardContent className="shift-details-card-content">
  <div className="shift-details-column">
    {dutyDetailsFromOngoingDuty && dutyDetailsFromOngoingDuty?.duty_ongoing_info &&
      dutyDetailsFromOngoingDuty?.duty_ongoing_info?.duty_start_pic && 
      <p className='duty-start-pic-guard'><strong>{t('Your Duty Pic')}:</strong> 
      <IonImg onClick={() => {
                             setshowimagepath("dutyverificationimg/"+dutyDetailsFromOngoingDuty?.duty_ongoing_info?.duty_start_pic);
                       setshowfullModal(true);
                      }}
        src={BASEURL+`dutyverificationimg/${dutyDetailsFromOngoingDuty?.duty_ongoing_info?.duty_start_pic}`}
      ></IonImg></p>}
    <p><strong>{t('Client Name')}:</strong> {dutyDetailsFromOngoingDuty?.client_name}</p>
    <p><strong>{t('Site Name & Address')}:</strong> <span className='text-right'>{dutyDetailsFromOngoingDuty?.site_name}, {dutyDetailsFromOngoingDuty?.site_city}, {dutyDetailsFromOngoingDuty?.site_state}</span></p>
    <p><strong>{t('Site ID')}:</strong> {dutyDetailsFromOngoingDuty?.site_id}</p>
    <p><strong>{t('Sol ID')}:</strong> {dutyDetailsFromOngoingDuty?.sol_id}</p>
      </div>
  <div className="shift-details-column">
    <p><strong>{t('Authorized Shift')}:</strong> {dutyDetailsFromOngoingDuty?.auth_shift}</p>
    <p><strong>{t('Duty Start Time')}:</strong> {dutyDetailsFromOngoingDuty?.duty_start_datetime}</p>
    <p><strong>{t('Duty End Time')}:</strong> {dutyDetailsFromOngoingDuty?.duty_end_datetime}</p>
    {isRunning ? (
      <p><strong>{t('Duty Started On')}:</strong>{dutystartinfo?.duty_start_date}</p>
    ) : ('')}
  </div>
</IonCardContent>
<div className='not-range-parent'>
  <span>
    {!inRange && <div className='not-range-parent'>
  <span>
    {dutyTimeToStart}
  </span>
</div>}
  </span>
</div>
{dutyDetailsFromOngoingDuty && dutyTimeToStart!='' && 
<div className='not-range-parent'>
  <span>
    {dutyTimeToStart}
  </span>
</div>}
{isRunning && elapsedState && <div>
  <MyStopwatch test={elapsedState} />
</div>}
<IonGrid className="ion-text-center">
  <IonRow>
    <IonCol size="12">
      
    {showspinner && !isRunning ? (
          <IonSpinner name="lines"></IonSpinner>
        ) : ('')}
      {isRunning ? ( //Duty ENd Button
        <IonButton 
          disabled={!dutyEndbutton} 
          expand="block" 
          onClick={handleDutyEnd} 
          color="danger">
          {t('punchOut')}
        </IonButton>
      ) : ( //Duty Start BUtton
        /*{showspinner ? (
          <IonSpinner name="lines"></IonSpinner>
        ) : ( */
        [showspinner ?
        <IonButton 
          disabled={true}
          expand="block" 
          onClick={handleDutyStart} 
          color="primary">
          {t('punchIn')}
        </IonButton> 
        :
        <IonButton 
        disabled={!dutyStartbutton} 
        expand="block" 
        onClick={handleDutyStart} 
        color="primary">
        {t('punchIn')}
      </IonButton> 
        ]
    
      )}
    </IonCol>
  </IonRow>
</IonGrid>
</IonCard> 
: <div className='errorDashboardData'>
      <IonSpinner name="lines"></IonSpinner>
      <i style={{marginLeft:'10px', color: '#000'}}>
        {!dutyAssigned ? ( <>{`You have not assigned any duty, Please contact Admin`}</>):( <>
        {!locationPermissionchk ?(<>{`Check device’s GPS Location Service Enable it manually`}</>)
        :(<>{`Please wait while loading data`}</>)}
        </>)}
       
        </i>
</div>}
        
{isRunning ? (
        <IonGrid className="ion-margin ion-text-center">
          <IonRow>
            <IonCol size="12" size-md="12" size-lg="12">
            <IonButton 
        disabled={!selfiebuttonstatus}
        expand="block" 
        onClick={() => {
          setimgselfie('');
          setShowRequestModal(true);
          handlecameraStart();
      }}
      
        color="primary">
        {t('Add Your Duty Selfie')}
      </IonButton> 
          
            </IonCol>
          </IonRow>
        </IonGrid>
):('')}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Alert'}
          message={alertMessage}
          buttons={['OK']}
        />

<IonModal isOpen={showfullModal} onDidDismiss={() => setshowfullModal(false)}>
          <IonHeader>
            <IonToolbar>
               <IonButtons slot="end">
                <IonButton onClick={() => setshowfullModal(false)}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
              <IonImg     className='incedentimag'
                          src={BASEURL+showimagepath}
                        ></IonImg>
              </IonItem>
           

            </IonList>
              </IonContent>
        </IonModal>


        <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t('Add Your Selfie')}</IonTitle>
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
                <IonLabel position="floating">{t('Add Your Selfie')}</IonLabel>
             
              </IonItem> 

 {/* <IonItem>
        <IonLabel>{t('Add Your Selfie')} </IonLabel>     
          <IonTextarea value={reqDesc} onIonInput={e => setReqDesc(e.detail.value!)}></IonTextarea>  

  </IonItem>*/}

              {imgSelfie ? ( <>
              <IonItem>
           
              <img  onClick={handlecameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(imgSelfie).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
               
            </IonItem>
          </>
            ):(   
            <IonItem> <img   onClick={handlecameraStart}
                src='./assets/imgs/image-preview.jpg'
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
             
            </IonItem>
          )}
            </IonList>
            {showspinner ? (
         <IonItem className='spinner_loc'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
            <IonButton disabled={showspinner} expand="full" onClick={handleCreateRequest}> {t('Save Your Selfie')}</IonButton>
          </IonContent>
        </IonModal>
      </div>
   
     
{(selfiedetail  && selfiedetail.length > 0) ? (
           <div className="content">
           <IonCard className="shift-details-card">
  <IonCardHeader>
     <IonCardTitle>{t('Your Selfie Detail')}</IonCardTitle>
   </IonCardHeader>
   {selfiedetail.map((ticket, index) => (
         <div className="content"   key={index} style={{ width: '100%' }}>
         <IonCard className="shift-details-card">
  <IonCardContent className="shift-details-card-content">
          <div className="shift-details-column">
          {ticket.ReqOtherDes!='' ?( <p >  <IonImg
className='imageionclasssel'
onClick={() => {
  setshowimagepath("incidentreport/"+ticket.alert_response);
setshowfullModal(true);
}}
src={BASEURL+`incidentreport/${ticket.alert_response}`}
></IonImg><strong>Selfie For Site {dutyDetailsFromOngoingDuty?.site_id} At : {ticket.response_recorded_on || 'N/A'}</strong></p>):('')}   
            
           
          </div>
          </IonCardContent>
          </IonCard>
        </div>

))}

   
   
   </IonCard> 
   </div>
   ) : ('')}
      
        {Otherdutyinfo ? (
          <div className="content">
        <IonCard className="shift-details-card">
{upcomingtitle ? (<IonCardHeader>
  <IonCardTitle>{t('Next Duty Detail')}</IonCardTitle>
</IonCardHeader>):(<IonCardHeader>
  <IonCardTitle>{t('Previous Duty Detail')}</IonCardTitle>
</IonCardHeader>)}

<IonCardContent className="shift-details-card-content">
  <div className="shift-details-column">
  
    <p><strong>{t('Client Name')}:</strong> {otherdutyDetails?.client_name}</p>
    <p><strong>{t('Site Name & Address')}:</strong> <span className='text-right'>{otherdutyDetails?.site_name}, {otherdutyDetails?.site_city}, {dutyDetailsFromOngoingDuty?.site_state}</span></p>
    <p><strong>{t('Site ID')}:</strong> {otherdutyDetails?.site_id}</p>
    <p><strong>{t('Sol ID')}:</strong> {otherdutyDetails?.sol_id}</p>
      </div>
  <div className="shift-details-column">
    <p><strong>{t('Authorized Shift')}:</strong> {otherdutyDetails?.auth_shift}</p>
    <p><strong>{t('Duty Start Time')}:</strong> {otherdutyDetails?.duty_start_datetime}</p>
    <p><strong>{t('Duty End Time')}:</strong> {otherdutyDetails?.duty_end_datetime}</p>

  </div>
</IonCardContent>


</IonCard> 
</div>
) : ('')}
        

  


   
      
      <div className="footer">
      <CustomFooter />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [inAlert, SetInAlert] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [movementAlertMessage, SetMovementAlertMessage] = useState('');
  const [itemFromLocalStorage, setItemFromLocalStorage] = useState(
    localStorage.getItem('guardalertkey') || ''
  );
  const [reloader, setReloader] = useState(false);
  // const [reqSubjectModal, setreqSubjectModal] = useState('');


  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
  }, []);

  const handleLocalStorageChange = useCallback((newValue) => {
    if (newValue?.alertKey != itemFromLocalStorage?.alertKey) {
      setItemFromLocalStorage(newValue);
    
    } else {
      // console.error("no effect due to new val ", newValue);
    }
  }, []);
  // Empty dependency array ensures effect runs only once

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
   
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
  }

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <CustomHeader />
            {/* <IonTitle>{name}</IonTitle> */}
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
            {itemFromLocalStorage && itemFromLocalStorage?.alertKey && <div
              style={{ paddingRight: '10px', paddingLeft: '10px' }}
            ><AlertComponent movementAlertMessage={movementAlertMessage} inAlert={inAlert}
            itemFromLocalStorage={itemFromLocalStorage}
              setAlertModal={() => {
                setAlertModal(true);
              }} /></div>}
            <DashboardComp onLocalStorageChange={handleLocalStorageChange} reloadPage={reloader} />
          </div>
          {/* ALERT MODAL GOES BELOW */}

          {<ModalComponent alertModal={alertModal} movementAlertMessage={movementAlertMessage} inAlert={inAlert}
           onLocalStorageChange={handleLocalStorageChange}
            setAlertModal={() => {
              // console.log("setAlertModal(false) called", alertModal);
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




function AlertComponent(props) {



  return (

    <div>

      {/* MODAL CODE STARTS */}

      {/* <IonPage> */}

      <IonContent class="ion-padding">

        <IonModal 

        isOpen={true} 

        backdropDismiss={false}

        id="example-modal-alert"

        onDidDismiss={() => props.setAlertModal()}

        >

          <div className="wrapper">

            {/* <IonList lines="none"> */}

              <div className='alertClassForMessage not-range-parent' style={{

                marginTop: "5px", marginBottom: '5px',

                padding: '15px', border: '2px solid red', position: 'relative'

              }}>

                <div>

                  ALERT!

                </div>

                <div style={{ fontSize: '12px' }}>

                  Please answer below alert question!

                </div>

                <div className='blink_me' style={{ color: '#000', marginTop: '5px' }}>

                {`Alert Question: ${JSON.stringify(props.movementAlertMessage)}`}

                </div>

                <div>

                  <IonButton expand="block" onClick={() => props.setAlertModal()} color="danger">

                    {'REPLY ALERT'}

                  </IonButton>

                </div>

              </div>

            {/* </IonList> */}

          </div>

        </IonModal>

      </IonContent>

    {/* </IonPage> */}

      {/* MODAL CODE ENDS */}

      {/* OLD CODE BELOW */}

      {/* <div>

        ALERT!

      </div>

      <div style={{ fontSize: '12px' }}>

        Please answer below alert question!

      </div>

      <div className='blink_me' style={{ color: '#000', marginTop: '5px' }}>

        {`Alert Question: ${JSON.stringify(props.movementAlertMessage)}`}

      </div>

      <div>

        <IonButton expand="block" onClick={() => props.setAlertModal()} color="danger">

          {'REPLY ALERT'}

        </IonButton>

      </div> */}

    </div>

  )

}



function ModalComponent(props) {
  const [present, dismiss] = useIonToast();
  // console.log("itemFromLocalStorage---------------------------------------", props.itemFromLocalStorage);
  const [alertModal, setAlertModal] = useState(false);
  const [alertReplyInput, setAlertReplyInput] = useState('');
  // const [reqSubjectModal, setreqSubjectModal] = useState('');


  
  function explicitFalseForNewAlertModal(){

    let timeSTT = new Date().getTime();

    let obj: object = {

      lat: "",

      long: "",

      movementAlertMessage: "",

      alertKey: false,

      token: "",

      timeStamp: timeSTT

    }



    //Setting in local storage, base on which localstorage listner is triggered to validate 

    localStorage.setItem('guardalertkey', JSON.stringify(obj));

    props.onLocalStorageChange(obj);

  }




  function handleAlertReply() {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'alert_msg_status');
    formData.append('token', props.itemFromLocalStorage.token);
    formData.append('latitude', props.itemFromLocalStorage.lat);
    formData.append('longitude', props.itemFromLocalStorage.long);
    formData.append('alertreply', alertReplyInput);
    formData.append('alertmsg', props.itemFromLocalStorage.movementAlertMessage);

    axios.post(BASEURL+'alert_message_status.php', formData).then((response) => {
      if (response.data && response.data.success) {
        present({
          message: `Your alert reply has been submitted successfully!`,
          duration: 2000,
          position: 'bottom',
        });
        
        props.setAlertModal();
        setAlertReplyInput('');
        explicitFalseForNewAlertModal();
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

  return (
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
        </IonList>
        <IonButton expand="full" onClick={() => handleAlertReply()}>Submit Alert Reply</IonButton>
      </IonContent>
    </IonModal>
  )
}

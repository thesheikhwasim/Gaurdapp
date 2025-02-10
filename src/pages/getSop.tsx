import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, 
  IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonList, 
  IonItem, IonInput, IonSelect, IonSelectOption,IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail, useIonToast } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { Geolocation } from '@capacitor/geolocation';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [SopData, setSopData] = useState<any>(null);
  const [SopGalData, setSopGalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [priority, setPriority] = useState('LOW');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('');
  const [present, dismiss] = useIonToast();
  const [reqOtherDetail, setReqOtherDetail] = useState('');
  const [reloader, setReloader] = useState(false);
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('language');
 
  useEffect(() => {
    
    
    if(token)
    {
      ongoingNewHandlerWithLocation(token);
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

  const fetchsopData = async (dataParam) => {
    const url = BASEURL+"sop.php";
    const formData = new FormData();
    formData.append('action', "sop_data");
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    formData.append('token', token);
    formData.append('lang', lang);
    

    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
         
          setSopData(response.data.employee_data.sop_data);
         
          setSopGalData(response.data.employee_data.sop_gallery);
        } else {
          console.error('Failed to fetch requests:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });
  };

  
  const { name } = useParams<{ name: string; }>();

  function newLeaveRequestNav() {
    console.log("New Leave Request CLickec");
    setReqType('leaveapplication');
    setShowRequestModal(true);
  }

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
      .post(BASEURL+'add_new_request.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          present({
            message: `Your ${reqType} request has been created successfully!`,
            duration: 2000,
            position: 'bottom',
          });
          setShowRequestModal(false);
          setReqSubject('');
          setReqDesc('');
          setReqOtherDetail('');
        } else {
          present({
            message: `Failed to create ${reqType} request. Please try again.`,
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
  };


  function ongoingNewHandlerWithLocation(token:any){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
       
 
        fetchsopData(res);

      }else{
        setLocationPermissionchk(false);


        setTimeout(async() => {
        
          window.location.reload();
        }, 5000);
      
      }
    }).catch((error)=>{
   
    });
  }



  const captureLocation = (fromParam:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
     
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
          timeout: 100,
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
      ongoingNewHandlerWithLocation(token);
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
      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        {/* <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton onClick={()=> newLeaveRequestNav()}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab> */}
           {!locationPermissionchk ? (
             <><div className='errorDashboardData'>
             <IonSpinner name="lines"></IonSpinner>
             <i style={{ marginLeft: '10px', color: '#000' }}>
               {!locationPermissionchk ? (<>{`Check device’s GPS Location Service Enable it manually`}</>) : (<>
                
               </>)}
 
             </i>
           </div></>
         ) :(<>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('SOP / Training Guideline')}</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>
              {(SopData && SopData.length > 0) ? (
                <IonGrid>
                  {SopData.map((ticket, index) => ( 
                     <div className="content"   key={index} style={{ width: '100%' }}>
                        <p >({index+1}) <strong> {ticket.guide_heading || 'N/A'}</strong></p>
                     {ticket.sop_type==='IMAGE' ?( <><p className='sopimag-submit'><IonImg className='sopimag' src={BASEURL+`sop/${ticket.sop_name}`} 
      ></IonImg></p></>):('')
    
    }
     {ticket.sop_type==='AUDIO' ?( <>
   
     
     <p className='sopimag-submit'>   <audio controls>
        <source src={BASEURL+`sop/${ticket.sop_name}`} type="audio/mp3" />
        Your window does not support the audio element.
      </audio>
   
      </p></>):('')
    
    }
         {ticket.sop_type==='VIDEO' ?( <>
   
     
   <p className='sopimag-submit'>    <video width="100%" height="auto" controls>
        <source src={BASEURL+`sop/${ticket.sop_name}`} type="video/mp4" />
        Your window does not support the video tag.
      </video>
    </p></>):('')
  
  }
     {ticket.sop_type==='PDF' ?( <>
   
     
   <p className='sopimag-submit'>  <a href={BASEURL+`sop/${ticket.sop_name}`}  download="userIdCard" target="__blank">
     Download File
    </a>
    </p></>):('')
  
  }
    
                     
                       
                        <p>{ticket.guideline || 'N/A'} </p>
                      
                  
                    </div>
                  ))}
                </IonGrid>
              ) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No requests found</div></IonLabel>
              )}
            </IonCard>
            <div className='footer'>
            <CustomFooter />
            </div>
          </>
        )}
        {/* modal code goes below */}
        <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{'Create Leave Request'}</IonTitle>
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
                <IonInput value={reqSubject} onIonInput={e => setReqSubject(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput value={reqDesc} onIonInput={e => setReqDesc(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Other Details (From - To Date)</IonLabel>
                <IonInput value={reqOtherDetail} onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={handleCreateRequest}>Create {'Leave Request'}</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;
const AudioPlayer = (filename:any) => (
  <div>
      <audio controls>
        <source src="https://www.w3schools.com/html/horse.ogg" type="audio/mp3" />
        Your window does not support the audio element.
      </audio>
  </div>
);


const VideoPlayer = (filename:any) => (
  <div>
      <video width="100%" height="auto" controls>
        <source src={BASEURL+`sop/${filename}`} type="video/mp4" />
        Your window does not support the video tag.
      </video>
  </div>
);
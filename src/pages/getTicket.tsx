import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, 
  IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, 
  IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonInput,
   IonSelectOption, IonButton, IonModal, IonSelect,IonSpinner, useIonToast, 
  RefresherEventDetail,IonRefresher,IonRefresherContent,IonTextarea } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { Geolocation } from '@capacitor/geolocation';
const STATIC_SUBJECT_FAILURE_CASE = [
  {
    "ticket_subject_id": "1",
    "ticket_subject": "Dress required",
    "ticket_subject_type": "Gaurd",
    "last_updated_on": "2024-07-10 08:33:05"
  },
  {
    "ticket_subject_id": "2",
    "ticket_subject": "Need Some more support",
    "ticket_subject_type": "Gaurd",
    "last_updated_on": "2024-07-10 08:33:05"
  },
  {
    "ticket_subject_id": "3",
    "ticket_subject": "Some issue at my end",
    "ticket_subject_type": "Gaurd",
    "last_updated_on": "2024-07-10 08:33:50"
  },
  {
    "ticket_subject_id": "4",
    "ticket_subject": "Salary issue",
    "ticket_subject_type": "Gaurd",
    "last_updated_on": "2024-07-10 08:33:50"
  }
]

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement
  const [reloader, setReloader] = useState(false);
  const [requestData, setRequestData] = useState<any>(null);
  const [subjectList, setSubjectList] = useState<any>(STATIC_SUBJECT_FAILURE_CASE);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [priority, setPriority] = useState('LOW');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('');
  const [present, dismiss] = useIonToast();
  const [saveselecteddocument, setSaveSelectedDocument] = useState('');
  const token = localStorage.getItem('token');
  const { takePhotoWithPrompt } = usePhotoGalleryWithPrompt();
  const [showspinner, setShowspinner] = useState<boolean>(false);
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token)
      {
        ongoingNewHandlerWithLocation();
      }

  }, []);

  function getTicketListAPI(dataParam:any) {
    const url =  BASEURL+"request.php";
    const formData = new FormData();
    formData.append('action', "request_data");
    formData.append('req_type', "ticket");
    formData.append('token', token);
    formData.append('subject', "");
    formData.append('message', "");
    formData.append('priority', "");
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setRequestData(response.data.employee_data.request_data);
          console.log(response.data.employee_data.request_data, token,)
        } else {
          console.error('Failed to fetch requests:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });
  }

  function getSubjectListAPI(dataParam:any) {
    let URL = BASEURL+"ticket_subject.php";
    let formData = new FormData();
    formData.append('action', "ticket_subject");
    formData.append('token', token);
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setSubjectList(response?.data?.employee_data);
        } else {
          present({
            message: `Error getting subject list from API!`,
            duration: 2000,
            position: 'bottom',
          });
        }
      })
      .catch(error => {
        present({
          message: `Error getting subject list from API!`,
          duration: 2000,
          position: 'bottom',
        });
      });

  }

  const { name } = useParams<{ name: string; }>();

  function newTicketNav() {
    console.log("New Ticket CLickec");
    setReqType('ticket');
    setShowRequestModal(true);
  }
  
  const handleCreateRequest = () => {
    const formData = new FormData();
    setShowspinner(true);
    formData.append('action', 'add_new_request');
    formData.append('token', token);
    formData.append('reqtype', reqType);
    formData.append('reqsubject', reqSubject);
    formData.append('ReqDesc', reqDesc);
    formData.append('reqotherdetail', saveselecteddocument);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
   
    // return false;

    axios
      .post(BASEURL+'add_new_request.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          setShowspinner(false);
          present({
            message: `Your ${reqType} request has been created successfully!`,
            duration: 2000,
            position: 'bottom',
          });
          setShowRequestModal(false);
            setShowspinner(false);
          setReqSubject('');
          setReqDesc('');
          
        } else {
          setShowspinner(false);
          present({
            message: `Failed to create ${reqType} request. Please try again.`,
            duration: 2000,
            position: 'bottom',
          });
        }
      })
      .catch((error) => {
        setShowspinner(false);
        console.error(`Error creating ${reqType} request:`, error);
        present({
          message: `An error occurred. Please try again.`,
          duration: 2000,
          position: 'bottom',
        });
      });
  };



  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
       
 
        getSubjectListAPI(res);
        getTicketListAPI(res);

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
      ongoingNewHandlerWithLocation();
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
  }
  
  const handledocumentcameraStart = async () => {
    takePhotoWithPrompt().then(async (photoData:any) => {
    setSaveSelectedDocument(JSON.stringify(photoData));
  
  });
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
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
          <IonFabButton onClick={() => newTicketNav()}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        {!locationPermissionchk ? (
             <><div className='errorDashboardData'>
             <IonSpinner name="lines"></IonSpinner>
             <i style={{ marginLeft: '10px', color: '#000' }}>
               {!locationPermissionchk ? (<>{`Check device’s GPS Location Service Enable it manually`}</>) : (<>
                
               </>)}
 
             </i>
           </div></>
         ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Your Ticket Information')}</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>
              {(requestData && requestData.length > 0) ? (
                <IonGrid>
                  {requestData.map((ticket, index) => (
                   <div className="content"   key={index} style={{ width: '100%' }}>
                     <IonCard className="shift-details-card">
                     <IonCardHeader  class="ion-text-center">
  <IonCardTitle >{t('Ticket ID')} <strong>{ticket.ReqID || 'N/A'}</strong></IonCardTitle>
</IonCardHeader>
<IonCardContent className="shift-details-card-content">
                      <div className="shift-details-column">
                      <p><strong>{t('Ticket Date')}: </strong>{ticket.ReqDatetime || 'N/A'}</p>
                        <p><strong>{t('Ticket Description')}: </strong>{ticket.ReqDesc || 'N/A'}</p>
                        <p><strong>{t('Ticket Status')}: </strong>{ticket.ReqStatus || 'N/A'}</p>
                        <p><strong>{t('Ticket Action')}: </strong>{ticket.ReqAction || 'N/A'}</p>
{ticket.ReqOtherDes!='' ?( <p>  <IonImg
          className='imageionclass'
          src={BASEURL+`ticketattachment/${ticket.ReqOtherDes}`}
        ></IonImg></p>):('')}
                       
                      </div>
                      </IonCardContent>
                      </IonCard>
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
        {/* Moal code goes below */}
        <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}  >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t('Create Ticket')}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowRequestModal(false)}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {/* <IonItem> */}
              {/* <IonLabel position="floating">Subject</IonLabel> */}
              {/* <IonInput value={reqSubject} onIonInput={e => setReqSubject(e.detail.value!)}></IonInput> */}
              {/* <div>{JSON.stringify(subjectList)}</div> */}
              <IonItem>
                <IonSelect
                  label={t('Subject')}
                  placeholder={t('Select Subject')}
                  onIonChange={(e) => {
                    console.log(`ionChange fired with value: ${e.detail.value}`);
                    setReqSubject(e.detail.value);
                  }}>
                  {subjectList && subjectList.map((subjectItem: any) =>
                    <IonSelectOption value={subjectItem.ticket_subject}>{subjectItem.ticket_subject}</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>
              {/* </IonItem> */}
              <IonItem>
                <IonLabel position="floating">{t('Description')}</IonLabel>
                <IonTextarea autoGrow={true} rows={10} value={reqDesc} placeholder='Enter your ticket detail here' onIonInput={e => setReqDesc(e.detail.value!)}></IonTextarea>
              </IonItem>
            
              <IonItem>
         <IonLabel>{t('Attach Document')} </IonLabel> 
         {saveselecteddocument ? (   <IonButton expand="full"   onClick={() => {setSaveSelectedDocument('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
 {saveselecteddocument && <>
          
          <IonItem>
             <img onClick={handledocumentcameraStart}
               src={`data:image/jpeg;base64,${JSON.parse(saveselecteddocument).base64String}`}
               alt="Preview Image"
               style={{ width: 'auto', height: '100px' }}
             />
           </IonItem>
         </>}

         {!saveselecteddocument &&<>   
 <IonItem>     <img onClick={handledocumentcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}

            </IonList>

            {showspinner ? (
         <IonItem className='spinner_loc'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
            <IonButton disabled={showspinner}  expand="full" onClick={handleCreateRequest}>Create {'Ticket'}</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;

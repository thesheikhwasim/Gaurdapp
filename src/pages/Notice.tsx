import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, 
  IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonItem, IonList, IonLabel, IonLoading, IonIcon,IonSpinner, IonModal, IonButton, 
  RefresherEventDetail,IonRefresher,IonRefresherContent, IonGrid, 
  IonRow,
  IonCol} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';
import { addCircle, mailUnread, mailUnreadOutline, personCircle } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { Geolocation } from '@capacitor/geolocation';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';
const Notice: React.FC = () => {
  const [noticeData, setNoticeData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeDetails, setNoticeDetails] = useState({});
  const [reloader, setReloader] = useState(false);
  const [latitude, setLatitude] = useState(false);
  const [longitude, setLongitude] = useState(false);
  const [noticecontent, setNoticeContent] = useState('');
  const [noticesubject, setNoticeSubject] = useState('');
  const [noticefiletype, setNoticeFileType] = useState('');
  const [noticefile, setNoticeFile] = useState('');
   const [notificationpublishedon, setNotificationPublishedon] = useState('');
  const [noticeinboxid, setNoticeInboxid] = useState('');
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  const sellanguage = localStorage.getItem('language');
  const token = localStorage.getItem('token');
  useEffect(() => {
  
    
    if (!token) {
      logoutvalidate();
    }
    else
    {
      ongoingNewHandlerWithLocation(token);
    }
    
   

  }, [history]);

  async function logoutvalidate()
  {
  
  const checklogin= await Checkvalidtoken();
 
  if(checklogin){
    history.push('/pages/login');
    window.location.reload();
    return false;
}

}

  const fetchNoticeData = async (dataParam:any) => {
    
    const token = localStorage.getItem('token');
    const url = BASEURL+'notice.php';
    const formData = new FormData();
    formData.append('action', 'notice_data');
    formData.append('token', token);
    formData.append('language', sellanguage);
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.success) {
        setNoticeData(response.data.employee_data);
      
      } else {
        console.error('Failed to fetch notice data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const { name } = useParams<{ name: string }>();

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  
  function ongoingNewHandlerWithLocation(token:any){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
  
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
       
        fetchNoticeData(res);

      }else{
        setLocationPermissionchk(false);
        present({
          message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
          duration: 5000,
          position: 'bottom',
        });

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
            duration: 5000,
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


  function triggerDetails(item) {
    setNoticeDetails(item);
    if (item?.ShowStatus != 1) {
      callReadApi(item);
    }
    setModalOpen(true);
  }

  function callReadApi(item) {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"notice_status.php";
    const formData = new FormData();
    formData.append('action', "notice_status");
    formData.append('token', tokenVal);
    formData.append('notification_status', "1");
    formData.append('notice_inbox_id', item);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          console.log("Updated notice status");
        } else {
          console.error('Failed to update status:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error updating status info:', error);
        setLoading(false);
      });
  }
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      setLocationPermissionchk(true);
      ongoingNewHandlerWithLocation(token);
      setLocationPermissionchk(true);
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
  }

  const addLineBreak = (str: string) =>
    str.split('\n').map((subStr) => {
      return (
        <>
          {subStr}
          <br />
        </>
      );
    });
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
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        
        <div className='ion-text-center shadowCard'>
        <IonCard className="shift-details-card_notice">
          <IonCardHeader>
            <IonCardTitle className='logintitle' color={'dark'}>{t('Notice Board')} {t('Important Points for Guards/Duty')}</IonCardTitle>
       
          </IonCardHeader>

          <IonCardContent>
          {!locationPermissionchk ? (
             <><div className='errorDashboardData'>
             <IonSpinner name="lines"></IonSpinner>
             <i style={{ marginLeft: '10px', color: '#000' }}>
               {!locationPermissionchk ? (<>{`Check device’s GPS Location Service Enable it manually`}</>) : (<>
                
               </>)}
 
             </i>
           </div></>
         ):(<>
            <IonGrid>
      
        
  <IonRow  className="shift-details-column">
  {/*  <IonCol className='texthead'><strong>RANK</strong></IonCol>*/}
    <IonCol className='texthead' ><strong>Date</strong></IonCol>
    <IonCol className='texthead'  size="8"><strong>Subject</strong></IonCol>
  </IonRow>
  {noticeData && noticeData.length > 0 ? (
                noticeData.map((item: any, index: number) => (
  <IonRow   key={index} >
   {item?.read_status===0 ?(<>
    <IonCol   className='notice_listing_unread'>
    <a 
                      onClick={() => {
                        setNoticeContent(item?.notice_content);
                        setNoticeSubject(item?.notice_subject);
                        setNotificationPublishedon(item?.notification_published_on);
                        setNoticeInboxid(item?.notice_inbox_id);
                        setNoticeFileType(item?.notice_file_type);
                        setNoticeFile(item?.notice_file);
                        setModalOpen(true);
                        callReadApi(item?.notice_inbox_id);
                      }}>
      {item?.notification_published_on.split(' ')[0]}
      </a></IonCol>
    <IonCol  className='notice_listing_unread' size="8">
    <a 
                      onClick={() => {
                        setNoticeContent(item?.notice_content);
                        setNoticeSubject(item?.notice_subject);
                        setNotificationPublishedon(item?.notification_published_on);
                        setNoticeInboxid(item?.notice_inbox_id);
                        setNoticeFileType(item?.notice_file_type);
                        setNoticeFile(item?.notice_file);
                        setModalOpen(true);
                        callReadApi(item?.notice_inbox_id);
                      }}>
       {item?.notice_subject}
      </a></IonCol>
   
   </> ):(<>
    <IonCol  className='notice_listing'>
    <a 
                      onClick={() => {
                        setNoticeContent(item?.notice_content);
                        setNoticeSubject(item?.notice_subject);
                        setNotificationPublishedon(item?.notification_published_on);
                        setNoticeInboxid(item?.notice_inbox_id);
                        setNoticeFileType(item?.notice_file_type);
                        setNoticeFile(item?.notice_file);
                        setModalOpen(true);
                        callReadApi(item?.notice_inbox_id);
                      }}>
      {item?.notification_published_on.split(' ')[0]}
      </a></IonCol>
    <IonCol  className='notice_listing' size="8"><a 
                      onClick={() => {
                        setNoticeContent(item?.notice_content);
                        setNoticeSubject(item?.notice_subject);
                        setNotificationPublishedon(item?.notification_published_on);
                        setNoticeInboxid(item?.notice_inbox_id);
                        setNoticeFileType(item?.notice_file_type);
                        setNoticeFile(item?.notice_file);
                        setModalOpen(true);
                        callReadApi(item?.notice_inbox_id);
                      }}>
                        {item?.notice_subject}
                        </a></IonCol>
   
   </>)}
   
  </IonRow>
))
              ) : (
                <IonLabel><div className='notFound'>
                <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                No notice found</div>
              </IonLabel>
              )}

{/*
      
              {(noticeData && noticeData.length > 0) ? (noticeData.map((item, index) => (
                 <div className="content"   key={index} style={{ width: '100%' }}>
                 <IonCardContent className="shift-details-card-content">
                   <div style={{textAlign:'left'}}>
                    {item?.read_status===0 ?(<>
                      <div className='notice_listing_unread'>({index+1}) <a 
                      onClick={() => {
                        setNoticeContent(item?.notice_content);
                        setNoticeSubject(item?.notice_subject);
                        setNotificationPublishedon(item?.notification_published_on);
                        setNoticeInboxid(item?.notice_inbox_id);
                        setModalOpen(true);
                        callReadApi(item?.notice_inbox_id);
                      }}><strong> {item?.notice_subject || ''}  On {item?.notification_published_on || ''}</strong></a>
                      
                      
                      </div>
                      </>):(
      <div className='notice_listing'>({index+1}) <a  
      onClick={() => {
        setNoticeContent(item?.notice_content);
        setNoticeSubject(item?.notice_subject);
        setNoticeFileType(item?.notice_file_type);
        setNoticeFile(item?.notice_file);
        setNotificationPublishedon(item?.notification_published_on);
        setNoticeInboxid(item?.notice_inbox_id);
        setModalOpen(true)
      }}>{item?.notice_subject || ''} On {item?.notification_published_on || ''}</a>
      
      
      </div>

                      )}
                     </div>
                   </IonCardContent>
               
                </div>
              ))) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No notice found</div>
                </IonLabel>
              )}   

              */}
            </IonGrid>
            </>)}
            <IonModal id="example-modal" isOpen={modalOpen} onDidDismiss={() => {
              ongoingNewHandlerWithLocation(token);
              setNoticeContent('');
              setNoticeSubject('');
              setNoticeFileType('');
              setNoticeFile('');
              setNotificationPublishedon('');
              setNoticeInboxid('');
              setModalOpen(false);
            }}>
              <div className="wrapper">
              <IonCard className="shift-details-card">
<IonCardHeader  class="ion-text-center">
  <IonCardTitle >{noticesubject} </IonCardTitle>
</IonCardHeader>

<IonCardContent className="shift-details-card-content">
  <div className="shift-details-column">

    <p><strong>{noticesubject}</strong></p>
    <p><strong>{addLineBreak(noticecontent)}</strong></p>
    {noticefiletype==='IMAGE' ?( <><p className='sopimag-submit'><IonImg className='sopimag' src={BASEURL+`sop/${noticefile}`} 
      ></IonImg></p></>):('')
    }
         {noticefiletype==='AUDIO' ?( <>
   
     
   <p className='sopimag-submit'> <audio controls>
      <source src={BASEURL+`sop/${noticefile}`} type="audio/mp3" />
      Your window does not support the audio element.
    </audio>
 
    </p></>):('')
  
  }
       {noticefiletype==='VIDEO' ?( <>
 
   
 <p className='sopimag-submit'>    <video width="100%" height="auto" controls>
      <source src={BASEURL+`sop/${noticefile}`} type="video/mp4" />
      Your window does not support the video tag.
    </video>
  </p></>):('')

}

{noticefiletype==='PDF' ?( <>
   
     
   <p > <strong> <a href={BASEURL+`sop/${noticefile}`}  download="userIdCard" target="__blank">
     Download File
    </a></strong>
    </p></>):('')
    }
    <p><strong>{t('Notice Date')}:</strong> {notificationpublishedon}</p>
   

  </div>
</IonCardContent>


</IonCard> 
              </div>
            </IonModal>
          </IonCardContent>
          </IonCard>
        </div>
        <div className='footer'>
        <CustomFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notice;
function present(arg0: { message: string; duration: number; position: string; }) {
  throw new Error('Function not implemented.');
}


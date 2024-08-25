import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, 
  IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonList, 
  IonItem, IonInput, IonSelect, IonSelectOption,
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

  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('language');
 
  useEffect(() => {
    const url = BASEURL+"sop.php";
    const formData = new FormData();
    formData.append('action', "sop_data");
   
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
  }, []);



  
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

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
    //console.log("PAGE TO be ReFRESHED");
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
          <IonContent className="page-content">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher></IonContent>
           <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton onClick={()=> newLeaveRequestNav()}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab> */}
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('SOP / Training Guideline')}</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>
              {(SopData && SopData.length > 0) ? (
                <IonGrid>
                  {SopData.map((ticket, index) => ( 
                     <div className="content"   key={index} style={{ width: '100%' }}>
                        <p >({index+1}) <strong> {ticket.guide_heading || 'N/A'}</strong></p>
                        <p>{ticket.guideline || 'N/A'}</p>
                        <p><IonImg src={BASEURL+`sop/${ticket.sop_img}`} 
      ></IonImg></p>
                      
                  
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

import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [priority, setPriority] = useState('LOW');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('');
  const [present, dismiss] = useIonToast();
  const [reqOtherDetail, setReqOtherDetail] = useState('');


  const token = localStorage.getItem('token');
  useEffect(() => {
    const url = "https://guard.ghamasaana.com/guard_new_api/request.php";
    const formData = new FormData();
    formData.append('action', "request_data");
    formData.append('req_type', "req");
    formData.append('token', token);
    formData.append('subject', "");
    formData.append('message', "");
    formData.append('priority', "");

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
      .post('https://guard.ghamasaana.com/guard_new_api/add_new_request.php', formData)
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
              <IonTitle className="header_title ion-text-center">Your Request Information</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>
              {(requestData && requestData.length > 0) ? (
                <IonGrid>
                  {requestData.map((ticket, index) => (
                    <IonCard className='card' key={index}>
                      <div className="shift-details-column">
                        <p><strong>Request Type: </strong>{ticket.ReqType || 'N/A'}</p>
                        <p><strong>Request Date : </strong>{ticket.ReqDatetime || 'N/A'}</p>
                        <p><strong>Request Description : </strong>{ticket.ReqDesc || 'N/A'}</p>
                        <p><strong>Request ID : </strong>{ticket.ReqID || 'N/A'}</p>
                        <p><strong>Request Status : </strong>{ticket.ReqStatus || 'N/A'}</p>
                        <p><strong>Request Action : </strong>{ticket.ReqAction || 'N/A'}</p>
                      </div>
                    </IonCard>
                  ))}
                </IonGrid>
              ) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No requests found</div></IonLabel>
              )}
            </IonCard>
            <div className='footer'>
              <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
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

import React, { useState, useEffect } from 'react';
import {
  IonButtons,
  IonLoading,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast,
  IonAlert,
  IonList,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';

const DutyInfo: React.FC = () => {
  const [dutyData, setDutyData] = useState<any>([]);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setReqType] = useState('ticket');
  const [Dutyid, setDutyid] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [ReqDesc, setReqDesc] = useState('');
  const [reqOtherDetail, setReqOtherDetail] = useState('LOW');
  const [present, dismiss] = useIonToast();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedData = localStorage.getItem('loggedInUser');
       
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }

    const url = "https://guard.ghamasaana.com/guard_new_api/dutyinfo.php";
    const formData = new FormData();
    formData.append('action', "duty_info");
    formData.append('token', token);

    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setDutyData(response.data.employee_data.duty_info);
        } else {
          console.error('Failed to fetch duty info:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching duty info:', error);
        setLoading(false);
      });
  }, [history]);

  const { name } = useParams<{ name: string; }>();

  const getDisplayValue = (value: any) => value ? value : 'N/A';

  const handleCreateRequest = () => {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'add_new_request');
    formData.append('token', token);
    formData.append('reqtype', reqType);
    formData.append('reqsubject', reqSubject);
    formData.append('ReqDesc', ReqDesc);
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
          setReqOtherDetail('LOW');
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
          
          <div className="header_title">
        <IonTitle className="header_title ion-text-center">Your Duty Info</IonTitle>
      </div>
            
          
          
            <IonCard className='shift-details-card-content'>
           

                {dutyData.length > 0 ? (
                  dutyData.map((duty: any, index: number) => (
                    <IonCard className="card" key={index} style={{ width: '100%' }}>
                       <div className="shift-details-column">
                <p><strong>Duty Started On:</strong> {getDisplayValue(duty.duty_start_date)}</p>
                <p><strong>Duty Ended On:</strong> {getDisplayValue(duty.duty_end_date)}</p>
                <p><strong>Duty Start Verified?:</strong> {getDisplayValue(duty.start_verification_status)}</p>
                <p><strong>Duty End Verified?:</strong> {getDisplayValue(duty.end_verification_status)}</p>
                <IonButton style={{ width: '100%' }} expand="block" color="primary" onClick={() => { setDutyid(duty.duty_id); setReqType('ticket'); setShowRequestModal(true); }}>Raise Concern</IonButton>
              </div>
                    </IonCard>
                  ))
                ) : (
                  <IonLabel>No current duty running</IonLabel>
                )}
              
            </IonCard>

            <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>{reqType === 'sos' ? 'Create SOS Request' : reqType === 'leaveapplication' ? 'Create Leave Request' : 'Create Ticket'}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowRequestModal(false)}>X</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">Subject</IonLabel>
                    <IonInput value="Request Raised for {Dutyid} by " onIonChange={e => setReqSubject(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonInput value={ReqDesc} onIonChange={e => setReqDesc(e.detail.value!)}></IonInput>
                  </IonItem>
                  {reqType === 'leaveapplication' ? (
                    <IonItem>
                      <IonLabel position="floating">Other Details (From - To Date)</IonLabel>
                      <IonInput value={reqOtherDetail} onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>
                    </IonItem>
                  ) : reqType === 'ticket' ? (
                    <IonItem>
                      <IonLabel position="floating">Duty ID:  </IonLabel>
                      <IonInput value={Dutyid} readonly onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>
                   
                    </IonItem>
                    
                  ) : null}
                </IonList>
                <IonButton expand="full" onClick={handleCreateRequest}>Create {reqType === 'ticket' ? 'Ticket' : reqType === 'leaveapplication' ? 'Leave Request' : 'SOS Request'}</IonButton>
              </IonContent>
            </IonModal>
          </>
        )}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Alert'}
          message={alertMessage}
          buttons={['OK']}
        />
        
      </IonContent>
      <div className="footer">
        <IonTitle className="footer ion-text-center">Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    </IonPage>
    
  );
};

export default DutyInfo;

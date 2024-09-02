import React, { useState, useEffect, useRef } from 'react';
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
  IonFab, 
  IonFabButton, 
  IonIcon,
  IonItem,
  IonButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast,
  IonAlert,
  IonList,
  IonDatetimeButton,
  IonDatetime,

  IonTextarea,
} from '@ionic/react';
import { useParams, useHistory, Redirect } from 'react-router';
import './Page.css';
import axios from 'axios';
import { arrowForwardCircleOutline, calendarOutline } from 'ionicons/icons';
import { add, closeOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom'
import { BASEURL } from '../utilities_constant';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { t } from 'i18next';

const Listgaurd: React.FC = () => {
  const [GaurdData, setGaurdData] = useState<any>([]);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setReqType] = useState('ticket');
  const [Dutyid, setDutyid] = useState('');
  const [DutyEndDate, setDutyEndDate] = useState('');
  const [DutySubject, setDutySubject] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [ReqDesc, setReqDesc] = useState('');
  const [reqOtherDetail, setReqOtherDetail] = useState('LOW');
  const [present, dismiss] = useIonToast();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [perPageRecord, setPerPageRecord] = useState(10);
  let initialAsignedDates = new Date().toLocaleDateString('en-CA')
  const [rangeTo, setRangeTo] = useState(initialAsignedDates);
  const [rangeFrom, setRangeFrom] = useState(initialAsignedDates);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [totalRecordCount, setTotalRecordCount] = useState(0);

  const modalFrom = useRef<HTMLIonModalElement>(null);
  const modalTo = useRef<HTMLIonModalElement>(null);

  

  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
    GetGaurdListFromAPI();
  }, [history]);

  useEffect(() => {
    if (totalRecordCount > 0) {
      if (pageNumber > 0) {
        GetGaurdListFromAPI();
      }
    }
  }, [pageNumber]);

  const callDateFilter = () =>{
    GetGaurdListFromAPI();
  }

  const GetGaurdListFromAPI = () => {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"list_gaurd.php";
    const formData = new FormData();
    formData.append('action', "list_gaurd");
    formData.append('token', tokenVal);
 
  
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          if (response?.data?.employee_data?.gaurd_info?.length > 0) { //condition to update count of record
            setTotalRecordCount(response.data.employee_data.gaurd_info.length);
          }
          setGaurdData(response.data.employee_data.gaurd_info);
        } else {
          console.error('Failed to fetch duty info:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching duty info:', error);
        setLoading(false);
      });

  }

  const { name } = useParams<{ name: string; }>();

  const getDisplayValue = (value: any) => value ? value : 'N/A';

  const handleCreateRequest = () => {
    console.log("DESC::: ", ReqDesc);
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'add_new_request');
    formData.append('token', token);
    formData.append('reqtype', reqType);
    formData.append('reqsubject', DutySubject);
    formData.append('ReqDesc', ReqDesc);
    formData.append('reqotherdetail', reqOtherDetail);

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
          setReqOtherDetail('LOW');
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



  function newpostreportNav() {
   
  //  setReqType('newpostreport');
  //  setShowRequestModal(true);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <CustomHeader />
        </IonToolbar>
      </IonHeader>
      <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton href='pages/AddNewGuard' onClick={()=>newpostreportNav()

        }>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab> 
      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Recruitment List')}</IonTitle>
            </div>
         

            <IonCard className='shift-details-card-content'>


              {GaurdData.length > 0 ? (
                GaurdData.map((duty: any, index: number) => (
                  <div className="content"   key={index} style={{ width: '100%' }}>
                     <IonCard className="shift-details-card">
                     <IonCardHeader  class="ion-text-center">
  <IonCardTitle >{t('Recruitment ID')} <strong>{getDisplayValue(duty.reguid)}</strong></IonCardTitle>
</IonCardHeader>
<IonCardContent className="shift-details-card-content">
                    <div className="shift-details-column">
                   
                      <p><strong>{t('Full Name')}:</strong> {getDisplayValue(duty.fullname)}</p>
                      <p><strong>{t('Mobile Number')}:</strong> {getDisplayValue(duty.mobileno)}</p>
                      <p><strong>{t('Father`s Name')}:</strong> {getDisplayValue(duty.father_name)}</p>
                      <p><strong>{t('Mother`s Name')}:</strong> {getDisplayValue(duty.mother_name)}</p>
                      <p><strong>{t('Full Address')}:</strong> {getDisplayValue(duty.full_address)}</p>
                      <p><strong>{t('State')}:</strong> {getDisplayValue(duty.state)}</p>
                      <p><strong>{t('Request Date')}:</strong> {getDisplayValue(duty.date)}</p>
                      <p><strong>{t('Request Status')}:</strong> {getDisplayValue(duty.enquiry_status)}</p>
                    </div>
                    </IonCardContent>
                    </IonCard>
                  </div>
                ))
              ) : (
                <IonLabel>You have not added any gaurd</IonLabel>
              )}

            </IonCard>



            <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>{'Add New Guard'}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowRequestModal(false)}>X</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">Subject</IonLabel>
                    <IonInput disabled={true} value={`Request Raised for ${Dutyid} on ${DutyEndDate.split(' ')[0]}`} onIonChange={e => setReqSubject(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    {/* <IonLabel position="floating">Description</IonLabel> */}
                    <IonTextarea label="Description" labelPlacement="stacked" value={ReqDesc} onIonInput={e => {
                      setReqDesc(e.detail.value!);
                      console.log("entered desc i::::::::::::::::::::::::::", e.detail.value);
                    }}></IonTextarea>
                  </IonItem>
                  {reqType === 'leaveapplication' ? (
                    <IonItem>
                      <IonLabel position="floating">Other Details (From - To Date)</IonLabel>
                      <IonInput multiple={true} value={reqOtherDetail} onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>
                    </IonItem>
                  ) : reqType === 'ticket' ? (
                    <IonItem>
                      <IonLabel position="floating">Duty ID:  </IonLabel>
                      <IonInput disabled={true} value={Dutyid} readonly onIonChange={e => setReqOtherDetail(e.detail.value!)}></IonInput>

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
      <CustomFooter />
      </div>
    </IonPage>

  );
};

export default Listgaurd;

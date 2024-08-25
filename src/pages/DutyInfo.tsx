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
  IonIcon,
  IonTextarea,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';
import { arrowForwardCircleOutline, calendarOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const DutyInfo: React.FC = () => {
  const [dutyData, setDutyData] = useState<any>([]);
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
  const [isOperations, setIsOperations] = useState(false)

  const modalFrom = useRef<HTMLIonModalElement>(null);
  const modalTo = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
      let tempSTdata = JSON.parse(storedData);
      if (tempSTdata && tempSTdata?.designation_catagory && tempSTdata?.designation_catagory == "Operation") {
        setIsOperations(true);
        GetDutyListFromAPIhandler(true);
      }else{
        GetDutyListFromAPIhandler(false);
      }
    }
  }, [history]);

  useEffect(() => {
    if (totalRecordCount > 0) {
      if (pageNumber > 0) {
        GetDutyListFromAPIhandler();
      }
    }
  }, [pageNumber]);

  const callDateFilter = () => {
    GetDutyListFromAPIhandler();
  }

  const GetDutyListFromAPIhandler = (isOperationsParameter:any) => {
    // alert(isOperationsParameter)
    if (isOperations || isOperationsParameter) {
      GetOperationsDutyListFromAPI();
    } else {
      GetDutyListFromAPI()
    }
  }

  const GetDutyListFromAPI = () => {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"dutyinfo.php";
    let formData = new FormData();
    formData.append('action', "duty_info");
    formData.append('token', tokenVal);
    if (pageNumber != '') {
      formData.append('pagenumber', pageNumber);
    }
    if (perPageRecord != '') {
      formData.append('perpagerecords', perPageRecord);
    }
    if (rangeFrom != '') {
      formData.append('rangeFrom', rangeFrom);
    }
    if (rangeTo != '') {
      formData.append('rangeTo', rangeTo);
    }
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          if (response?.data?.employee_data?.duty_info?.length > 0) { //condition to update count of record
            setTotalRecordCount(response.data.employee_data.duty_info.length);
          }
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

  }

  const GetOperationsDutyListFromAPI = () => {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"opdutyinfo.php";
    let formData = new FormData();
    formData.append('action', "op_duty_info");
    formData.append('token', tokenVal);
    if (pageNumber != '') {
      formData.append('pagenumber', pageNumber);
    }
    if (perPageRecord != '') {
      formData.append('perpagerecords', perPageRecord);
    }
    if (rangeFrom != '') {
      formData.append('rangeFrom', rangeFrom);
    }
    if (rangeTo != '') {
      formData.append('rangeTo', rangeTo);
    }
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          if (response?.data?.employee_data?.op_duty_info?.length > 0) { //condition to update count of record
            setTotalRecordCount(response.data.employee_data.op_duty_info.length);
          }
          setDutyData(response.data.employee_data.op_duty_info);
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

  function getPaginationHTML() {
    const rows = [];
    for (let i = 0; i <= parseInt(totalRecordCount / perPageRecord); i++) {
      rows.push(<li><a className={pageNumber == (i + 1) ? "active" : "generic"} onClick={() => setPageNumber(i + 1)}>{i + 1}</a></li>);
    }
    return rows;
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
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Your Duty Info')}</IonTitle>
            </div>
            <>
              <div style={{ padding: '0px 20px', fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}
              >{t('Filter by Date')}:</div>
              <div className='dateTimeFilterParent'>
                <div className='dateFromParent'>
                  <span className='dateTileSpan'>{t('Date From')}:</span>
                  <>
                  <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                  <IonModal keepContentsMounted={true} ref={modalTo}>
                      <IonDatetime
                        id="datetime"
                        presentation='date'
                        onIonChange={(datetime) => {
                          let dateFormat = datetime?.detail?.value.split('T')[0];
                          setRangeTo(dateFormat);
                          modalTo.current?.dismiss()
                        }}></IonDatetime>
                    </IonModal>
<IonModal keepContentsMounted={true}>
  <IonDatetime id="datetime"></IonDatetime>
</IonModal>
                  </>
                </div>
                <div className='dateToParent'>
                  <span className='dateTileSpan'>{t('Date To')}:</span>
                  <>
                    <IonDatetimeButton datetime="dateTo"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true} ref={modalTo}>
                      <IonDatetime
                        id="dateTo"
                        presentation='date'
                        onIonChange={(dataTo) => {
                          let dateFormat = dataTo?.detail?.value.split('T')[0];
                          setRangeTo(dateFormat);
                          modalTo.current?.dismiss()
                        }}></IonDatetime>
                    </IonModal>
                  </>
                </div>
                <div style={{ alignContent: 'end', marginTop: '15px', color: '#3F51B5', fontSize: '35px' }}>
                  <IonIcon icon={arrowForwardCircleOutline} onClick={() => callDateFilter()} />
                </div>
              </div>
            </>

    
 

              {dutyData.length > 0 ? (
                dutyData.map((duty: any, index: number) => (
            
                             <div className="content"   key={index} style={{ width: '100%' }}>
        <IonCard className="shift-details-card">
<IonCardHeader  class="ion-text-center">
  <IonCardTitle >{t('Your Duty Detail')}  <strong>{getDisplayValue(duty.duty_start_date).split(' ')[0]}</strong></IonCardTitle>
</IonCardHeader>

<IonCardContent className="shift-details-card-content">
  <div className="shift-details-column">
  <p className='duty-start-pic-guard'><strong>{t('Your Duty Pic')}:</strong> <IonImg
        src={BASEURL+`dutyverificationimg/${duty?.duty_start_pic}`}
      ></IonImg></p>
    <p><strong>{t('Site ID')}:</strong> {getDisplayValue(duty.site_id)}</p>
    <p><strong>{t('Authorized Shift')}:</strong> {getDisplayValue(duty.shift)}</p>
    <p><strong>{t('Duty Start Verified')}?:</strong> {getDisplayValue(duty.start_verification_status)}</p>
    <p><strong>{t('Shift Start Time')}:</strong> {getDisplayValue(duty.duty_start_date)}</p>
    <p><strong>{t('Shift End Time')}:</strong> {getDisplayValue(duty.duty_end_date)}</p>
      </div>
  <div className="shift-details-column">
    <p><strong>{t('Duty End Verified')}?:</strong> {getDisplayValue(duty.end_verification_status)}</p>
    <p><strong>{t('Total Time On Duty')}:</strong>{getDisplayValue(duty.totalhours)}</p>
    <p > {!isOperations && <IonButton  style={{ width: '100%' }} expand="block" color="primary" onClick={() => {
                        setDutyid(duty.duty_id);
                        setDutyEndDate(duty.duty_end_date);
                        setDutySubject(`Request Raised for ${duty?.duty_id} on ${duty?.duty_end_date.split(' ')[0]}`);
                        setReqType('ticket');
                        setShowRequestModal(true);
                      }}>{t('Raise Concern')}</IonButton>}</p>

  </div>
</IonCardContent>


</IonCard> 

               
                 
                    
                  
                  </div>
                 
                 
                ))
              ) : (
                <IonLabel className='noRunningDutyEmptyBlock'>No current duty running</IonLabel>
              )}

    

            {totalRecordCount && <div className='pagination'>
              <ul id="border-pagination">
                <li><a onClick={() => {
                  if (pageNumber > 1) {
                    setPageNumber(pageNumber - 1);
                  }
                }}>«</a></li>
                {getPaginationHTML()}
                <li><a onClick={() => {
                  if (pageNumber < (parseInt(totalRecordCount / perPageRecord) + 1)) {
                    setPageNumber(pageNumber + 1);
                  }
                }}>»</a></li>
              </ul>
            </div>
            }

            <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>{t('Create Ticket')}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowRequestModal(false)}>X</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  <IonItem>
                    <IonLabel position="floating">{t('Subject')}</IonLabel>
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
                <IonButton expand="full" onClick={handleCreateRequest}>{t('Create Ticket')}</IonButton>
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

export default DutyInfo;

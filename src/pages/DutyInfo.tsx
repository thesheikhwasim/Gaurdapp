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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonTextarea,
  IonSpinner,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';
import { arrowForwardCircleOutline, calendarOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { add, closeOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';
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
  const [reloader, setReloader] = useState(false);
  const [dutyDatapermission, setDutyDatapermission] = useState(false);
  const modalFrom = useRef<HTMLIonModalElement>(null);
  const modalTo = useRef<HTMLIonModalElement>(null);
  const [showspinner, setshowspinner] = useState<boolean>(false);
  const [showfullModal, setshowfullModal] = useState(false);
  const [showimagepath, setshowimagepath] = useState('');
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
     
      setLoggedInUser(JSON.parse(storedData));
      ongoingNewHandlerWithLocation();
     
    }
    else
    {
      logoutvalidate();
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
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
        setLocationPermissionchk(true);
        const storedData11 = localStorage.getItem('loggedInUser');
        let tempSTdata = JSON.parse(storedData11);

   


        if (tempSTdata && tempSTdata?.designation_catagory && tempSTdata?.designation_catagory == "Operation") {
          setIsOperations(true);
          GetOperationsDutyListFromAPI(res);
        }else{
          GetDutyListFromAPI(res)
        }

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
        console.log("PERMISSION to show message and send DUMMY", permissions);
        console.log("ABOVE PERMISSION WAS ASKED FROM--- ", fromParam);
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
          timeout: 5000,
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




  const GetDutyListFromAPI = (dataParam) => {
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
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
    setLoading(true);
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setDutyDatapermission(true);
          if (response?.data?.employee_data?.duty_info?.length > 0) { //condition to update count of record
            setTotalRecordCount(response.data.employee_data.duty_info.length);
          }
          setDutyData(response.data.employee_data.duty_info);
        } else {
          if(response.data.message==='Invalid token. Please login again!')
          {
            logoutvalidate();
          }
          if(dutyDatapermission)
          {
            setTimeout(async() => {
              setDutyDatapermission(false);
              window.location.reload();
            }, 500);
          }
        
          console.error('Failed to fetch duty info:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching duty info:', error);
        setLoading(false);
      });

  }

  const GetOperationsDutyListFromAPI = (dataParam) => {
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
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
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
    formData.append('reqotherdetail', '');
    setshowspinner(true);
    axios
      .post(BASEURL+'add_new_request.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          present({
            message: `Your ${reqType} request has been created successfully!`,
            duration: 2000,
            position: 'bottom',
          });
          setshowspinner(false);
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
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      GetDutyListFromAPI();
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
        {loading && !locationPermissionchk ? (

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
              <IonTitle className="header_title ion-text-center">{t('Your Duty Info')}</IonTitle>
            </div>
        

    
            

              {dutyData.length > 0 ? (
                dutyData.map((duty: any, index: number) => (
            
                             <div className="content"   key={index} style={{ width: '100%' }}>
        <IonCard className="shift-details-card">
<IonCardHeader  class="ion-text-center">
  <IonCardTitle >{t('Your Duty Detail')}  <strong>{getDisplayValue(duty.duty_start_date).split(' ')[0]}</strong></IonCardTitle>
</IonCardHeader>

<IonCardContent className="shift-details-card-content">
  <div className="shift-details-column">
  <p className='duty-start-pic-guard'><strong>{t('Your Start Duty Image')}:</strong> <IonImg
      onClick={() => {
        setshowimagepath(duty?.duty_start_pic);
  setshowfullModal(true);
 }}  src={BASEURL+`dutyverificationimg/${duty?.duty_start_pic}`}
      ></IonImg></p>
{duty.end_verification_status!='SYSTEM GENERATED' &&
<p className='duty-start-pic-guard'><strong>{t('Your End Duty Image')}:</strong> <IonImg
      onClick={() => {
        setshowimagepath(duty?.duty_end_pic);
  setshowfullModal(true);
 }}  src={BASEURL+`dutyverificationimg/${duty?.duty_end_pic}`}
      ></IonImg></p>
} 
    <p><strong>{t('Site ID')}:</strong> {getDisplayValue(duty.site_id)}</p>
    <p><strong>{t('Authorized Shift')}:</strong> {getDisplayValue(duty.shift)}</p>
    <p><strong>{t('Duty Start Verified')}?:</strong> {getDisplayValue(duty.start_verification_status)}</p>
    <p><strong>{t('Duty Start Time')}:</strong> {getDisplayValue(duty.duty_start_date)}</p>
    <p><strong>{t('Duty End Time')}:</strong> {getDisplayValue(duty.duty_end_date)}</p>
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
              ) : (<><div className='errorDashboardData'>
                <IonSpinner name="lines"></IonSpinner>
                <i style={{ marginLeft: '10px', color: '#000' }}>
                  <>{`You don't have permission, Please contact Admin`}
                  </>
                  </i>
          </div>
                  </>)}

    

            {totalRecordCount!==0 && <div className='pagination'>
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
                          src={BASEURL+`dutyverificationimg/${showimagepath}`}
                        ></IonImg>
              </IonItem>
           

            </IonList>
              </IonContent>
        </IonModal>



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
                {showspinner ? (
         <IonItem className='daily-report-submit'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
                <IonButton disabled={showspinner} expand="full" onClick={handleCreateRequest}>{t('Create Ticket')}</IonButton>
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

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
  IonRefresher,
  IonRefresherContent,
  IonTextarea,
  IonSpinner,
} from '@ionic/react';
import { useParams, useHistory, Redirect } from 'react-router';
import './Page.css';
import axios from 'axios';
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { arrowForwardCircleOutline, calendarOutline } from 'ionicons/icons';
import { add, closeOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom'
import { BASEURL } from '../utilities_constant';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { t } from 'i18next';
import { Geolocation } from '@capacitor/geolocation';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';

const Listgaurd: React.FC = () => {
  const [GaurdData, setGaurdData] = useState<any>([]);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqType, setreqType] = useState('ticket');
  const [Dutyid, setDutyid] = useState('');
  const [DutySubject, setDutySubject] = useState('');
  const [ReqDesc, setReqDesc] = useState('');
  const [reqOtherDetail, setReqOtherDetail] = useState('LOW');
  const [present, dismiss] = useIonToast();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  let initialAsignedDates = new Date().toLocaleDateString('en-CA')
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [reloader, setReloader] = useState(false);
  const modalFrom = useRef<HTMLIonModalElement>(null);
  const modalTo = useRef<HTMLIonModalElement>(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [saveSelectededucation, setsaveSelectededucation] = useState('');
  const [savepanpic, setsavepanpic] = useState('');
  const [savebankpic, setsavebankpic] = useState('');
   const [savegunpic, setsavegunpic] = useState('');
  const [saveepfpic, setsaveepfpic] = useState('');
  const [saveSelectedpolice, setsaveSelectedpolice] = useState('');
  const [saveSelectedmedical, setsaveSelectedmedical] = useState('');
  const { takePhotoWithPrompt } = usePhotoGalleryWithPrompt();
  const [showspinner, setshowspinner] = useState(false);
  const [text1value, settext1value] = useState('');
  const [text2value, settext2value] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
  
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
      ongoingNewHandlerWithLocation(token);
    }
    else
    {
      logoutvalidate();
    }

  }, [history]);

  useEffect(() => {
    if (totalRecordCount > 0) {
      if (pageNumber > 0) {
        ongoingNewHandlerWithLocation(token);
      }
    }
  }, [pageNumber]);

  const callDateFilter = () =>{
    ongoingNewHandlerWithLocation(token);
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

  function ongoingNewHandlerWithLocation(token:any){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
       
 
        GetGaurdListFromAPI(res);

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
 




  const GetGaurdListFromAPI = (dataParam:any) => {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"list_gaurd.php";
    const formData = new FormData();
    formData.append('action', "list_gaurd");
    formData.append('token', tokenVal);
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    }
  
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


  const GaurdsendtoadminAPI = () => {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"add_gaurd_kyc.php";
    const formData = new FormData();
    formData.append('action', "submit_guard_to_admin");
    formData.append('token', tokenVal);
    formData.append('gaurd_insert_id', Dutyid);
  if(Dutyid==='')
  {
    alert("Something went wrong Please try again");
  }
  else
  {
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          ongoingNewHandlerWithLocation(token);
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
  }

  
  const { name } = useParams<{ name: string; }>();

  const getDisplayValue = (value: any) => value ? value : 'N/A';



  const handleeducationcameraStart = async () => {
    takePhotoWithPrompt().then(async (photoData:any) => {
    setsaveSelectededucation(JSON.stringify(photoData));
  
  });
  };

const handlepanpiccameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavepanpic(JSON.stringify(photoData));

});
};

const handlepolicecameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveSelectedpolice(JSON.stringify(photoData));

});
};

const handlemedicalcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveSelectedmedical(JSON.stringify(photoData));

});
};




const handlebankcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavebankpic(JSON.stringify(photoData));

});
};





const handleguncameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavegunpic(JSON.stringify(photoData));

});
};


const handleepfcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveepfpic(JSON.stringify(photoData));

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

 

  const handleAddGuard = async () => {
    
    const storedToken = localStorage.getItem('token');
    const token = storedToken; // Replace with your actual token
    // Validate mandatory fields

    const data = new FormData();
    data.append('action', 'add_new_gaurd_document');
    data.append('token', token);
    data.append('gaurd_insert_id', Dutyid);
    data.append('text1value', text1value);
    data.append('text2value', text2value);
    data.append('ReqType', reqType);
    data.append('education_pic', saveSelectededucation);
    data.append('pan_pic', savepanpic);
    data.append('bank_pic', savebankpic);
    data.append('medical_pic', saveSelectedmedical);
    data.append('police_pic', saveSelectedpolice);
    data.append('gun_pic', savegunpic);
    data.append('pf_pic', saveepfpic);
    try {
 
    if(reqType==='education' && saveSelectededucation==='' && text1value==='')  
      {
        present({
          message: `Education Copy and Education detail is Mandatory. Please upload!`,
          duration: 5000,
          position: 'top',
        });

      }
      else if(reqType==='pancard' && savepanpic==='' && text1value==='')  
        {
          present({
            message: `Pancard Copy and Pan Number is Mandatory . Please upload!`,
            duration: 5000,
            position: 'top',
          });

        }
        else if(reqType==='pancard'  &&  text1value.length!=10)  
          {
            present({
              message: `Pan Number should be 10 digits only.`,
              duration: 5000,
              position: 'top',
            });
  
          }
        else if(reqType==='bankdetail' && savebankpic==='' && text1value==='' && text2value==='')  
          {
            present({
              message: `Passbook Copy and Bank A/c Number and IFSC code is Mandatory. Please upload!`,
              duration: 5000,
              position: 'top',
            });

   
          }
          else if(reqType==='bankdetail' && text2value.length!=11)  
            {
              present({
                message: `IFSC code should be 11 digits only!`,
                duration: 5000,
                position: 'top',
              });
  
     
            }
    else if(reqType==='medical' && saveSelectedmedical==='' && text1value==='')  
            {
              present({
                message: `Medical Certificate and Blood Group is Mandatory. Please upload!`,
                duration: 5000,
                position: 'top',
              });

            }
      else if(reqType==='policeverification' && saveSelectedpolice==='')  
              {
                present({
                  message: `Police Verification Report is Mandatory. Please upload!`,
                  duration: 5000,
                  position: 'top',
                });
  
              }
      else if(reqType==='gunlicence' && savegunpic==='')  
                {
                  present({
                    message: `Gun Licence copy is Mandatory. Please upload!`,
                    duration: 5000,
                    position: 'top',
                  });
      
                }
                else if(reqType==='pfdetail' && saveepfpic==='')  
                  {
                    present({
                      message: `PF copy is Mandatory. Please upload!`,
                      duration: 5000,
                      position: 'top',
                    });
           
                  }
      else{
        setshowspinner(true);
        setButtonDisabled(true);
      const response = await axios.post(BASEURL+'add_gaurd_kyc.php', data);
      if (response.data.success) {
        present({
          message: 'Guard Document added successfully!',
          duration: 2000,
          position: 'top',
        });
        setshowspinner(false);
        setButtonDisabled(false);
        setDutyid('');
        settext1value('');
        settext2value('');
        setreqType('');
        setsaveSelectededucation('');
        setsavepanpic('');
        setsavebankpic('');
        setsaveSelectedmedical('');
        setsaveSelectedpolice('');
        setsavegunpic('');
        setsaveepfpic('');


        ongoingNewHandlerWithLocation(token);
        setShowRequestModal(false);
      } else {
        present({
          message: 'Failed to add Document. Please try again.',
          duration: 2000,
          position: 'top',
        });
      }
    }

    } catch (error) {
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        position: 'top',
      });
      console.error('Error Adding Guard Document:', error);
    }
  };

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
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
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
                    <IonImg
          className='imageionclass'
          src={BASEURL+`emp_image_temp/${getDisplayValue(duty.profile_pic)}`}
        ></IonImg>
                      <p><strong>{t('Full Name')}:</strong> {getDisplayValue(duty.fullname)}</p>
                      <p><strong>{t('Mobile Number')}:</strong> {getDisplayValue(duty.mobileno)}</p>
                      <p><strong>{t('Father`s Name')}:</strong> {getDisplayValue(duty.father_name)}</p>
                      <p><strong>{t('Mother`s Name')}:</strong> {getDisplayValue(duty.mother_name)}</p>
                      <p><strong>{t('Full Address')}:</strong> {getDisplayValue(duty.full_address)}</p>
                      <p><strong>{t('State')}:</strong> {getDisplayValue(duty.state)}</p>
                      <p><strong>{t('Aadhar Number')}:</strong> {getDisplayValue(duty.aadhar_no)}</p>
                      <p><strong>{t('Aadhar Pic')}:</strong>{duty.aadhar_pic!=null && duty.aadhar_back_pic!=null ? ('Uploaded'):('Not Uploaded')}</p>
                      <p><strong>{t('Request Date')}:</strong> {getDisplayValue(duty.date)}</p>
                      <p><strong>{t('Request Status')}:</strong><strong>{duty.enquiry_status==0 ?('InComplete'):(
                        'Pending At Admin'
                        )} </strong></p>
                      {duty.education==null && duty.education_pic==null ? ( 
                        <>
                        <IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"
                      href='javascript: viod(0);'
                      onClick={() => {
                        setDutyid(duty.reguid);
                        setreqType('education');
                        setShowRequestModal(true);
                      }}>{t('Add Education Detail')}</IonButton>
                  </IonButtons>
                    
                  
                    </>
                      ):(
                        <>
                        <p><strong>{t('Education Detail')}:</strong> Uploaded</p>
                        </>
                      )}
                            {duty.pan_pic==null && duty.pan==null ? ( 
                        <>
                     <IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);' 
                     onClick={() => {
                      setDutyid(duty.reguid);
                      setreqType('pancard');
                      setShowRequestModal(true);
                    }}>
                      {t('Add Pancard Detail')}</IonButton>
                  </IonButtons>
                  
                    </>
                      ):(
                        <>
                        <p><strong>{t('Pancard Detail')}:</strong> Uploaded</p>
                        </>
                      )}
                           {duty.bank_pic==null && duty.bankacno==null && duty.bankifsc==null ? ( 
                        <>
                         <IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);'
                  onClick={() => {
                    setDutyid(duty.reguid);
                    setreqType('bankdetail');
                    setShowRequestModal(true);
                  }}
                    >
                      {t('Add Bank Detail')}</IonButton>
                  </IonButtons>
                    
                    </>
                      ):(
                        <>
                        <p><strong>{t('Bank Detail')}:</strong> Uploaded</p>
                        </>
                      )}
                              {duty.blood_group==null && duty.medical_report==null ? ( 
                        <>

<IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);' 
                      onClick={() => {
                        setDutyid(duty.reguid);
                        setreqType('medical');
                        setShowRequestModal(true);
                      }}>
                      {t('Add Medical Report')}</IonButton>
                  </IonButtons>
     
                    </>
                      ):(
                        <>
                        <p><strong>{t('Medical Report')}:</strong> Uploaded</p>
                        </>
                      )}
                       {duty.police_ver_report==null ? ( 
                        <><IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);'
                     onClick={() => {
                      setDutyid(duty.reguid);
                      setreqType('policeverification');
                      setShowRequestModal(true);
                    }}>
                      {t('Add Police Verification Report')}</IonButton>
                  </IonButtons>
                    </>
                      ):(
                        <>
                        <p><strong>{t('Police Verification Report')}:</strong> Uploaded</p>
                        </>
                      )}
                            {duty.gun_pic==null ? ( 
                        <><IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);' 
                     onClick={() => {
                      setDutyid(duty.reguid);
                      setreqType('gunlicence');
                      setShowRequestModal(true);
                    }}
                    >
                      {t('Add Gun Licence Copy')}</IonButton>
                  </IonButtons>
                    </>
                      ):(
                        <>
                        <p><strong>{t('Gun Licence Copy')}:</strong> Uploaded</p>
                        </>
                      )}
                                 {duty.epf_pic==null ? ( 
                        <><IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='javascript: viod(0);' 
                     onClick={() => {
                      setDutyid(duty.reguid);
                      setreqType('pfdetail');
                      setShowRequestModal(true);
                    }}>
                      {t('Add Existing EPF & ESIC Number Copy')}</IonButton>
                  </IonButtons>
                    </>
                      ):(
                        <>
                        <p><strong>{t('Existing EPF & ESIC Number Copy')}:</strong> Uploaded</p>
                        </>
                      )}
                      
                     </div>
              {duty.pan_pic!=null && duty.pan!=null &&
              duty.bank_pic!=null && duty.bankacno!='' && duty.bankifsc!=null && 
              duty.blood_group!=null && duty.medical_report!=null && duty.police_ver_report!=null
              && duty.enquiry_status==0 ? (       
                    <IonButton expand="block" color="primary" size="default"
          onClick={() => {
            setDutyid(duty.reguid);
            GaurdsendtoadminAPI();
          }}>{t('Send To Admin')}</IonButton>
              ):('')}

                    </IonCardContent>
                    </IonCard>
                  </div>
                ))
              ) : (
                <IonLabel><div className='notFound'>
                <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                No recruitment found</div>
              </IonLabel>
                
              )}

            </IonCard>




            <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
              <IonHeader>
                <IonToolbar>
                  {reqType === 'education' ? ( <IonTitle>{('Add Education Detail')}</IonTitle>) : 
                  reqType === 'pancard' ? (<IonTitle>{('Add Pancard Detail')}</IonTitle>) :
                  reqType === 'bankdetail' ? (<IonTitle>{('Add Bank Detail')}</IonTitle>) :
                  reqType === 'medical' ? (<IonTitle>{('Add Medical Report')}</IonTitle>) :
                  reqType === 'policeverification' ? (<IonTitle>{('Add Police Verification Report')}</IonTitle>) :
                  reqType === 'gunlicence' ? (<IonTitle>{('Add Gun Licence Copy')}</IonTitle>) :
                  reqType === 'pfdetail' ? (<IonTitle>{('Add Existing EPF & ESIC Number Copy')}</IonTitle>) :
                  ('')}
                  
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowRequestModal(false)}>X</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  {reqType === 'education' ? (<>
            
          <IonItem>
            <IonLabel position="floating">{t('Education')}</IonLabel>
            <IonInput name="education" value={text1value} onIonInput={e => settext1value(e.detail.value!)}></IonInput>
          </IonItem>


          <IonItem>
         <IonLabel>{t('Attach Education Certificate')} </IonLabel> 
         {saveSelectededucation ? (   <IonButton expand="full"   onClick={() => {setsaveSelectededucation('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
          {saveSelectededucation && <>
          
          <IonItem>
             <img onClick={handleeducationcameraStart}
               src={`data:image/jpeg;base64,${JSON.parse(saveSelectededucation).base64String}`}
               alt="Preview Image"
               style={{ width: 'auto', height: '100px' }}
             />
           </IonItem>
         </>}

         {!saveSelectededucation &&<>   
 <IonItem>     <img onClick={handleeducationcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}

                    </>
                  ) : reqType === 'pancard' ? (
                   <>
                      <IonItem>
            <IonLabel position="floating">{t('Pan Card')}</IonLabel>
            <IonInput name="pan"   value={text1value} onIonInput={e => settext1value(e.detail.value!)}></IonInput>
          </IonItem>
         
          <IonItem>
         <IonLabel>{t('Add Pan Card Pic')}</IonLabel> 
         {savepanpic ? (   <IonButton expand="full"   onClick={() => {setsavepanpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>

          {savepanpic && <>
           <IonItem>
              <img onClick={handlepanpiccameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(savepanpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          {!savepanpic &&<>   
 <IonItem>     <img    onClick={handlepanpiccameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}
                   
                   </>
                 ) : reqType === 'medical' ? (<>
                      <IonItem>
                      <IonLabel position="floating">{t('Blood Group')}</IonLabel>
                      <IonInput name="blood_group"   value={text1value} onIonInput={e => settext1value(e.detail.value!)} ></IonInput>
                    </IonItem>
                
                    <IonItem>
         <IonLabel>{t('Attach Medical Report')}</IonLabel> 
         {savepanpic ? (   <IonButton expand="full"   onClick={() => {setsaveSelectedmedical('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>

                    {saveSelectedmedical && <>
                     <IonItem>
                        <img  onClick={handlemedicalcameraStart}
                          src={`data:image/jpeg;base64,${JSON.parse(saveSelectedmedical).base64String}`}
                          alt="Preview Image"
                          style={{ width: 'auto', height: '100px' }}
                        />
                      </IonItem>
                    </>}  
                    {!saveSelectedmedical &&<>   
 <IonItem>     <img    onClick={handlemedicalcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}

                    </>
                      ) : reqType === 'bankdetail' ? (<>
                      
                                <IonItem>
            <IonLabel position="floating">{t('Bank A/C No')}</IonLabel>
            <IonInput name="bankacno" type='number'   value={text1value} onIonInput={e => settext1value(e.detail.value!)} ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Bank IFSC')}</IonLabel>
            <IonInput name="bankifsc"   value={text2value} onIonInput={e => settext2value(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
         <IonLabel>{t('Attach Bank Passbook Copy')}</IonLabel> 
         {savepanpic ? (   <IonButton expand="full"   onClick={() => {setsavebankpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>

          {savebankpic && <>
           <IonItem>
              <img   onClick={handlebankcameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(savebankpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}   
          {!savebankpic &&<>   
 <IonItem>     <img    onClick={handlebankcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}   
                      </>
                             ) : reqType === 'policeverification' ? (<>
            
          <IonItem>
         <IonLabel>{t('Attach Police verification Report Copy')}</IonLabel> 
         {savepanpic ? (   <IonButton expand="full"   onClick={() => {setsaveSelectedpolice('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
          {saveSelectedpolice && <>
           <IonItem>
              <img   onClick={handlepolicecameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(saveSelectedpolice).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}

          {!saveSelectedpolice &&<>   
 <IonItem>     <img    onClick={handlepolicecameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}  
                    </>
                                      ) : reqType === 'gunlicence' ? (<>
           
          <IonItem>
         <IonLabel>{t('Attach Gun Licence Copy')}</IonLabel> 
         {savepanpic ? (   <IonButton expand="full"   onClick={() => {setsaveSelectedpolice('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
          {savegunpic && <>
           <IonItem>
              <img   onClick={handleguncameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(savegunpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          {!savegunpic &&<>   
 <IonItem>     <img    onClick={handleguncameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}
                        </>
                          ) : reqType === 'pfdetail' ? (<>
   
          <IonItem>
         <IonLabel>{t('Attach Existing EPF & ESIC No Copy')}</IonLabel> 
         {saveepfpic ? (   <IonButton expand="full"   onClick={() => {setsaveepfpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>

             {saveepfpic && <>
           <IonItem>
              <img   onClick={handleepfcameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(saveepfpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}

          {!saveepfpic &&<>   
 <IonItem>     <img    onClick={handleepfcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}
                  </>
                  ) : null}
                </IonList>
                {showspinner ? (
         <IonItem className='daily-report-submit'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
                <IonButton disabled={showspinner} expand="full" onClick={handleAddGuard}>
                {reqType === 'education' ? ( <>{t('Add Education Detail')} </>) : 
                  reqType === 'pancard' ? ( <>{t('Add Pancard Detail')}</>) :
                  reqType === 'bankdetail' ? ( <>{t('Add Bank Detail')}</>) :
                  reqType === 'medical' ? ( <>{t('Add Medical Report')}</>) :
                  reqType === 'policeverification' ? ( <>{t('Add Police Verification Report')}</>) :
                  reqType === 'gunlicence' ? ( <>{t('Add Gun Licence Copy')}</>) :
                  reqType === 'pfdetail' ? ( <>{t('Add Existing EPF & ESIC Number Copy')}</>) :
                  ('')}
                        
                  </IonButton>
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
<br></br><br></br>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>

  );
};

export default Listgaurd;

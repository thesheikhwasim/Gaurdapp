import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, 
  IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, 
  IonFabButton, IonIcon, IonModal, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonToast,  IonSpinner, } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { Geolocation } from '@capacitor/geolocation';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [IncidentData, setIncidentData] = useState<any>(null);
  const [SopGalData, setSopGalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showselfie, setshowselfie] = useState(true);
  const [showfullModal, setshowfullModal] = useState(false);
  const [showimagepath, setshowimagepath] = useState('');
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  const [priority, setPriority] = useState('Selfie');
  const [reqSubject, setReqSubject] = useState('');
  const [saveSelectedImg, setsaveSelectedImg] = useState('');
  const [saveSelectedImg2, setsaveSelectedImg2] = useState('');
  const [saveSelectedImg3, setsaveSelectedImg3] = useState('');
  const [saveSelectedImg4, setsaveSelectedImg4] = useState('');
  const [saveSelectedImg5, setsaveSelectedImg5] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [present, dismiss] = useIonToast();
  const [reqOtherDetail, setReqOtherDetail] = useState('');
  const [document2, setDocument2] = useState<File | null>(null);
  const { takePhoto } = usePhotoGallery();
  const { takePhotoWithPrompt } = usePhotoGalleryWithPrompt();
  const token = localStorage.getItem('token');
  const [imgone, setimgone] = useState('');
  const [imgtwo, setimgtwo] = useState('');
  const [imgthree, setimgthree] = useState('');
  const [imgfour, setimgfour] = useState('');
  const [imgfive, setimgfive] = useState('');
  const [reloader, setReloader] = useState(false);
  const [showspinner, setshowspinner] = useState<boolean>(false);
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  useEffect(() => {
    const url = BASEURL+"incedent_report.php";
    const formData = new FormData();
    formData.append('action', "incident_report_data");
    formData.append('token', token);
    
    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
  
          
          setIncidentData(response.data.employeeData.incident_report);
         
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

  useEffect(() => {
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    const sellanguage = localStorage.getItem('language');
    
 
    if (storedToken) {
      ongoingNewHandlerWithLocation();
    }
  }, []);

  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      if((res && res?.coords && res?.coords?.latitude)){
        setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
   
      }else{

      }
    }).catch((error)=>{
      // console.error("BEFORE CALLED ONGOING LOCATION ERROR");
    });
  }


  const fetchincidentData = async (token: string) => {
    const url = BASEURL+"incedent_report.php";
    const formData = new FormData();
    formData.append('action', "incident_report_data");
    formData.append('token', token);
   
    
    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
  
          
          setIncidentData(response.data.employeeData.incident_report);
         
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
  const doMediaCapture = async () => {
    let options: CaptureVideoOptions = { limit: 1, duration: 30 };
    let capture:any = await MediaCapture.captureVideo(options);
    console.log((capture[0] as MediaFile).fullPath)
  };
  function newgaurdgalleryNav() {

    setReqType('GaurdGallery');
    setShowRequestModal(true);
  }

  const handleDocument2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDocument2(files[0]);
    }
  };


  const captureLocation = (fromParam:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        console.log("PERMISSION to show message and send DUMMY", permissions);
        console.log("ABOVE PERMISSION WAS ASKED FROM--- ", fromParam);
        // Case to validate permission is denied, if denied error message alert will be shown
        if (permissions?.location == "denied") {
          setLocationPermissionchk(false);
          alert('Your location permission is denied, enable it manually from app settings and re-load application!');
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

  const handleCreateRequest = async() => {
    captureLocation('fromDutyStart').then((res) => {
    const formData = new FormData();
    formData.append('action', 'add_new_incident_report');
    formData.append('token', token);
    formData.append('priority', priority);
    formData.append('reqDesc', reqDesc);
    formData.append('reqFile1', imgone);
    formData.append('reqFile2', imgtwo);
    formData.append('reqFile3', imgthree);
    formData.append('reqFile4', imgfour);
    formData.append('reqFile5', imgfive);
    formData.append('latitude', Latitude);
    formData.append('longitude', Longitude);

    setshowspinner(true);
    // return false;

    axios
      .post(BASEURL+'add_new_incident_report.php', formData)
      .then((response) => {
        if (response.data && response.data.success) {
          present({
            message: `Your ${reqType} request has been created successfully!`,
            duration: 2000,
            position: 'bottom',
          });
        
          setReqSubject('');
          setReqDesc('');
          setReqOtherDetail('');
          setshowspinner(false);
          setShowRequestModal(false);
          setimgone('');
          setimgtwo('');
          setimgthree('');
          setimgfour('');
          setimgfive('');
          
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
    });
  };

  async function galleryApi(formData, dutyEnd) {
    try {
      const response = dutyEnd
        ? await axios.post(BASEURL+'dutystop.php', formData)
        : await axios.post(BASEURL+'dutystart.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  const handlecameraStart = async () => {
          takePhoto().then(async (photoData) => {
          setimgone(JSON.stringify(photoData));
        });
 };
 const handlecameraStartone = async () => {
  takePhotoWithPrompt().then(async (photoData) => {
  setimgone(JSON.stringify(photoData));
});
};
const handlecameraStarttwo = async () => {
  takePhotoWithPrompt().then(async (photoData) => {
  setimgtwo(JSON.stringify(photoData));
});
};
const handlecameraStartthree = async () => {
  takePhotoWithPrompt().then(async (photoData) => {
  setimgthree(JSON.stringify(photoData));
});
};
const handlecameraStartfour = async () => {
  takePhotoWithPrompt().then(async (photoData) => {
  setimgfour(JSON.stringify(photoData));
});
};
const handlecameraStartfive = async () => {
  takePhotoWithPrompt().then(async (photoData) => {
  setimgfive(JSON.stringify(photoData));
});
};

  const getoption = (newoption: string) => {
    setPriority(newoption);
    if(newoption==='Selfie')
    {
      setshowselfie(true);
      setimgone('');
      setimgtwo('');
      setimgthree('');
      setimgfour('');
      setimgfive('');
      
    }
    else
    {
      setshowselfie(false);   
    }
  
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      fetchincidentData(localStorage.getItem('token'));
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
         <IonFab horizontal="end" vertical="bottom" slot="fixed">
        <IonFabButton onClick={()=> newgaurdgalleryNav()}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab> 
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Incident Photos ')}</IonTitle>
            </div>
           
                      {(IncidentData && IncidentData.length > 0) ? (
              <div >
                  {IncidentData.map((ticket, index) => (
                    <div className="content" key={index}>
                      <IonCard  className="shift-details-card">
                      <IonCardHeader  class="ion-text-center">
  <IonCardTitle >{ticket.incident_type || 'N/A'} On {ticket.incident_date.split(' ')[0] || 'N/A'}</IonCardTitle>
</IonCardHeader>
<IonCard  className="shift-details-card-content">
<div className="shift-details-column">
                        <p><strong>{t('Incident Type')}: </strong>{ticket.incident_type || 'N/A'}</p>
                        <p><strong>{t('Added ON')}: </strong>{ticket.incident_date || 'N/A'}</p>
                        <p >{ticket.incident_description || 'N/A'}</p>
                        <p>
                          
                          <IonImg     onClick={() => {
                             setshowimagepath(ticket?.incident_file_name1);
                       setshowfullModal(true);
                      }} className='incedentimagprev'
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name1}`}
                        ></IonImg>
                        {ticket?.incident_file_name2 &&
<IonImg  className='incedentimagprev'
  onClick={() => {
    setshowimagepath(ticket?.incident_file_name2);
setshowfullModal(true);
}}
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name2}`}
                        ></IonImg>}

{ticket?.incident_file_name3 &&
<IonImg  className='incedentimagprev'   onClick={() => {
    setshowimagepath(ticket?.incident_file_name3);
setshowfullModal(true);
}}
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name3}`}
                        ></IonImg>}
                        </p>
                        <p>
                        {ticket?.incident_file_name4 &&
<IonImg  className='incedentimagprev'   onClick={() => {
    setshowimagepath(ticket?.incident_file_name4);
setshowfullModal(true);
}}
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name4}`}
                        ></IonImg>}
                         {ticket?.incident_file_name5 &&
<IonImg  className='incedentimagprev'   onClick={() => {
    setshowimagepath(ticket?.incident_file_name5);
setshowfullModal(true);
}}
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name5}`}
                        ></IonImg>}
                       
                         </p>
                         
               </div> 
               </IonCard>             
                      </IonCard>
                    </div>
                  ))}
                </div>
              ) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No Incident found</div></IonLabel>
              )}
               
         
            
            <div className='footer'>
            <CustomFooter />
            </div>
          </>
        )}
        {/* modal code goes below */}

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
                          src={BASEURL+`incidentreport/${showimagepath}`}
                        ></IonImg>
              </IonItem>
           

            </IonList>
              </IonContent>
        </IonModal>




        <IonModal isOpen={showRequestModal} onDidDismiss={() => setShowRequestModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t('Incident Photo/Videos Upload')}</IonTitle>
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
                <IonLabel position="floating">{t('Incident Type')}</IonLabel>


                <IonSelect value={priority} onIonChange={e => getoption(e.detail.value)}>
                    <IonSelectOption value="Selfie">Selfie</IonSelectOption>
                    <IonSelectOption value="Incident Image">Incident Image</IonSelectOption>
                  {/*  <IonSelectOption value="Incident Video">Incident Video</IonSelectOption>*/}
                  </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">{t('Incident Detail')}</IonLabel>
                <IonInput value={reqDesc} onIonInput={e => setReqDesc(e.detail.value!)}></IonInput>
              </IonItem> 

            {showselfie ? ( 
 <IonItem>
        <IonLabel>{t('Add Your Selfie')} </IonLabel>       

  </IonItem>
      ) : ( 
        <IonItem>
          <IonLabel>{t('Upload Incedent Image 1')} </IonLabel>
          {imgone ? (   <IonButton expand="full"   onClick={() => {setimgone('');}}> {t('Clear Image')}</IonButton>
        ):('')}
        </IonItem>
      )}
              {imgone ? ( <>
              <IonItem>
              {showselfie ? (<>  
              <img  onClick={handlecameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(imgone).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
                </>
            ) : ( <> 
               <img  onClick={handlecameraStartone}
                src={`data:image/jpeg;base64,${JSON.parse(imgone).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
                </> )}
            </IonItem>
          </>
            ):(   
            <IonItem>  {showselfie ? (<>       <img   onClick={handlecameraStart}
                src='./assets/imgs/image-preview.jpg'
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
              </>
            ) : ( <> 
            <img   onClick={handlecameraStartone}
                src='./assets/imgs/image-preview.jpg'
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
            </> )}
            </IonItem>
          )}
 {!showselfie ? ( 
  <IonItem>
       <IonLabel>{t('Upload Incedent Image 2')} </IonLabel>
       {imgtwo ? (   <IonButton expand="full"   onClick={() => {setimgtwo('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
  ) : ( '' )}
        {imgtwo ? (<>
        
           <IonItem>
              <img 
                src={`data:image/jpeg;base64,${JSON.parse(imgtwo).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              />
            </IonItem>
          </>) : ('' )}
 {!imgtwo && !showselfie &&<>   
 <IonItem>     <img    onClick={handlecameraStarttwo}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}


   {!showselfie ? ( 
  <IonItem>
      <IonLabel>{t('Upload Incedent Image 3')} </IonLabel>  
      {imgthree ? (   <IonButton expand="full"   onClick={() => {setimgthree('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
  ) : ( '' )}


  
          {imgthree ? (<>
       
           <IonItem>
              <img  onClick={handlecameraStartthree}
                src={`data:image/jpeg;base64,${JSON.parse(imgthree).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '60px' }}
              /> 
            </IonItem>
          </>):(   '')}

          {!imgthree && !showselfie &&<>   
 <IonItem>     <img    onClick={handlecameraStartthree}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}
   {!showselfie ? ( 
  <IonItem>
     <IonLabel>{t('Upload Incedent Image 4')} </IonLabel>  
     {imgfour ? (   <IonButton expand="full"   onClick={() => {setimgfour('');}}> {t('Clear Image')}</IonButton>
        ):('')}
  </IonItem>
  ) : ( '' )}
            {imgfour && <>
      
           <IonItem>
              <img   onClick={handlecameraStartfour}
                src={`data:image/jpeg;base64,${JSON.parse(imgfour).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}

          {!imgfour && !showselfie &&<>   
 <IonItem>     <img    onClick={handlecameraStartfour}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}

   {!showselfie ? ( 
  <IonItem>
         <IonLabel>{t('Upload Incedent Image 5')} </IonLabel> 
         {imgfive ? (   <IonButton expand="full"   onClick={() => {setimgfive('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
  ) : ( '' )}
                    {imgfive && <>
          
           <IonItem>
              <img   onClick={handlecameraStartfive}
                src={`data:image/jpeg;base64,${JSON.parse(imgfive).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
       
          {!imgfive && !showselfie &&<>   
 <IonItem>     <img    onClick={handlecameraStartfive}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}
             
            </IonList>
            {showspinner ? (
         <IonItem className='spinner_loc'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
            <IonButton disabled={showspinner} expand="full" onClick={handleCreateRequest}> {t('Save Photo/Video')}</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;

import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, 
  IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, 
  IonFabButton, IonIcon, IonModal, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonToast } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
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
  const token = localStorage.getItem('token');
  const [imgone, setimgone] = useState('');
  const [imgtwo, setimgtwo] = useState('');
  const [imgthree, setimgthree] = useState('');
  const [imgfour, setimgfour] = useState('');
  const [imgfive, setimgfive] = useState('');
  const [reloader, setReloader] = useState(false);
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

  const { name } = useParams<{ name: string; }>();

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

  const handleCreateRequest = () => {
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
    console.log(token);
    console.log("formDATA create----> ", JSON.stringify(formData));
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
  const getoption = (newoption: string) => {
    setPriority(newoption);
    if(newoption==='Selfie')
    {
      setshowselfie(true);
      
    }
    else
    {
      setshowselfie(false);   
    }
  
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
              <IonTitle className="header_title ion-text-center">{t('Incident Photo/Videos')}</IonTitle>
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
                        <p><IonImg
                          src={BASEURL+`incidentreport/${ticket?.incident_file_name}`}
                        ></IonImg></p>
               
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
                    <IonSelectOption value="Incident Video">Incident Video</IonSelectOption>
                  </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">{t('Incident Detail')}</IonLabel>
                <IonInput value={reqDesc} onIonInput={e => setReqDesc(e.detail.value!)}></IonInput>
              </IonItem> 

              {showselfie ? ( 
 <IonItem>
             
 <IonButton  expand="full"  onClick={handlecameraStart}> {t('Add Your Selfie')}</IonButton>
  </IonItem>
      ) : ( 
        <IonItem>
          
        <IonInput type="file" value={imgone}  onIonInput={e => setimgone(JSON.stringify(e.detail.value!))}></IonInput>
        </IonItem>
      )}
 {!showselfie ? ( 
  <IonItem>
<IonInput type="file" value={imgtwo}  onIonInput={e => setimgtwo(JSON.stringify(e.detail.value!))}></IonInput>
</IonItem>
  ) : ( '' )}
   {!showselfie ? ( 
  <IonItem>
<IonInput type="file" value={imgthree}  onIonInput={e => setimgthree(JSON.stringify(e.detail.value!))}></IonInput><br></br>
</IonItem>
  ) : ( '' )}
   {!showselfie ? ( 
  <IonItem>
 <IonInput type="file" value={imgfour}  onIonInput={e => setimgfour(JSON.stringify(e.detail.value!))}></IonInput>
</IonItem>
  ) : ( '' )}
   {!showselfie ? ( 
  <IonItem>
<IonInput type="file" value={imgfive}  onIonInput={e => setimgfive(JSON.stringify(e.detail.value!))}></IonInput>
</IonItem>
  ) : ( '' )}
        
       
               
             
            </IonList>
            <IonButton expand="full" onClick={handleCreateRequest}> {t('Save Photo/Video')}</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;

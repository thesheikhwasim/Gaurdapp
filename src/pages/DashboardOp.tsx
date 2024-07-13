import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonInput, IonSelectOption, IonButton, IonModal, IonSelect, useIonToast, IonTextarea, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

const DashboardOp: React.FC = () => {
  const { t } = useTranslation();

  const { name } = useParams<{ name: string }>();
  const [opRequestData, setOpRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [present, dismiss] = useIonToast();
  const [alertModal, setAlertModal] = useState(false);
  const [alertModalSite, setAlertModalSite] = useState(null);

  const token = localStorage.getItem('token');
  useEffect(() => {
    getOPdashboard();
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
  }, []);

  function getOPdashboard() {
    const tokenData = localStorage.getItem('token');
    let URL = "https://guard.ghamasaana.com/guard_new_api/op_ongoing_duty.php";
    let formData = new FormData();
    formData.append('action', "op_duty_ongoing");
    formData.append('token', tokenData);
    // return false;
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setOpRequestData(response?.data?.employee_data?.site_route);
        } else {
          present({
            message: `Error getting subject list from API!`,
            duration: 2000,
            position: 'bottom',
          });
        }
      })
      .catch(error => {
        present({
          message: `Error getting subject list from API!`,
          duration: 2000,
          position: 'bottom',
        });
      });
  }

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
     //Function that hits when ion pull to refresh is called
     setTimeout(() => {
      console.log("PAGE TO be ReFRESHED");
      getOPdashboard();
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
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
        </IonToolbar>
      </IonHeader>

      <IonContent className="page-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>

        <div className="content">
          <div className="header_title">
            <IonTitle className="header_title ion-text-center">{t('Welcome')} {loggedInUser?.full_name}</IonTitle>
          </div>
        </div>

        <div className="content">
          <IonCard className="shift-details-card">

            <IonCardHeader>
              <IonCardTitle className='card-title-op'>{t('Your Current Duty Detail')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="shift-details-card-content">
              <div className="shift-details-column">
                {(opRequestData && opRequestData.length > 0) &&
                opRequestData.map((siteData:any) => 
                  <div key={siteData.site_id} className='siteItemOpUser' onClick={() => {
                    setAlertModalSite(siteData);
                    setAlertModal(true);
                  }}>
                    <p><strong>Site Name:</strong>{siteData?.site_name}</p>
                    <p><strong>Site Id:</strong>{siteData?.site_id}</p>
                    <p><strong>Site Category:</strong>{siteData?.site_category}</p>
                    <p><strong>Site City:</strong>{siteData?.site_city}</p>
                    <p><strong>Site State:</strong>{siteData?.site_state}</p>
                    <p><strong>Site Cluster Route:</strong>{siteData?.cluster_route}</p>
                </div>
                )
                }
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {<ModalComponent
          siteInfo={alertModalSite}
          alertModal={alertModal}
          setAlertModal={() => {
            console.log("setAlertModal(false) called from child component", alertModal);
            setAlertModal(false);
          }}
        />}
      </IonContent>
    </IonPage>
  );
};

export default DashboardOp;

function ModalComponent(props) {
  console.log("props ---- modal pros - -- - -", props);
  const [present, dismiss] = useIonToast();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(()=>{
    if(props.alertModal && props.siteInfo && props.siteInfo?.site_id){
      getGuardSiteInfo();
      console.log("called EFFECT");
    }
  },[]);


  function getGuardSiteInfo() {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'gaurd_site_data');
    formData.append('token', token);
    formData.append('site_id', props.siteInfo.site_id);

    axios.post('https://guard.ghamasaana.com/guard_new_api/gaurd_site_info.php', formData).then((response) => {
      if (response.data && response.data.success) {
        console.log(response.data);
      } else {
        present({
          message: `Failed to get site details! Try again later.`,
          duration: 2000,
          position: 'bottom',
        });
      }
      // setModalOpen(true);
    }).catch((error) => {
      console.error(`Error replying request:`, error);
      present({
        message: `Something went wrong. Please try again.`,
        duration: 2000,
        position: 'bottom',
      });
    });
  }

  return (
    <IonModal isOpen={props.alertModal} onDidDismiss={() => props.setAlertModal()}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{'Guard Site Info'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => props.setAlertModal()}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {JSON.stringify(props)}

          API not rendering, to be rendered here!
        </IonList>
        {/* <IonButton expand="full" onClick={() => handleAlertReply()}>Submit Alert Reply</IonButton> */}
      </IonContent>
    </IonModal>
  )
}

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

  const token = localStorage.getItem('token');
  useEffect(() => {
    getOPdashboard();
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
  }, []);

  function getOPdashboard() {
    let URL = "https://guard.ghamasaana.com/guard_new_api/op_ongoing_duty.php";
    let formData = new FormData();
    formData.append('action', "op_duty_ongoing");
    formData.append('token', token);
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
                  <div className='siteItemOpUser'>
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
      </IonContent>
    </IonPage>
  );
};

export default DashboardOp;

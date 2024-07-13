import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonInput, IonSelectOption, IonButton, IonModal, IonSelect, useIonToast, IonTextarea } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';

const DashboardOp: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [opRequestData, setOpRequestData] = useState<any>(null);
  const [present, dismiss] = useIonToast();

  const token = localStorage.getItem('token');
  useEffect(() => {
    getOPdashboard();
  }, []);

  function getOPdashboard() {
    let URL = "https://guard.ghamasaana.com/guard_new_api/ticket_subject.php";
    let formData = new FormData();
    formData.append('action', "ticket_subject");
    formData.append('token', token);
    return false;
    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
            setOpRequestData(response?.data?.employee_data);
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


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
          <IonTitle>title</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        HI this is sheikh
      </IonContent>
    </IonPage>
  );
};

export default DashboardOp;

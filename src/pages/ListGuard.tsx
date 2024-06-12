import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonLoading, IonGrid, IonRow, IonCol, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import axios from 'axios';
import './Page.css';

const ListGuards: React.FC = () => {
  const [guardsData, setGuardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardsData = async () => {
      const token = 'b35a9b84974db75e8eb63d4d68be041e2c49cc02f4d266ccf18e6f3a9a2424c3'; // Replace with your actual token
      const data = new FormData();
      data.append('action', 'list_guards');
      data.append('token', token);

      try {
        const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/list_guards.php', data);
        if (response.data.success) {
          setGuardsData(response.data.employee_data);
        } else {
          console.error('Failed to fetch guards data:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching guards data:', error);
        setLoading(false);
      }
    };

    fetchGuardsData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>List of Guards</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Guards Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol><IonLabel><strong>Full Name</strong></IonLabel></IonCol>
                  <IonCol><IonLabel><strong>Mobile No</strong></IonLabel></IonCol>
                  <IonCol><IonLabel><strong>Rank</strong></IonLabel></IonCol>
                  <IonCol><IonLabel><strong>Roll No</strong></IonLabel></IonCol>
                  <IonCol><IonLabel><strong>Site ID</strong></IonLabel></IonCol>
                </IonRow>
                {guardsData.map((guard, index) => (
                  <IonRow key={index}>
                    <IonCol>{guard.full_name || 'N/A'}</IonCol>
                    <IonCol>{guard.reg_mobile_no || 'N/A'}</IonCol>
                    <IonCol>{guard.designation || 'N/A'}</IonCol>
                    <IonCol>{guard.roll_no || 'N/A'}</IonCol>
                    <IonCol>{guard.site_id || 'N/A'}</IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ListGuards;

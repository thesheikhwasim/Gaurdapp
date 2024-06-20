import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const url = "https://guard.ghamasaana.com/guard_new_api/request.php";
    const formData = new FormData();
    formData.append('action', "request_data");
    formData.append('token', token);
    formData.append('subject', "");
    formData.append('message', "");
    formData.append('priority', "");

    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
          setRequestData(response.data.employee_data.request_data);
          console.log(response.data.employee_data.request_data, token, )
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg className='header-image' src="./assets/imgs/logo.jpg" alt="header" style={{ display: 'flex', height: '60px', width: '100%' }} />
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
     <div className="header_title">
        <IonTitle className="header_title ion-text-center">Your Request Information</IonTitle>
      </div>
      <IonCard className='shift-details-card-content'>
    
                {requestData ? (
                  <IonGrid>
            
                    {requestData.map((ticket, index) => (
                        <IonCard className='card' key={index}>
                    <div className="shift-details-column">
                <p><strong>Request Type: </strong>{ticket.ReqType || 'N/A'}</p>
                <p><strong>Request Date : </strong>{ticket.ReqDatetime || 'N/A'}</p>
                <p><strong>Request Description : </strong>{ticket.ReqDesc || 'N/A'}</p> 
                <p><strong>Request ID : </strong>{ticket.ReqID || 'N/A'}</p> 
                <p><strong>Request Status : </strong>{ticket.ReqStatus || 'N/A'}</p> 
                <p><strong>Request Action : </strong>{ticket.ReqAction || 'N/A'}</p> 
                </div>      
                  
                        </IonCard>
                    ))}
                  </IonGrid>
                ) : (
                  <IonLabel><div className='notFound'>
                    <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                    No requests found</div></IonLabel>
                )}

            </IonCard>
            <div className='footer'>
              <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;

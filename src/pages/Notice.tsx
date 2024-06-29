import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonLabel, IonLoading } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';

const Notice: React.FC = () => {
  const [noticeData, setNoticeData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login'); // Redirect to login if token is not found
      return;
    }

    const fetchNoticeData = async () => {
      const url = 'https://guard.ghamasaana.com/guard_new_api/notice.php';
      const formData = new FormData();
      formData.append('action', 'notice_data');
      formData.append('token', token);

      try {
        const response = await axios.post(url, formData);
        if (response.data && response.data.success) {
          setNoticeData(response.data.employee_data.notice.NoticeContent);
          console.log(response.data.employee_data);
        } else {
          console.error('Failed to fetch notice data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching notice data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeData();
  }, [history]);

  const { name } = useParams<{ name: string }>();

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
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <IonCard className='ion-text-center shadowCard'>
          <IonCardHeader>
            <IonCardTitle className='logintitle' color={'dark'}>Notice</IonCardTitle>
            <IonCardSubtitle className='subtitle' color={'dark'}>Important Points for Guards and Duty</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {loading ? (
              <IonLoading isOpen={loading} message={'Loading...'} />
            ) : noticeData ? (
              <IonList>
                {noticeData.split('\n').map((item, index) => (
                  <IonItem key={index}>
                    <IonLabel>{item}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <IonLabel>No notice data available<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br></IonLabel>
            )}
          </IonCardContent>
        </IonCard>
        <div className='footer'>
          <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notice;

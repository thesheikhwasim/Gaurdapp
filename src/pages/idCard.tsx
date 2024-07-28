import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import CustomHeader from './CustomHeader';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ProfileData, setProfileData] = useState<any>({});

  const token = localStorage.getItem('token');
  useEffect(() => {
    // Call API to fetch user profile data
    const storedData = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');

    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
    if (storedToken) {
      fetchProfileData(storedToken);
    }
  }, []);

  const fetchProfileData = async (token: string) => {
    const url = 'https://guard.ghamasaana.com/guard_new_api/profile.php';
    const formData = new FormData();
    formData.append('action', 'profile_data');
    formData.append('token', token);

    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.employee_data) {
        setProfileData(response.data.employee_data);
      }
      // else {
      //   history.push('/pages/login');
      // }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // history.push('/pages/login');
    } finally {
      setLoading(false);
    }
  };

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <CustomHeader />
          {/* <IonTitle>{name}</IonTitle> */}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">Your Id Card</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>

              <IonLabel><div className='notFoundIdCard'>
                <div className='mainIdCardContainer'>
                  {ProfileData?.photo && <div className='profileImageParentShIdCard'>
                    <div>
                      <IonImg
                        className='imageionclassIdCard'
                        src={`https://guard.ghamasaana.com/guard_new_api/emp_image/${ProfileData.photo}`}
                      ></IonImg>
                    </div>
                  </div>}
                </div>
              </div></IonLabel>
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

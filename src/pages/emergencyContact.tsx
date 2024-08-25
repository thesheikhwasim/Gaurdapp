import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [supername, setsupername] = useState<any>(null);
  const [supernumber, setsupernumber] = useState<any>(null);
  const [admincontact, setadmincontact] = useState<any>(null);
  const [HELPLINENUMBERS, setHELPLINENUMBERS] = useState<any>(null);
  
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
    const url = BASEURL+'/emergenceycontact.php';
    const formData = new FormData();
    formData.append('action', 'emergencey_contact');
    formData.append('token', token);

    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.employee_data) {
        setsupername(response.data.employee_data.Supervisor_name);
        setsupernumber(response.data.employee_data.Supervisor_mobile);
        setadmincontact(response.data.employee_data.ADMIN_CONTACT);
        setHELPLINENUMBERS(response.data.employee_data.HELP_LINE_NUMBERS);
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
              <IonTitle className="header_title ion-text-center">{t('Emergency Contacts')}</IonTitle>
            </div>
            <IonCard className="card"  style={{ width: '100%' }}>
                      <div className="shift-details-column">
                        <p><strong>Supervisor Name: </strong> {supername}</p>
                        <p><strong>Supervisor Mobile</strong> {supernumber}</p>
                        <p><strong>Admin Contact</strong> {admincontact}</p>
                        <p><strong>Helpline Numbers</strong> {HELPLINENUMBERS}</p>
                        
          
                      </div>
                    </IonCard>
            <div className='footer'>
            <CustomFooter />
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;

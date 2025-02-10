import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, 
  IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, 
  IonCardContent, IonCardHeader, IonCardSubtitle
  ,IonRefresher,
  IonRefresherContent,
  RefresherEventDetail, IonCardTitle } from '@ionic/react';
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
  const [emergenceydata, setEmergenceyData] = useState<any>([]);
  const [supername, setsupername] = useState<any>(null);
  const [supernumber, setsupernumber] = useState<any>(null);
  const [designation, setdesignation] = useState<any>(null);
  const [admincontact, setadmincontact] = useState<any>(null);
  const [HELPLINENUMBERS, setHELPLINENUMBERS] = useState<any>(null);
  const [reloader, setReloader] = useState(false);
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
        setEmergenceyData(response.data.employee_data);
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
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      fetchProfileData(localStorage.getItem('token'));
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
          {/* <IonTitle>{name}</IonTitle> */}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Emergency Contacts')}</IonTitle>
            </div>
            <IonGrid>
  <IonRow  className="shift-details-column">
    <IonCol className='texthead'><strong>RANK</strong></IonCol>
    <IonCol className='texthead'><strong>NAME</strong></IonCol>
    <IonCol className='texthead'><strong>Mobile</strong></IonCol>
  </IonRow>
  {emergenceydata.length > 0 ? (
                emergenceydata.map((duty: any, index: number) => (
  <IonRow   key={index} >
    <IonCol >{duty.rank}</IonCol>
    <IonCol  >{duty.name}</IonCol>
    <IonCol > {duty.mobile}</IonCol>
  </IonRow>
))
              ) : (
                <IonLabel className='noRunningDutyEmptyBlock'>No Contact Available.</IonLabel>
              )}
</IonGrid>

<br></br>




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

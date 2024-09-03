import React, { useState, useEffect } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { saveAs } from 'file-saver';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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
      fetchProfileData(storedToken, false);
    }
  }, []);

  const fetchProfileData = async (token: string, includeDownload: boolean) => {
    const url = BASEURL + 'profile.php';
    const formData = new FormData();
    formData.append('action', 'profile_data');
    formData.append('token', token);
    if (includeDownload) {
      formData.append('downloaded_now', includeDownload);
    }

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

  async function triggerDownload(fileParam: any) {
    // 'downloaded_now'
    console.log("PROFILE DATA::: ", fileParam);
    console.log("PROFILE DATA ID CARD URL :: ", fileParam?.id_card);
    let imageUrl = BASEURL + `emp_idcard/${fileParam.id_card}`;
    try {
      // Fetch the image as a blob using Axios
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const blob = response.data;

      // Read the blob as a data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1]; // Extract base64 part after comma

        // Save the base64 string as a file
        await Filesystem.writeFile({
          path: 'idCard.jpg',
          data: base64data,
          directory: Directory.Documents,
        });

        alert('Image downloaded successfully, view image in gallery!');
        const tokenParam = localStorage.getItem('token');
        fetchProfileData(tokenParam, true);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
    // try {
    //   const response = await fetch(`https://guard.ghamasaana.com/guard_new_api/emp_image/${fileParam.photo}`);
    //   const blob = await response.blob();
    //   saveAs(blob, fileParam?.photo); // Save the file with the specified name
    //   const storedToken = localStorage.getItem('token');
    //   fetchProfileData(storedToken, true)
    // } catch (error) {
    //   console.error('Error downloading the image:', error);
    // }

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
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Your ID Card')}</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>

              <IonLabel><div className='notFoundIdCard'>
                <div className='mainIdCardContainer'>
                  {ProfileData?.id_card &&
                    <>
                      <IonCard className='shift-details-card-content'>
                        <IonLabel>
                          <div className='notFoundIdCard'>
                            <iframe
                              src={`https://docs.google.com/gview?url=${BASEURL}emp_idcard/${ProfileData?.id_card}&embedded=true`}

                              style={{ width: '100%', height: '300px', border: 'none' }}
                              title="PDF Viewer"
                            ></iframe>
                          </div>
                        </IonLabel>
                      </IonCard>
                      {/*
<IonCard className='shift-details-card-content'>

<IonLabel><div className='notFoundIdCard'>
<iframe id="inlineFrameExample" title="GI HELP TEXT" frameBorder="0"  width="100%" height="100%" src={BASEURL+`your_pdf_doc.php?idcard_file=${ProfileData?.id_card}`}> </iframe>
</div></IonLabel>
</IonCard>

                   <div className='profileImageParentShIdCard'>
                      <div>
                        <IonImg
                          className='imageionclassIdCard'
                          src={BASEURL+`emp_idcard/${ProfileData.id_card}`}
                        ></IonImg>
                      </div>
                    </div>
                     */}
                      <div>
                        {ProfileData?.can_download && <IonButton
                          disabled={false}
                          expand="block"
                          onClick={() => triggerDownload(ProfileData)}
                          color="primary">
                          {t('Download')}
                        </IonButton>}
                      </div>
                    </>
                  }
                </div>
              </div></IonLabel>
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

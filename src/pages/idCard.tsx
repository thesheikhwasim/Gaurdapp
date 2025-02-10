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
import { Browser } from '@capacitor/browser';
import { Geolocation } from '@capacitor/geolocation';


const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [requestData, setRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ProfileData, setProfileData] = useState<any>({});
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);

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

  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
      
      }else{
        setLocationPermissionchk(false);


        setTimeout(async() => {
        
          window.location.reload();
        }, 500);
      
      }
    }).catch((error)=>{
    
    });
  }



  const captureLocation = (fromParam:string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
     
        // Case to validate permission is denied, if denied error message alert will be shown
        if (permissions?.location == "denied") {
          setLocationPermissionchk(false);
           present({
            message: `Your location permission is denied, enable it manually from app settings and re-load application!`,
            duration: 5000,
            position: 'bottom',
          });
      
        }
        else
        {
         
          setLocationPermissionchk(true);
        }

        const options = {
          enableHighAccuracy: true,
          timeout: 100,
          maximumAge: 0,
        };
        Geolocation.getCurrentPosition(options)
          .then((position) => {
            if (position && position.coords.latitude) {
              // console.log("CAPTURE LOCATION is setting lat long:::: ",position.coords.latitude.toString(), "-- longitude--", position.coords.longitude.toString());
              setLatitude(position.coords.latitude.toString());
              setLongitude(position.coords.longitude.toString());
             
            }
            resolve(position);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  };
 

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

  function OpenIdCardInAppBrowser(fileParam: any){
    openPdfWithBrowser({fileParam});
    return false;
  }




  async function recorddownload(){
    ongoingNewHandlerWithLocation();
    const url = BASEURL + 'profile.php';
    const formData = new FormData();
    formData.append('action', 'id_card_dwonload');
    formData.append('token', localStorage.getItem('token'));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

 

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
  }
  
  const openPdfWithBrowser = async (url:any) => {
    await Browser.open({ url });
  };

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
                  <>               
                 {/*    <div>
                       <IonButton
                        disabled={false}
                        expand="block"
                        onClick={() => OpenIdCardInAppBrowser()}
                        color="primary">
                        {t('Download your ID Card')}
                      </IonButton>
                    </div>  <DownloadPdf />*/}
           
                  
                  </>
                  {ProfileData?.id_card &&
                    <>
                          {ProfileData?.can_download ?  (<div >
                  <a href={BASEURL+`emp_idcard/${ProfileData?.id_card}`} onClick={recorddownload} download="userIdCard" target="__blank">
     Download your ID Card
    </a>

                  </div>):(<a href="javascript: void(0);"  download="userIdCard" >
     You have already downloaded
    </a>
           
                    )}
                    <br></br><br></br><br></br>
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
          {/*  <AudioPlayer />
            <VideoPlayer />*/}
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


const AudioPlayer = () => (
  <div>
      <audio controls>
        <source src="https://guard.ghamasaana.com/guard_new_api/sop/audiosamplefile.waptt.opus" type="audio/mp3" />
        Your window does not support the audio element.
      </audio>
  </div>
);

const VideoPlayer = (filename) => (
  <div>
      <video width="100%" height="auto" controls>
        <source src="https://guard.ghamasaana.com/guard_new_api/sop/videosamplefile.mp4" type="video/mp4" />
        Your window does not support the video tag.
      </video>
  </div>
);

const DownloadPdf = () => (
  <div>
    <a href="https://www.orimi.com/pdf-test.pdf" download="userIdCard" target="__blank">
      ANY DOWNLOAD TEXT - PDF
    </a>
  </div>
)
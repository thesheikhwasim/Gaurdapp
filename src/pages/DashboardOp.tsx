import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonInput, IonSelectOption, IonButton, IonModal, IonSelect, useIonToast, IonTextarea, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { Geolocation } from '@capacitor/geolocation';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import CustomHeader from './CustomHeader';
import '../utilities_constant';
import { BASEURL } from '../utilities_constant';
import CustomFooter from './CustomFooter';
const DashboardOp: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string }>();
  const [opRequestData, setOpRequestData] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [present, dismiss] = useIonToast();
  const [alertModal, setAlertModal] = useState(false);
  const [alertModalSite, setAlertModalSite] = useState(null);
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const token = localStorage.getItem('token');
  useEffect(() => {
    captureLocation().then((res) => {
      // console.log("BEFORE CALLED ONGOING of OP::::", res);
      getOPdashboard(res);
    }).catch((error) => {
      console.error("BEFORE CALLED ONGOING LOCATION ERROR");
    });
    // getOPdashboard();
    const storedData = localStorage.getItem('loggedInUser');
    if (storedData) {
      setLoggedInUser(JSON.parse(storedData));
    }
  }, []);

  function getOPdashboard(dataParam = 0) {
    const tokenData = localStorage.getItem('token');
    let URL = BASEURL+"op_ongoing_duty.php";
    let formData = new FormData();
    formData.append('action', "op_duty_ongoing");
    formData.append('token', tokenData);
    if (dataParam && dataParam?.coords && dataParam?.coords?.latitude) {
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    } else {
      formData.append('latitude', Latitude);
      formData.append('longitude', Longitude);
    }
    // return false;
    axios.post(URL, formData)
      .then(response => {
        if (response?.data && response?.data?.success) {
          setOpRequestData(response?.data?.employee_data?.site_route);
          if(response?.data?.employee_data?.duty_ongoing_info && response?.data?.employee_data?.duty_ongoing_info?.length){
            setIsRunning(true);
          }else{
            if(isRunning){
              setIsRunning(false);
            }
          }
        } else {
          // present({
          //   message: `Error getting subject list from API!`,
          //   duration: 2000,
          //   position: 'bottom',
          // });
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

  const captureLocation = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        // console.log("PERMISSION", permissions);
        // Case to validate permission is denied, if denied error message alert will be shown
        if (permissions?.location == "denied") {
          present({
            message: `"Location permission is denied, kindly enable from settings.`,
            duration: 2000,
            position: 'bottom',
          });
        }
        Geolocation.getCurrentPosition()
          .then((position) => {
            if (position && position.coords.latitude) {
              setLatitude(position.coords.latitude.toString());
              setLongitude(position.coords.longitude.toString());
            }
            resolve(position);
          })
          .catch((error) => {
            present({
              message: `"Location permission is denied, kindly enable from settings.`,
              duration: 2000,
              position: 'bottom',
            });
            reject(error);
          });
      } catch (error) {
        present({
          message: `"Location permission is denied, kindly enable from settings.`,
          duration: 2000,
          position: 'bottom',
        });
        reject(error);
      }
    });
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      // console.log("PAGE TO be ReFRESHED");
      getOPdashboard();
      event.detail.complete();
    }, 500);
  }

  function updateDashboardUIData(dataParam:any){
    // alert("Main UI updating function due to child movement");
    if(!alertModal){
      setOpRequestData(dataParam);
    }else{
      console.log("Since alert modal was true state cannot be updated or else form will cause issue due to re-render.");
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <CustomHeader />
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
              <IonCardTitle className='card-title-op'>{t('Nearby Sites')}</IonCardTitle>
            </IonCardHeader>

            <IonCardCustomComponent 
              opRequestData={opRequestData} 
              isRunningAPI={isRunning}
              setAlertModalSite={(data:any) => setAlertModalSite(data)}
              setAlertModal={(value:any) => setAlertModal(value)}
            />

            {(opRequestData && opRequestData.length > 0) &&
              <div className='dutyStartStopContainer'>
                <DutyStartStopAndMovement 
                  ongoingData={opRequestData} 
                  isRunningAPI={isRunning} 
                  refreshList={()=> getOPdashboard()}
                  updateUIforMovement={(data:any) => updateDashboardUIData(data)}
                />
              </div>
            }
          </IonCard>

          <div className="footer">
      <CustomFooter />
      </div>
        </div>

        {<ModalComponent
          siteInfo={alertModalSite}
          alertModal={alertModal}
          setAlertModal={() => {
            // console.log("setAlertModal(false) called from child component", alertModal);
            setAlertModal(false);
          }}
        />}
      </IonContent>
    </IonPage>
  );
};

export default DashboardOp;

function IonCardCustomComponent(props){

  return(<IonCardContent className="shift-details-card-content">
    <div className="shift-details-column">
      {(props.opRequestData && props.opRequestData.length > 0) &&
        props.opRequestData.map((siteData: any, key:number) =>
          <div 
            key={siteData.site_id} 
            className='siteItemOpUser' 
            onClick={() => {
              props.setAlertModalSite(siteData);
              props.setAlertModal(true);
            }}
          >
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
  </IonCardContent>)
}

function ModalComponent(props) { //Modal Component, so that side effect does not re-render main dashboardOP component
  const { takePhoto } = usePhotoGallery();
  const [present, dismiss] = useIonToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLatitude, setModalLatitude] = useState("");
  const [modalLongitude, setModalLongitude] = useState("");
  const [commentOfGuard, setCommentOfGuard] = useState("");
  const [imageOfGuard, setImageOfGuard] = useState("");
  const [imageNameOfGuard, setImageNameOfGuard] = useState("");
  const [guardSiteInfoDetailsFetched, setGuardSiteInfoDetailsFetched] = useState(null);

  useEffect(() => { //Effect to call guard site info based on alertmodal opened/not opened
    if (props.alertModal && props.siteInfo && props.siteInfo?.site_id) {
      Geolocation.getCurrentPosition().then((position) => {
        if (position && position.coords.latitude) {
          setModalLatitude(position?.coords?.latitude.toString());
          setModalLongitude(position?.coords?.longitude.toString());
          getGuardSiteInfo(position?.coords);
        }
        }).catch((error) => {
          // console.log("Issue in location so guard data cannot be loaded.");
          present({
            message: `Failed to get guard site details! Try again later.`,
            duration: 3000,
            position: 'bottom',
          });
      });
      // console.log("called EFFECT");
    }
  }, [props.alertModal]);


  function getGuardSiteInfo(dataParam = 0) { //API to get guard site details based on dashbard selected SITE ID
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'gaurd_site_data');
    formData.append('token', token);
    formData.append('site_id', props.siteInfo.site_id);
    // formData.append('site_id', 'HR0080');
    formData.append('latitude', dataParam?.latitude);
    formData.append('longitude', dataParam?.longitude);

    axios.post(BASEURL+'gaurd_site_info.php', formData).then((response) => {
      if (response.data && response.data.success) {
        // console.log(response.data);
        setGuardSiteInfoDetailsFetched(response?.data?.employee_data);
      } else if(!response?.data?.success && response?.data?.message){
        present({
          message: `${response?.data?.message}`,
          duration: 3000,
          position: 'bottom',
        });
      } else {
        present({
          message: `Failed to get site details! Try again later.`,
          duration: 2000,
          position: 'bottom',
        });
      }
      // setModalOpen(true);
    }).catch((error) => {
      console.error(`Error replying request:`, error);
      present({
        message: `Something went wrong. Please try again.`,
        duration: 2000,
        position: 'bottom',
      });
    });
  }

  function handleSubmitSiteInfo(){ //Submit guard site info by manager (click photo add comment and submit)
    let SITE_SUBMIT_URL = BASEURL+'opsitevisitInfo.php';
    let formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'op_site_visit_info');
    formData.append('token', token);
    formData.append('site_id', props.siteInfo?.site_id);
    // formData.append('site_id', 'HR0080');
    formData.append('latitude', modalLatitude);
    formData.append('longitude', modalLongitude);
    formData.append('operation_remark', commentOfGuard);
    formData.append('remark_Image', imageOfGuard);
    formData.append('route_name', props.siteInfo?.route_name);
    formData.append('gaurd_emp_id', guardSiteInfoDetailsFetched?.emp_id);
    formData.append('shift_type', guardSiteInfoDetailsFetched?.shift);

    axios.post(SITE_SUBMIT_URL, formData).then((response) => {
      if (response.data && response.data.success) {
        // console.log(response.data);
        // setGuardSiteInfoDetailsFetched(response?.data?.employee_data);
        present({
          message: `Visited site info data added successsfully!`,
          duration: 2000,
          position: 'bottom',
        });
        // props.setAlertModal()
        setImageNameOfGuard("")
        setImageOfGuard("")
        setCommentOfGuard("")
      }else{
        present({
          message: `Guard site details submision failed.`,
          duration: 2000,
          position: 'bottom',
        });
      }
    }).catch(()=>{
      present({
        message: `Something went wrong in submitting guard site details. Please try again.`,
        duration: 2000,
        position: 'bottom',
      });
    })
  }

  const capturedPhoto = () => { //Function to capture photo which will be sent to API on submission
    takePhoto().then(async (photoData:any) => {
      // console.log("PHOTO DATA::::", JSON.stringify(photoData));
      setImageOfGuard(JSON.stringify(photoData));
      setImageNameOfGuard(`Guard_${props.siteInfo?.site_id}_site.${photoData.format}`)
      Promise.resolve(photoData);
    }).catch((error:any) => {
      present({
        message: `Error in image capture. ${error}`,
        duration: 2000,
        position: 'bottom',
      });
      Promise.reject()
    })
  }

  function closeModalFunction(){
    setImageNameOfGuard("");
    setImageOfGuard("");
    setCommentOfGuard("");
    props.setAlertModal();
  }

  return (
    <IonModal isOpen={props.alertModal} onDidDismiss={() => closeModalFunction()}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{'Guard Site Info'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModalFunction()}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {/* {JSON.stringify(props.siteInfo)}
          API not rendering, to be rendered here!
          {JSON.stringify(guardSiteInfoDetailsFetched)} */}
          <div className='guardDetails'>
            {guardSiteInfoDetailsFetched && guardSiteInfoDetailsFetched?.photo &&
              <p className='duty-start-pic-guard'><strong>Guard Image:</strong> 
                <IonImg
                  src={BASEURL+`emp_image/${guardSiteInfoDetailsFetched?.photo}`}
                ></IonImg>
              </p>
            }
            <p className='duty-start-pic-guard'><strong>Guard Name:</strong> 
              {guardSiteInfoDetailsFetched?.full_name}
            </p>
          </div>
          <IonItem>
            <IonLabel position="floating">Add Comment</IonLabel>
            <IonInput value={commentOfGuard} onIonChange={e => setCommentOfGuard(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <button className='guardAddBtnCustom' onClick={()=>capturedPhoto()}>
              {imageNameOfGuard ? imageNameOfGuard : 'Add Image'}
            </button>
            {/* <IonButton
            className='crossIconBtnGuard'
            onClick={() => {
              alert('tter')
            }}>
              <IonIcon icon={closeOutline} size="large" color='grey'></IonIcon>
            </IonButton> */}
          </IonItem>
          {/* <div>{imageNameOfGuard}</div> */}
        </IonList>
        <IonButton expand="full" onClick={() => handleSubmitSiteInfo()}>Submit Site Information</IonButton>
      </IonContent>
    </IonModal>
  )
}


const DutyStartStopAndMovement = (props: any) => {
  const { t } = useTranslation();
  const intervalRef = useRef(null);
  const [present, dismiss] = useIonToast();
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  const [prevLatitude, setPrevLatitude] = useState('');
  const [prevLongitude, setPrevLongitude] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const history = useHistory();


  useEffect(()=>{
    if(props.isRunningAPI){
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
        }, 5000);
      }
    }
  },[props.isRunningAPI])

  useEffect(() => {
    if(props.isRunningAPI){
      captureLocation().then((res) => {
        if((res && 
          res?.coords && 
          res?.coords?.latitude) && 
          (prevLatitude != res?.coords?.latitude || prevLongitude != res?.coords?.longitude) && 
          res?.coords?.longitude){
          setPrevLatitude(res?.coords?.latitude);
          setPrevLongitude(res?.coords?.longitude);
          dutyMovementHandler(res);
          // console.log("OPERATIONS------> movement record called lat long not same");
        }
      }).catch((error)=>{
        console.error("ELAPSEDTIME LOCATION ERROR");
      });
      // console.log("OPERATIONS------> elapsedtime called via useeffect", JSON.stringify(prevLatitude));
    }
  }, [elapsedTime])

  // console.log("ongoing duty data sent as props::: "), props.ongoingData;

  function startStopHandler(startStopParam: string) {
    captureLocation().then((res) => {
      startStopParam == 'START' ? handleDutyStart(res) : handleDutyEnd(res);
    }).catch((error) => {
      console.error("BEFORE CALLED ONGOING LOCATION ERROR");
      present({
        message: `Location Error! Duty cannot be ${startStopParam == 'START' ? 'started' : 'stopped'}, contact us.`,
        duration: 4000,
        position: 'bottom',
      });
    });
  }

  async function handleDutyEnd(dataParam = 0) {
    clearInterval(intervalRef?.current);
    let STOP_URL = BASEURL+'opdutystop.php';
    let formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'op_punch_out');
    formData.append('token', token);
    if (dataParam && dataParam?.coords && dataParam?.coords?.latitude) {
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    } else {
      formData.append('latitude', Latitude);
      formData.append('longitude', Longitude);
    }

    const response = await axios.post(STOP_URL, formData);
    const data = response.data;
    props.refreshList();
    // Case to validate API was success and employee data is available
    if (data?.success) {

    } else {

    }
  }

  async function handleDutyStart(dataParam = 0) {
    let START_URL = BASEURL+'opdutystart.php';
    let formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'op_punch_in');
    formData.append('token', token);
    if (dataParam && dataParam?.coords && dataParam?.coords?.latitude) {
      formData.append('latitude', dataParam?.coords?.latitude);
      formData.append('longitude', dataParam?.coords?.longitude);
    } else {
      formData.append('latitude', Latitude);
      formData.append('longitude', Longitude);
    }

    const response = await axios.post(START_URL, formData);
    const data = response.data;
    // Case to validate API was success and employee data is available
    if (data?.success) {
      // console.log("OPERATIONS----> duty start is success, interval to be set below this");
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
        // console.log("OPERATIONS----> Inside interval set function");
      }, 5000);
      setIsRunning(true);
      dutyMovementHandler();
      props.refreshList();
      if (data && data.success && data?.employee_data &&
        data?.employee_data?.site_route && data?.employee_data?.site_route.length > 0
      ) {
        //in case any action to perform based on sending dutymovement
        setTimeout(() => {
          props.updateUIforMovement(data?.employee_data?.site_route);
        }, 1000);
      }
    } else {

    }
  };

  const dutyMovementHandler = (dataParam = 0) => {
    // Call duty movement API
    dutyMovementApi(dataParam).then((movementResponse) => {
      if (movementResponse && !movementResponse.success) {
        console.log(movementResponse);
      } else {
        // Update previous location only if API call was successful
        setPrevLatitude(Latitude);
        setPrevLongitude(Longitude);
      }
    });
  }

  async function dutyMovementApi(dataParam = 0) {
    try {
        console.error(dataParam, "LAT LONG IS DIFFERENT MOVEMENT RECORDED", Latitude, "!==", prevLatitude);
        let MOVEMENT_URL = BASEURL+'optripmovement.php';
        let formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('action', 'op_trip_movement');
        formData.append('token', token);
        if (dataParam && dataParam?.coords && dataParam?.coords?.latitude) {
          formData.append('latitude', dataParam?.coords?.latitude);
          formData.append('longitude', dataParam?.coords?.longitude);
        } else {
          formData.append('latitude', Latitude);
          formData.append('longitude', Longitude);
        }

        const response = await axios.post(MOVEMENT_URL, formData);
        // console.log("Movement Response OP:::::", response);
        if (response && response?.data && response?.data?.success && response?.data?.employee_data &&
          response?.data?.employee_data?.site_route && response?.data?.employee_data?.site_route.length > 0
        ) {
          //in case any action to perform based on sending dutymovement
          props.updateUIforMovement(response?.data?.employee_data?.site_route);
        }
        return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  const captureLocation = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions?.location == "denied") {
          present({
            message: `"Location permission is denied, kindly enable from settings.`,
            duration: 2000,
            position: 'bottom',
          });
        }
        Geolocation.getCurrentPosition()
          .then((position) => {
            if (position && position.coords.latitude) {
              setLatitude(position?.coords?.latitude.toString());
              setLongitude(position?.coords?.longitude.toString());
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

  return (
    <IonGrid className="ion-text-center">
      <IonRow>
        <IonCol size="12">
          {props.isRunningAPI ? ( //Duty ENd Button
            <IonButton expand="block" onClick={() => startStopHandler('STOP')} color="danger">
              {t('punchOut')}
            </IonButton>
          ) : ( //Duty Start BUtton
            <IonButton expand="block" onClick={() => startStopHandler('START')} color="primary">
              {t('punchIn')}
            </IonButton>
          )}
        </IonCol>
      </IonRow>
      <button onClick={() =>history.push('/pages/MapView')}>Goto MapView</button>
    </IonGrid>
  )
}

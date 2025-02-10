import React, { useEffect, useState } from 'react';
import { IonButtons,IonSpinner, IonDatetimeButton,IonModal, IonDatetime, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, useIonToast } from '@ionic/react';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { useHistory } from 'react-router-dom';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { Geolocation } from '@capacitor/geolocation';
import { Checkvalidtoken, DutyMovementGlobalApi, GlobalLogout, ValidateSimcardnumber } from '../utility/Globalapis';
const AddNewGuard: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [formData, setFormData] = useState({
    fullname: '',
    mobileno: '',
    enqrank: '',
    aadhar_no: '',
  father_name: '',
    mother_name: '',
    full_address: '',
    state: '',
    pincode: '',
    dep_site_add: '',
     siteid: '',
    remarks: '',
  });

  const [present] = useIonToast();
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showspinner, setShowSpinner] = useState(false);
  const [saveaadharfrontpic, setsaveaadharfrontpic] = useState('');
  const [saveaadharbackpic, setsaveaadharbackpic] = useState('');
  const [saveSelectedpic, setsaveSelectedpic] = useState('');
  const [saveSelectededucation, setsaveSelectededucation] = useState('');
  const { takePhoto } = usePhotoGallery();
  const { takePhotoWithPrompt } = usePhotoGalleryWithPrompt();
  const [datedoj, setdatedoj] = useState<any>('');
  const [datedob, setdatedob] = useState<any>('');
  const [aadharvalue, setaadharvalue] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationPermissionchk, setLocationPermissionchk] = useState(true);
  useEffect(()=>{
    logoutvalidate();
        let checkMandatoryFlag = mandatoryPass();

    if(checkMandatoryFlag){
      setButtonDisabled(false);
    }
   
  },[formData])

  async function logoutvalidate()
  {
  
  const checklogin= await Checkvalidtoken();
 
  if(checklogin){
    history.push('/pages/login');
    window.location.reload();
    return false;
}

}
  function ongoingNewHandlerWithLocation(){
    captureLocation('fromNewOngoingHandler').then((res) => {
      // console.log("BEFORE CALLED ONGOING::::", res);
      
      if((res && res?.coords && res?.coords?.latitude)){
        setLocationPermissionchk(true);
         setLatitude(res?.coords?.latitude);
        setLongitude(res?.coords?.longitude);
       
 
        handleAddGuard(res);

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
    setTimeout(async() => {
    
        window.location.reload();
      }, 5000);
      
        }
        else
        {
         
          setLocationPermissionchk(false);
         
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
 

  const handleInputChange = (e: any) => {
  
    const { name, value } = e.target;
   
    if (name==='mobileno' && value.length!=10)
      {
        present({
          message: `Mobile number should be 10 digits only!`,
          duration: 5000,
          position: 'top',
        });
        return false;
      }
     if (name==='pincode' && value.length!=6)
        {
          present({
            message: `Pin Code should be 6 digits only!`,
            duration: 5000,
            position: 'top',
          });
          return false;
        }
         if (name==='siteid' && value.length!=6)
          {
            present({
              message: `Site ID should be 6 digits only!`,
              duration: 5000,
              position: 'top',
            });
            return false;
          }
          if (name==='aadhar_no' && value.length!=12)
            {
              present({
                message: `Aadhar Number should be 12 digits only!`,
                duration: 5000,
                position: 'top',
              });
              return false;
            }
      
        setFormData({ ...formData, [name]: value });
      
   
  };



  function mandatoryPass(){
    const mandatoryFields = ['fullname','mobileno', 'enqrank', 'aadhar_no','father_name', 'mother_name', 'full_address', 'state',
      'pincode','dep_site_add','siteid','remarks'
    ];
    for (const field of mandatoryFields) {
     
      if (!formData[field]) {
        
        return false;
      }
    }
    return true;
  }


  
  const handlepiccameraStart = async () => {
    takePhotoWithPrompt().then(async (photoData:any) => {
      setsaveSelectedpic(JSON.stringify(photoData));
  
  });
  };



const handleaadharpicfrontcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveaadharfrontpic(JSON.stringify(photoData));

});
};

const handleaadharpicbackcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveaadharbackpic(JSON.stringify(photoData));

});
};


function underAgeValidate(birthday:any) {
  
  var dateOfBirth = new Date(birthday);
  const diff = Date.now() - dateOfBirth.getTime();

  const ageDate = new Date(diff);
  let age = Math.abs(ageDate.getUTCFullYear() - 1970);
 
    return age;
};

  const handleAddGuard = async (dataParam:any) => {
    
    const storedToken = localStorage.getItem('token');
    const token = storedToken; // Replace with your actual token
    // Validate mandatory fields
    const mandatoryFields = ['fullname','mobileno', 'enqrank', 'aadhar_no','father_name', 'mother_name', 'full_address', 'state',
      'pincode','dep_site_add','siteid','remarks'];
    for (const field of mandatoryFields) {
      if (!formData[field]) {
        present({
          message: `${field.replace('_', ' ')} is required`,
          duration: 2000,
          position: 'top',
        });
        return;
      }
    }

  

if (saveSelectedpic==='')
{
  present({
    message: `Profile Pic mandatory. Please select profile pic!`,
    duration: 5000,
    position: 'top',
  });
}
else if (saveaadharfrontpic==='')
  {
    present({
      message: `E-Aadhar Front side copy is mandatory. Please attach E-Aadhar Front side copy!`,
      duration: 5000,
      position: 'top',
    });
  }
  else if (saveaadharbackpic==='')
    {
      present({
        message: `E-Aadhar Back side copy is mandatory. Please attach E-Aadhar  Back side copy!`,
        duration: 5000,
        position: 'top',
      });
    }
    else if (underAgeValidate(datedob)<18 || underAgeValidate(datedob)>55)
      {
        present({
          message: `Guards age should be between 18 to 58!`,
          duration: 5000,
          position: 'top',
        });
      }
else
{
  




    const data = new FormData();
    data.append('action', 'add_new_gaurd');
    data.append('token', token);
    data.append('profile_pic', saveSelectedpic);
    data.append('aadhar_frontpic', saveaadharfrontpic);
    data.append('aadhar_backpic', saveaadharbackpic);
    data.append('DOJ', datedoj);
    data.append('DOB', datedob);
    if(dataParam && dataParam?.coords && dataParam?.coords?.latitude){
      data.append('latitude', dataParam?.coords?.latitude);
      data.append('longitude', dataParam?.coords?.longitude);
    }
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    console.log("formData ----> ", formData);
    setShowSpinner(true);
    setButtonDisabled(true);
    try {
      const response = await axios.post(BASEURL+'add_new_gaurd.php', data);
      
      if (response.data.success) {
        setShowSpinner(false);
        present({
          message: 'Guard added successfully!',
          duration: 2000,
          position: 'top',
        });
        setFormData({
          fullname: '',
          mobileno: '',
          enqrank: '',
        
          aadhar_no: '',
        father_name: '',
          mother_name: '',
          full_address: '',
          state: '',
          pincode: '',
          dep_site_add: '',
           siteid: '',
          remarks: '',
        });
       

        
      history.push('/pages/tabs/listgaurd');
      } else {
        setShowSpinner(false);
        setButtonDisabled(false);
        present({
          message: response.data.message,
          duration: 2000,
          position: 'top',
        });
      }
    } catch (error) {
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        position: 'top',
      });
      console.error('Error adding guard:', error);
    }
  }
  };

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

      <IonContent fullscreen>
        <IonCard className='shift-details-card'>
          <IonCardHeader>
            <IonCardTitle>{t('Add New Recruitment')} 
                  </IonCardTitle>
         
          </IonCardHeader>
          <IonItem>
          <IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='pages/tabs/listgaurd'>BACK</IonButton>
                  </IonButtons>
                  </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Full Name')} *:</IonLabel>
            <IonInput name="fullname" value={formData.fullname} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Mobile Number')} *</IonLabel>
            <IonInput name="mobileno" type='number' value={formData.mobileno} onIonChange={handleInputChange}></IonInput>
          </IonItem>

          
         <IonItem>
         <IonLabel>{t('Add Profile Pic')}  *:</IonLabel> 
         {saveSelectedpic ? (   <IonButton expand="full"   onClick={() => {setsaveSelectedpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>
          {saveSelectedpic && <>
          
          <IonItem>
             <img   onClick={handlepiccameraStart}
               src={`data:image/jpeg;base64,${JSON.parse(saveSelectedpic).base64String}`}
               alt="Preview Image"
               style={{ width: 'auto', height: '100px' }}
             />
           </IonItem>
         </>}

         {!saveSelectedpic &&<>   
 <IonItem>     <img    onClick={handlepiccameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}

  
          
         
          <IonItem>
            <IonLabel position="floating">{t('Rank')} *:</IonLabel>
            <IonInput name="enqrank" value={formData.enqrank} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          

          <IonItem>
            <IonLabel position="floating">{t('Aadhar No')} *:</IonLabel>
            <IonInput name="aadhar_no" type='number' max="12"   value={formData.aadhar_no} onIonInput={handleInputChange} ></IonInput>
          </IonItem>
         
          <IonItem>
         <IonLabel>{t('Add Aadhar Front Side')} *:</IonLabel> 
         {saveaadharfrontpic ? (   <IonButton expand="full"   onClick={() => {setsaveaadharfrontpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>


          {saveaadharfrontpic && <>
           <IonItem>
              <img  onClick={handleaadharpicfrontcameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(saveaadharfrontpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          {!saveaadharfrontpic &&<>   
 <IonItem>     <img    onClick={handleaadharpicfrontcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}


<IonItem>
         <IonLabel>{t('Add Aadhar Back Side')} *:</IonLabel> 
         {saveaadharbackpic ? (   <IonButton expand="full"   onClick={() => {setsaveaadharbackpic('');}}> {t('Clear Image')}</IonButton>
        ):('')}
 </IonItem>


          {saveaadharbackpic && <>
           <IonItem>
              <img  onClick={handleaadharpicbackcameraStart}
                src={`data:image/jpeg;base64,${JSON.parse(saveaadharbackpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          {!saveaadharbackpic &&<>   
 <IonItem>     <img    onClick={handleaadharpicbackcameraStart}
  src='./assets/imgs/image-preview.jpg'
  alt="Preview Image"
  style={{ width: 'auto', height: '60px' }}
/>


</IonItem></>}


            <IonItem>
            <IonLabel position="floating">{t('DOJ')} *:</IonLabel>
          <br></br>
            <IonDatetimeButton datetime="DOJ"></IonDatetimeButton>
<IonModal keepContentsMounted={true}>
        <IonDatetime id="DOJ"
        presentation='date'
          onIonChange={(dataTo) => {
            let dateFormat = dataTo?.detail?.value.split('T')[0];
            setdatedoj(dateFormat);
            
          }}
        ></IonDatetime>
      </IonModal>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('DOB')} *:</IonLabel>
            <br></br>
            <IonDatetimeButton datetime="DOB"></IonDatetimeButton>
<IonModal keepContentsMounted={true}>
        <IonDatetime id="DOB"
        presentation='date'
          onIonChange={(dataFrom) => {
            let dateFormat = dataFrom?.detail?.value.split('T')[0];
            setdatedob(dateFormat);
            
          }}
        ></IonDatetime>
         </IonModal>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Father`s Name')} *:</IonLabel>
            <IonInput name="father_name" value={formData.father_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Mother`s Name')} *:</IonLabel>
            <IonInput name="mother_name" value={formData.mother_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Full Address')} *:</IonLabel>
            <IonInput name="full_address" value={formData.full_address} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('State')} *:</IonLabel>
            <IonInput name="state" value={formData.state} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Pincode')} *:</IonLabel>
            <IonInput name="pincode" type="number" value={formData.pincode} onIonChange={handleInputChange}></IonInput>
          </IonItem>
         <IonItem>
            <IonLabel position="floating">{t('Deployed site Address')} *:</IonLabel>
            <IonInput name="dep_site_add" value={formData.dep_site_add} onIonChange={handleInputChange}></IonInput>
          </IonItem>
            
          <IonItem>
            <IonLabel position="floating">{t('Site ID')} *:</IonLabel>
            <IonInput name="siteid" value={formData.siteid} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Remarks')} *:</IonLabel>
            <IonInput name="remarks" value={formData.remarks} onIonChange={handleInputChange}></IonInput>
          </IonItem>

          {showspinner ? (
          <IonSpinner name="lines"></IonSpinner>
        ) : ('')}

          <IonButton expand="block" color="primary" size="default" 
          disabled={buttonDisabled} 
          onClick={ongoingNewHandlerWithLocation}>{t('Add Guard')}</IonButton>
        </IonCard>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>
  );
};

export default AddNewGuard;

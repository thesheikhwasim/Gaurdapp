import React, { useEffect, useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, 
  IonTitle, IonToolbar, IonInput, IonItem, IonLabel
  ,IonDatetimeButton, IonDatetime,IonModal, IonButton, IonCard, IonCardHeader, 
  IonCardTitle, useIonToast,IonSpinner, } from '@ionic/react';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { useHistory } from 'react-router-dom';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';


const AddNewGuard: React.FC = () => {
  // useAuth(); // Enforce login requirement

  const [formData, setFormData] = useState({
    fullname: '',
    mobileno: '',
    enqrank: '',
    education: '',
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
  const [saveSelectedpic, setsaveSelectedpic] = useState('');
  const [savedateofbirth, setsavedateofbirth] = useState('');
  const [savedateofjoin, setsavedateofjoin] = useState('');
  const [saveSelectedpolice, setsaveSelectedpolice] = useState('');
  const [showspinner, setshowspinner] = useState(false);
  const [saveeducationpic, setsaveeducationpic] = useState('');
  const [saveSelectedmedical, setsaveSelectedmedical] = useState('');
  const { takePhoto } = usePhotoGallery();
  const { takePhotoWithPrompt } = usePhotoGalleryWithPrompt();
  useEffect(()=>{
    let checkMandatoryFlag = mandatoryPass();
    if(checkMandatoryFlag){
      setButtonDisabled(false);
    }
  },[formData])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  function mandatoryPass(){
    const mandatoryFields = ['fullname', 'mobileno', 'father_name', 'mother_name', 'full_address', 'state','pincode'];
    for (const field of mandatoryFields) {
      if (!formData[field]) {
        return false;
      }
    }
    return true;
  }


  
const handlepolicecameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveSelectedpolice(JSON.stringify(photoData));

});
};

const handleeducationcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveeducationpic(JSON.stringify(photoData));

});
};

const handlepiccameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveSelectedpic(JSON.stringify(photoData));

});
};

  const handleAddGuard = async () => {
    
    const storedToken = localStorage.getItem('token');
    const token = storedToken; // Replace with your actual token
    // Validate mandatory fields
    const mandatoryFields = ['fullname', 'mobileno', 'father_name', 'mother_name', 'full_address', 'state','pincode'];
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


  




    const data = new FormData();
    data.append('action', 'add_new_gaurd');
    data.append('token', token);
    data.append('profile_pic', saveSelectedpic);
    data.append('education_pic', saveeducationpic);
    data.append('DOJ', savedateofjoin);
    data.append('DOB', savedateofbirth);
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
   
if(savedateofbirth==='')
{
  alert('Please select Date Of Birth');
}
else if(saveSelectedpic==='')  
  {
alert("Please Add Profile Pic!");
  }
else{
  setshowspinner(true);
  setButtonDisabled(true);
    try {
      const response = await axios.post(BASEURL+'add_new_gaurd.php', data);
      if (response.data.success) {
          setshowspinner(false);
        present({
          message: 'Guard added successfully!',
          duration: 2000,
          position: 'top',
        });
        setFormData({
          fullname: '',
          mobileno: '',
          enqrank: '',
          education: '',
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
      //  history.push('/pages/AddNewGuardDoc', { state: 'sdfsdfdsfd' });
      } else {
        present({
          message: 'Failed to add guard. Please try again.',
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
            <IonLabel position="floating">{t('Mobile Number')} *:</IonLabel>
            <IonInput name="mobileno" type='tel' value={formData.mobileno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton  expand="full" onClick={handlepiccameraStart}> {t('Add Profile Pic')}</IonButton>
          </IonItem>
          {saveSelectedpic && <>
            <span className='paddingLeftRight16'>Profile Pic Preview</span>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveSelectedpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
         <IonItem>
          <div className='dateToParent'>
                  <span className='dateTileSpan'><strong>{t('DOB')} *:</strong></span>
                  <>
                    <IonDatetimeButton datetime="datedob"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="datedob"
                        
                        presentation='date'
                        onIonChange={(datedob) => {
                          let dateFormat = datedob?.detail?.value.split('T')[0];
                          setsavedateofbirth(dateFormat);
                        
                        }}></IonDatetime>
                    </IonModal>
                  </>
                </div>
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
            <IonInput name="pincode" value={formData.pincode} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Rank')} :</IonLabel>
            <IonInput name="enqrank" value={formData.enqrank} onIonChange={handleInputChange}></IonInput>
          </IonItem>
           <IonItem>
            <IonLabel position="floating">{t('Education')} :</IonLabel>
            <IonInput name="education" value={formData.education} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handleeducationcameraStart}> {t('Attach Highest Education Proof Copy')}</IonButton>
          </IonItem>
          {saveeducationpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveeducationpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}

          <IonItem>
          <div className='dateToParent'>
                  <span className='dateTileSpan'><strong>{t('DOJ')} :</strong></span>
                  <>
                    <IonDatetimeButton datetime="datedoj"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="datedoj"
                       
                        presentation='date'
                        onIonChange={(datedoj) => {
                          let dateFormat = datedoj?.detail?.value.split('T')[0];
                          setsavedateofjoin(dateFormat);
                        }}></IonDatetime>
                    </IonModal>
                  </>
                </div>
              
          </IonItem>
           <IonItem>
            <IonLabel position="floating">{t('Deployed site Address')}</IonLabel>
            <IonInput name="dep_site_add" value={formData.dep_site_add} onIonChange={handleInputChange}></IonInput>
          </IonItem>
         <IonItem>
            <IonLabel position="floating">{t('Site ID')}</IonLabel>
            <IonInput name="siteid" value={formData.siteid} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Remarks')}</IonLabel>
            <IonInput name="remarks" value={formData.remarks} onIonChange={handleInputChange}></IonInput>
          </IonItem>

          {showspinner ? (
         <IonItem className='daily-report-submit'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : (<IonButton expand="block" color="primary" size="default" 
          disabled={buttonDisabled} 
          onClick={handleAddGuard}>{t('Add Guard')}</IonButton>)}

          
        </IonCard>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>
  );
};

export default AddNewGuard;

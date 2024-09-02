import React, { useEffect, useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, useIonToast } from '@ionic/react';
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
    prevrollno: '',
    education: '',
    height: '',
    DOJ: '',
    DOB: '',
    father_name: '',
    mother_name: '',
    full_address: '',
    state: '',
    pincode: '',
    aadhar_no: '',
    pan: '',
    blood_group: '',
    dep_site_add: '',
    bankacno: '',
    bankifsc: '',
    siteid: '',
    remarks: '',
  });

  const [present] = useIonToast();
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [saveSelectedpic, setsaveSelectedpic] = useState('');
  const [saveSelectedpolice, setsaveSelectedpolice] = useState('');
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
    const mandatoryFields = ['fullname', 'mobileno', 'father_name', 'mother_name', 'full_address', 'state'];
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

const handlemedicalcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveSelectedmedical(JSON.stringify(photoData));

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
    const mandatoryFields = ['fullname', 'mobileno', 'father_name', 'mother_name', 'full_address', 'state'];
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
    data.append('police_ver_report', saveSelectedpolice);
    data.append('medical_report', saveSelectedmedical);
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    console.log("formData ----> ", formData);

    try {
      const response = await axios.post(BASEURL+'add_new_gaurd.php', data);
      if (response.data.success) {
        present({
          message: 'Guard added successfully!',
          duration: 2000,
          position: 'top',
        });
        setFormData({
          fullname: '',
          mobileno: '',
          enqrank: '',
          prevrollno: '',
          education: '',
          height: '',
          DOJ: '',
          DOB: '',
          father_name: '',
          mother_name: '',
          full_address: '',
          state: '',
          pincode: '',
          aadhar_no: '',
          pan: '',
          blood_group: '',
          dep_site_add: '',
          bankacno: '',
          bankifsc: '',
          siteid: '',
          remarks: '',
        });
        history.push('/pages/tabs/listgaurd');
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
            <IonInput name="mobileno" type='tell' value={formData.mobileno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlepiccameraStart}> {t('Add Profile Pic')}</IonButton>
          </IonItem>
          
         
          <IonItem>
            <IonLabel position="floating">{t('Rank')}</IonLabel>
            <IonInput name="enqrank" value={formData.enqrank} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Previous Roll No')}</IonLabel>
            <IonInput name="prevrollno" value={formData.prevrollno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Education')}</IonLabel>
            <IonInput name="education" value={formData.education} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Height')}</IonLabel>
            <IonInput name="height" value={formData.height} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('DOJ')}</IonLabel>
            <IonInput name="DOJ" value={formData.DOJ} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('DOB')}</IonLabel>
            <IonInput name="DOB" value={formData.DOB} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Father`s Name')} *</IonLabel>
            <IonInput name="father_name" value={formData.father_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Mother`s Name')} *</IonLabel>
            <IonInput name="mother_name" value={formData.mother_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Full Address')} *</IonLabel>
            <IonInput name="full_address" value={formData.full_address} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('State')} *</IonLabel>
            <IonInput name="state" value={formData.state} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Pincode')}</IonLabel>
            <IonInput name="pincode" value={formData.pincode} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Aadhar No')}</IonLabel>
            <IonInput name="aadhar_no" value={formData.aadhar_no} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Pan Card')}</IonLabel>
            <IonInput name="pan" value={formData.pan} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Blood Group')}</IonLabel>
            <IonInput name="blood_group" value={formData.blood_group} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Deployed site Address')}</IonLabel>
            <IonInput name="dep_site_add" value={formData.dep_site_add} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlepolicecameraStart}> {t('Attach Police verification Report')}</IonButton>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlemedicalcameraStart}> {t('Attach Medical Report')}</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Bank A/C No')}</IonLabel>
            <IonInput name="bankacno" value={formData.bankacno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Bank IFSC')}</IonLabel>
            <IonInput name="bankifsc" value={formData.bankifsc} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Site ID')}</IonLabel>
            <IonInput name="siteid" value={formData.siteid} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Remarks')}</IonLabel>
            <IonInput name="remarks" value={formData.remarks} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonButton expand="block" color="primary" size="default" 
          disabled={buttonDisabled} 
          onClick={handleAddGuard}>{t('Add Guard')}</IonButton>
        </IonCard>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>
  );
};

export default AddNewGuard;

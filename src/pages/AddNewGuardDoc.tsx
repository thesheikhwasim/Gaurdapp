import React, { useEffect, useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, 
  IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, useIonToast,IonSpinner, } from '@ionic/react';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { usePhotoGallery, usePhotoGalleryWithPrompt } from '../../src/hooks/usePhotoGallery';
import { useHistory } from 'react-router-dom';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const AddNewGuardDoc: React.FC = () => {
 
  // useAuth(); // Enforce login requirement

  const [formData, setFormData] = useState({
    aadhar_no: '',
          pan: '',
          blood_group: '',
          bankacno: '',
          bankifsc: '',
  });

  const [present] = useIonToast();
  const history = useHistory();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showspinner, setshowspinner] = useState(false);
 
  const [saveaadharpic, setsaveaadharpic] = useState('');
  const [savepanpic, setsavepanpic] = useState('');
  const [savebankpic, setsavebankpic] = useState('');
   const [savegunpic, setsavegunpic] = useState('');
  const [saveepfpic, setsaveepfpic] = useState('');
  const [saveSelectedpolice, setsaveSelectedpolice] = useState('');
  const [saveSelectedmedical, setsaveSelectedmedical] = useState('');
  const [lastinsertedid, setlastinsertedid] = useState('');
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

  const GetGaurdLastinsertAPI = () => {
      let URL = BASEURL+"gaurd_lastinsert_id.php";
    const formData = new FormData();
    formData.append('action', "gaurd_lastinsert_id");
    formData.append('token', localStorage.getItem('token'));
    axios.post(URL, formData)
      .then(response => {
   
        if (response.data && response.data.success) {
          if (response.data.employee_data.inserted_id) { //condition to update count of record
            setlastinsertedid(response.data.employee_data.inserted_id);
          }
        
        } else {
          console.error('Failed to fetch Last Inserted ID:', response.data);
        }
     
      })
      .catch(error => {
        console.error('Error fetching duty info:', error);
      
      });

  }
  useEffect(()=>{
    GetGaurdLastinsertAPI();
  },[])

  function mandatoryPass(){
    const mandatoryFields = ['aadhar_no', 'pan', 'blood_group', 'bankacno', 'bankifsc'];
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


const handleaadharpiccameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveaadharpic(JSON.stringify(photoData));

});
};

const handlepanpiccameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavepanpic(JSON.stringify(photoData));

});
};

const handlebankcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavebankpic(JSON.stringify(photoData));

});
};





const handleguncameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsavegunpic(JSON.stringify(photoData));

});
};


const handleepfcameraStart = async () => {
  takePhotoWithPrompt().then(async (photoData:any) => {
  setsaveepfpic(JSON.stringify(photoData));

});
};

  const handleAddGuard = async () => {
    
    const storedToken = localStorage.getItem('token');
    const token = storedToken; // Replace with your actual token
    // Validate mandatory fields
    const mandatoryFields = ['aadhar_no', 'pan', 'blood_group', 'bankacno', 'bankifsc'];
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
    data.append('action', 'add_new_gaurd_document');
    data.append('token', token);
    data.append('gaurd_insert_id', lastinsertedid);
      data.append('police_ver_report', saveSelectedpolice);
    data.append('medical_report', saveSelectedmedical);
    data.append('aadhar_pic', saveaadharpic);
    data.append('pan_pic', savepanpic);
      data.append('bank_pic', savebankpic);
    data.append('gun_pic', savegunpic);
    data.append('epf_pic', saveepfpic);
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    console.log("formData ----> ", formData);

    try {
    if( saveSelectedpolice==='' && 
      saveSelectedmedical==='' && saveaadharpic==='' &&
      savepanpic===''  &&
      savebankpic==='')  
      {
alert("Profile, Police, Medical, Aadhar, Pan and Bank Copy are Mandatory!");
      }
      else{
        setshowspinner(true);
        setButtonDisabled(true);
      const response = await axios.post(BASEURL+'add_new_gaurdadd_gaurd_kyc.php', data);
      if (response.data.success) {
        present({
          message: 'Guard Kyc Document added successfully!',
          duration: 2000,
          position: 'top',
        });
        setFormData({
    
          aadhar_no: '',
          pan: '',
          blood_group: '',
          bankacno: '',
          bankifsc: '',
          });
        history.push('/pages/tabs/listgaurd');
      } else {
        present({
          message: 'Failed to add guard. Please try again.',
          duration: 2000,
          position: 'top',
        });
      }
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
            <IonCardTitle>{t('Attach KYC Documents Require for Recruitment')} 
                  </IonCardTitle>
         
          </IonCardHeader>
          <IonItem>
          <IonButtons slot="end">
                    <IonButton color={'primary'} className="md button button-full"  href='pages/tabs/listgaurd'>BACK</IonButton>
                  </IonButtons>
                  </IonItem>
      
     
       
     
          <IonItem>
            <IonLabel position="floating">{t('Aadhar No')}</IonLabel>
            <IonInput name="aadhar_no" type='number' max="10" value={formData.aadhar_no} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handleaadharpiccameraStart}> {t('Add Aadhar Pic')}</IonButton>
          </IonItem>
          {saveaadharpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveaadharpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          <IonItem>
            <IonLabel position="floating">{t('Pan Card')}</IonLabel>
            <IonInput name="pan" value={formData.pan} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlepanpiccameraStart}> {t('Add Pan Card Pic')}</IonButton>
          </IonItem>
          {savepanpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(savepanpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          <IonItem>
            <IonLabel position="floating">{t('Blood Group')}</IonLabel>
            <IonInput name="blood_group" value={formData.blood_group} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlemedicalcameraStart}> {t('Attach Medical Report')}</IonButton>
          </IonItem>
          {saveSelectedmedical && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveSelectedmedical).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          <IonItem>
          <IonButton expand="full" onClick={handlepolicecameraStart}> {t('Attach Police verification Report Copy')}</IonButton>
          </IonItem>
          {saveSelectedpolice && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveSelectedpolice).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          <IonItem>
            <IonLabel position="floating">{t('Bank A/C No')}</IonLabel>
            <IonInput name="bankacno" value={formData.bankacno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t('Bank IFSC')}</IonLabel>
            <IonInput name="bankifsc" value={formData.bankifsc} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
          <IonButton expand="full" onClick={handlebankcameraStart}> {t('Attach Bank Passbook Copy')}</IonButton>
          </IonItem>
          {savebankpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(savebankpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          
         
          <IonItem>
          <IonButton expand="full" onClick={handleguncameraStart}> {t('Attach Gun Licence Copy')}</IonButton>
          </IonItem>
          {savegunpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(savegunpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          <IonItem>
          <IonButton expand="full" onClick={handleepfcameraStart}> {t('Attach Existing EPF & ESIC No Copy')}</IonButton>
          </IonItem>
             {saveepfpic && <>
           <IonItem>
              <img
                src={`data:image/jpeg;base64,${JSON.parse(saveepfpic).base64String}`}
                alt="Preview Image"
                style={{ width: 'auto', height: '100px' }}
              />
            </IonItem>
          </>}
          {showspinner ? (
         <IonItem className='daily-report-submit'> <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
          <IonButton expand="block" color="primary" size="default" 
          disabled={buttonDisabled} 
          onClick={handleAddGuard}>{t('Submit Guard Document')}</IonButton>
        </IonCard>
      </IonContent>
      <div className="footer">
      <CustomFooter />
      </div>
    </IonPage>
  );
};

export default AddNewGuardDoc;

import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, useIonToast } from '@ionic/react';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook

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
    bankacno: '',
    bankifsc: '',
    siteid: '',
    remarks: '',
  });

  const [present] = useIonToast();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const response = await axios.post('https://guard.ghamasaana.com/guard_new_api/add_new_gaurd.php', data);
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
          bankacno: '',
          bankifsc: '',
          siteid: '',
          remarks: '',
        });
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
          <IonTitle>Add New Guard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard className='shift-details-card'>
          <IonCardHeader>
            <IonCardTitle>Add New Guard</IonCardTitle>
          </IonCardHeader>
          <IonItem>
            <IonLabel position="floating">Full Name *</IonLabel>
            <IonInput name="fullname" value={formData.fullname} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mobile No *</IonLabel>
            <IonInput name="mobileno" value={formData.mobileno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Rank</IonLabel>
            <IonInput name="enqrank" value={formData.enqrank} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Previous Roll No</IonLabel>
            <IonInput name="prevrollno" value={formData.prevrollno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Education</IonLabel>
            <IonInput name="education" value={formData.education} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Height</IonLabel>
            <IonInput name="height" value={formData.height} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">DOJ</IonLabel>
            <IonInput name="DOJ" value={formData.DOJ} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">DOB</IonLabel>
            <IonInput name="DOB" value={formData.DOB} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Father's Name *</IonLabel>
            <IonInput name="father_name" value={formData.father_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mother's Name *</IonLabel>
            <IonInput name="mother_name" value={formData.mother_name} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Full Address *</IonLabel>
            <IonInput name="full_address" value={formData.full_address} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">State *</IonLabel>
            <IonInput name="state" value={formData.state} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Pincode</IonLabel>
            <IonInput name="pincode" value={formData.pincode} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Aadhar No</IonLabel>
            <IonInput name="aadhar_no" value={formData.aadhar_no} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Bank A/C No</IonLabel>
            <IonInput name="bankacno" value={formData.bankacno} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Bank IFSC</IonLabel>
            <IonInput name="bankifsc" value={formData.bankifsc} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Site ID</IonLabel>
            <IonInput name="siteid" value={formData.siteid} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Remarks</IonLabel>
            <IonInput name="remarks" value={formData.remarks} onIonChange={handleInputChange}></IonInput>
          </IonItem>
          <IonButton expand="block" color="primary" size="default"  onClick={handleAddGuard}>Add Guard</IonButton>
        </IonCard>
      </IonContent>
      <div className="footer">
        <IonTitle className="footer ion-text-center">Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    </IonPage>
  );
};

export default AddNewGuard;

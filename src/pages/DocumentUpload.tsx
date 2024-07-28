import React, { useState } from 'react';
import { IonLabel, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonItem, IonList, IonSelect, IonSelectOption, IonFooter} from '@ionic/react';
import { useParams } from 'react-router';
import './Page.css';
import CustomHeader from './CustomHeader';

const DocumentUpload: React.FC = () => {
  const { name } = useParams<{ name: string; }>();

  const [document1, setDocument1] = useState<File | null>(null);
  const [document2, setDocument2] = useState<File | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState<boolean>(false);

  const handleDocument1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(files);
      
      setDocument1(files[0]);
    }
  };

  const handleDocument2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDocument2(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!document1 || !document2) {
      alert("Select both the images");
      return;
    }

    try {
      const reader = new FileReader();
      console.log("---------------");

      reader.onloadend = async () => {
        console.log("aaaa");
        const base64Data = reader.result?.toString().split(',')[1];
        alert(JSON.stringify(base64Data))
        console.log(base64Data);
        

        
        if (base64Data) {
          // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
          const apiUrl = 'YOUR_API_ENDPOINT';
          // const response = await axios.post(apiUrl, { image: base64Data });
          // console.log(response.data); // Handle the API response accordingly
        }
      };
      setDocumentsUploaded(true);

      // reader.readAsDataURL(image);
    } catch (error) {
      console.error('Error uploading image:', error);
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
          <IonTitle>{name}</IonTitle>          
        </IonToolbar>
        
      </IonHeader>
      <IonContent fullscreen className="ion-padding">

      <IonHeader  collapse="condense">
        <IonTitle>{name}</IonTitle>
        </IonHeader>        
        <IonCard className='ion-text-center ion-margin'>      
          <IonCardHeader>
            <IonCardTitle color={'dark'} >KYC</IonCardTitle>
            <IonCardSubtitle color={'dark'}>Document Upload</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
            {!documentsUploaded && (
                <>
                  <IonItem>
                      <IonLabel>Select Document 1</IonLabel>
                      {/* <IonInput
                          type="file"
                          accept=".jgp,.jpeg,.png"
                          onIonChange={(e) => handleDocument1Change(e)}
                      /> */}
                      <input type="file" accept="image/*" onChange={(e) => handleDocument1Change(e)} />
                  </IonItem>
                  <IonItem>
                      <IonLabel>Select Document 2</IonLabel>
                      {/* <IonInput type="file" accept=".jgp,.jpeg,.png" onIonChange={handleDocument2Change} /> */}
                      <input type="file" accept="image/*" onChange={(e) => handleDocument2Change(e)} />
                  </IonItem>

                  <IonButton expand="full" onClick={handleUpload}>
                    Upload Documents
                  </IonButton>
                </>
              )}

              {documentsUploaded && <p>Documents uploaded!</p>}
              </IonList>
          </IonCardContent>
        </IonCard>
        
      </IonContent>
    </IonPage>
  );
};

export default DocumentUpload;

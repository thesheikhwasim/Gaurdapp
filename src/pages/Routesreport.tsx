import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonCol, IonGrid, IonRow, IonDatetime, IonFooter, IonList, IonItem,IonRadioGroup, IonRadio} from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState } from 'react';
// import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
const Routesreport: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const openFileDialog = () => {
    (document as any).getElementById("file-upload").click();
 };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonImg class='header-image' src="./assets/imgs/header.png" alt="header" style={{display:'flex',height:'100px',width:'100%',margin:'7px'}}/>
          <IonTitle>{name}</IonTitle>          
        </IonToolbar>
        
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader  collapse="condense">
        <IonTitle>{name}</IonTitle>
        </IonHeader>        
        <IonCard color="medium" className='ion-margin-bottom ion-text-center'>
        <IonCardHeader>
          <IonCardTitle>Employee Name and ID</IonCardTitle>         
        </IonCardHeader>
      </IonCard>
      <IonList>
      <IonItem className='ion-margin-bottom'>
      <IonInput aria-label="Name" value="Guard Name" type='text'></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
      <IonInput aria-label="EmpId" value="Guard Id - 76554" type='text'></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
      <IonRadioGroup value="attendance">
      <IonRadio value="present">Present</IonRadio><IonRadio value="absent">Absent</IonRadio>      
      </IonRadioGroup>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
      <input type="file" id="file-upload" style={{ display: "none" }}/>
      <IonButton onClick={openFileDialog}>Upload Image</IonButton>
      </IonItem>
      <IonItem className='ion-margin-bottom ion-text-center' style={{align:'center'}}>
      <IonButton expand="block" color="secondary" shape='round'>Submit Report</IonButton>
      </IonItem>            
    </IonList>
      <IonGrid className='ion-margin ion-text-center'>
        <IonRow>
          <IonCol size="4" size-md="4" size-lg="4"><IonTitle><IonButton color="secondary" size="small">Ticket</IonButton></IonTitle></IonCol>
          <IonCol size="4" size-md="4" size-lg="4"><IonButton color="warning" size="small">Leave</IonButton></IonCol>
          <IonCol size="4" size-md="4" size-lg="4"><IonButton color="danger" size="small">SOS</IonButton></IonCol>
        </IonRow>
      </IonGrid>
      <div className='footer'>
    <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
      </div>
    {/* <IonFooter style={{"background-color": "yellow"}}>
        <IonToolbar className="footer">
          <IonTitle className='footer ion-text-center'>Helpline | +91 90999 XXXXX</IonTitle>
          <IonImg class='header-image' src="./assets/imgs/footer.jpg" alt="header" style={{display:'flex',height:'100px',width:'100%',margin:'7px'}}/> 
        </IonToolbar>
      </IonFooter> */}
      </IonContent>
    </IonPage>
  );
};

export default Routesreport;

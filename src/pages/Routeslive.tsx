import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonCol, IonGrid, IonRow, IonDatetime, IonFooter, IonList, IonItem,IonSelect, IonSelectOption} from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState } from 'react';
// import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
const Routeslive: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

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
      <IonGrid className='ion-margin ion-text-center'>
        <IonRow>
          <IonCol size="6" size-md="4" size-lg="6">
          <IonSelect placeholder="Zone Address" fill='solid'>
                <IonSelectOption value="zoneIdA">Zone Address</IonSelectOption>
                <IonSelectOption value="zoneIdB">Zone Address</IonSelectOption>
                </IonSelect>
          </IonCol>
          <IonCol size="6" size-md="4" size-lg="6"><IonButton color="warning" shape='round' size="small">Submit Report</IonButton></IonCol>
        </IonRow>
      </IonGrid>
      <IonList >
        <IonItem className='ion-margin ion-text-center'>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28477.901367193554!2d81.02842223476561!3d26.848294800000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3708aaf3875%3A0x76467ee672498ad2!2sZedgon%20Solutions%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1708247583531!5m2!1sen!2sin" width="800" height="600" loading="lazy"></iframe>      
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

export default Routeslive;

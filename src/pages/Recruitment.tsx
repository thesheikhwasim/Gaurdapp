import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonItem, IonList, IonFooter} from '@ionic/react';
import { useParams } from 'react-router';
// import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
const Recruitment: React.FC = () => {

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
        <IonCard className='ion-text-center ion-margin'>
      <img alt="Logo" src="./assets/imgs/logo.jpg"/>
      <IonCardHeader>
        <IonCardTitle color={'dark'} >New Recruitment</IonCardTitle>
        <IonCardSubtitle color={'dark'}>Welcome to Gurad Commander</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
      <IonList>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="Full Name" type='text' fill='solid' className='ion-padding' clearInput></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="Address" type='text' fill='solid' className='ion-padding' clearInput></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="City" type='text' fill='solid' className='ion-padding' clearInput></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="State" type='text' fill='solid' className='ion-padding' clearInput></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="Contact" type='number' fill='solid' className='ion-padding'></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
        <IonInput placeholder="Mobile" type='number' fill='solid' className='ion-padding' clearInput></IonInput>
      </IonItem>
      <IonItem className='ion-margin-bottom'>
      <IonButton expand="block" color="secondary" shape='round'>Register</IonButton>
      </IonItem>      
    </IonList>
      </IonCardContent>
    </IonCard>
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

export default Recruitment;

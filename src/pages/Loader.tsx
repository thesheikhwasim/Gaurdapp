import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonFooter } from '@ionic/react';
import { useParams } from 'react-router';
// import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
const Loader: React.FC = () => {

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
        <IonImg src="./assets/imgs/logo.jpg" alt="Logo" />
        </IonHeader>        
        {/* <ExploreContainer name={name} /> */}
        <IonImg src="./assets/imgs/splash.jpg" alt="splash" />
        <IonFooter>
        <IonToolbar>
          {/* <IonTitle className='ion-text-center ion-margin'>Copyright | Guard App</IonTitle> */}
          <IonImg class='header-image' src="./assets/imgs/footer.jpg" alt="header" style={{display:'flex',height:'100px',width:'100%',margin:'7px'}}/>

        </IonToolbar>
      </IonFooter>
      </IonContent>
    </IonPage>
  );
};

export default Loader;

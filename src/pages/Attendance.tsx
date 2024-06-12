import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonButton, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonCol, IonGrid, IonRow, IonDatetime, IonFooter, IonList, IonItem, IonProgressBar} from '@ionic/react';
import { useParams } from 'react-router';
// import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { useTranslation } from 'react-i18next';
const Attendance: React.FC = () => {

  const { name } = useParams<{ name: string; }>();
  const { t } = useTranslation();

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
          <IonCol size="6" size-md="4" size-lg="6"><IonTitle>Shift Timing Details</IonTitle></IonCol>
          <IonCol size="6" size-md="4" size-lg="6"><IonButton color="danger" shape='round' size="small">{t('punchOut')}</IonButton></IonCol>
        </IonRow>
      </IonGrid>
      <IonList >
        <IonItem className='ion-margin ion-text-center'>
        <IonDatetime
      presentation="date"
      highlightedDates={(isoString) => {
        const date = new Date(isoString);
        const utcDay = date.getUTCDate();

        if (utcDay % 5 === 0) {
          return {
            textColor: '#800080',
            backgroundColor: '#ffc0cb',
          };
        }

        if (utcDay % 3 === 0) {
          return {
            textColor: 'var(--ion-color-secondary-contrast)',
            backgroundColor: 'var(--ion-color-secondary)',
          };
        }

        return undefined;
      }}
    ></IonDatetime>
      </IonItem>
        <IonItem className='ion-margin ion-text-center'>
          <IonTitle size='small'>10:00am</IonTitle>
          <IonProgressBar value={0.25} buffer={0.5}></IonProgressBar>
          <IonTitle size='small'>07:00pm</IonTitle>
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

export default Attendance;

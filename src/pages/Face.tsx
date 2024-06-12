import { useState, useEffect } from 'react';
import { IonGrid,IonRow,IonCol, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, isPlatform,IonFab,
  IonFabButton,
  IonActionSheet, IonIcon, IonFooter} from '@ionic/react';import { useParams } from 'react-router';
import { usePhotoGallery } from '../../src/hooks/usePhotoGallery';
import './Page.css';
const Face: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery();
  
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
        {/* <IonGrid>
          <IonRow>
            <IonCol size="6" key={photos.filepath}>
                <IonImg src={photos.webviewPath} />
              </IonCol>
          </IonRow>
        </IonGrid> */}
        
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            {/* <IonIcon icon={logoIonic}></IonIcon> */}
          </IonFabButton>
        </IonFab>    
      </IonContent>
    </IonPage>
  );
};

export default Face;

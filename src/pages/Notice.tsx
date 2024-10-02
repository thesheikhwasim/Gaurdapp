import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, 
  IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonItem, IonList, IonLabel, IonLoading, IonIcon, IonModal, IonButton, 
  RefresherEventDetail,IonRefresher,IonRefresherContent, IonGrid } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import './Page.css';
import axios from 'axios';
import { addCircle, mailUnread, mailUnreadOutline, personCircle } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';

const Notice: React.FC = () => {
  const [noticeData, setNoticeData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeDetails, setNoticeDetails] = useState({});
  const [reloader, setReloader] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login'); // Redirect to login if token is not found
      return;
    }

    fetchNoticeData();
  }, [history]);

  const fetchNoticeData = async () => {
    const token = localStorage.getItem('token');
    const url = BASEURL+'notice.php';
    const formData = new FormData();
    formData.append('action', 'notice_data');
    formData.append('token', token);

    try {
      const response = await axios.post(url, formData);
      if (response.data && response.data.success) {
        setNoticeData(response.data.employee_data.notice);
        console.log(response.data.employee_data);
      } else {
        console.error('Failed to fetch notice data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notice data:', error);
    } finally {
      setLoading(false);
    }
  };

  const { name } = useParams<{ name: string }>();

  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  function triggerDetails(item) {
    setNoticeDetails(item);
    if (item?.ShowStatus != 1) {
      callReadApi(item);
    }
    setModalOpen(true);
  }

  function callReadApi(item) {
    const tokenVal = localStorage.getItem('token');
    let URL = BASEURL+"notice_status.php";
    const formData = new FormData();
    formData.append('action', "notice_status");
    formData.append('token', tokenVal);
    formData.append('notification_status', "1");
    formData.append('notice_id', item?.NoticeID);

    axios.post(URL, formData)
      .then(response => {
        if (response.data && response.data.success) {
          console.log("Updated notice status");
        } else {
          console.error('Failed to update status:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error updating status info:', error);
        setLoading(false);
      });
  }
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      fetchNoticeData();
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
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

      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        <IonHeader collapse="condense">
          <IonTitle>{name}</IonTitle>
        </IonHeader>
        <div className='ion-text-center shadowCard'>
          <IonCardHeader>
            <IonCardTitle className='logintitle' color={'dark'}>{t('Notification')}</IonCardTitle>
            <IonCardSubtitle className='subtitle' color={'dark'}>{t('Important Points for Guards/Duty')}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonGrid>
              {(noticeData && noticeData.length > 0) ? (noticeData.map((item, index) => (
                 <div className="content"   key={index} style={{ width: '100%' }}>
                  <IonCard className="shift-details-card">
                     <IonCardHeader  class="ion-text-center">
  <IonCardTitle >{t('Notification Title')} <strong>{item?.NoticeCategory || ''}</strong></IonCardTitle>
</IonCardHeader>
<IonCardContent className="shift-details-card-content">
                  <div className="shift-details-column">
                  
                    <div style={{textAlign:'left', marginBottom: '10px'}}>
                      <div></div>
                    </div>
                    <p style={{marginBottom:'0px'}}><strong>{t('Notification Description')}: </strong></p>
                    <div style={{textAlign:'left'}}>
                      <div>{item?.NoticeContent || ''}</div>
                    </div>
                  </div>
                  </IonCardContent>
                  </IonCard>
                </div>
              ))) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No notice found</div>
                </IonLabel>
              )}
            </IonGrid>
            <IonModal id="example-modal" isOpen={modalOpen} onDidDismiss={() => {
              // Call API so that list updates only when status is updated
              if (noticeDetails?.ShowStatus != 1) {
                fetchNoticeData();
              }
              // close modal
              setModalOpen(false);
            }}>
              <div className="wrapper">
                <h4>Notice {noticeDetails?.ShowStatus}</h4>
                <div className='notificationContainerModal'>
                  <div>
                    <span>{noticeDetails?.NoticeCategory}</span>
                  </div>
                  <div>
                    <span>{noticeDetails?.NoticeContent}</span>
                  </div>
                </div>
              </div>
            </IonModal>
          </IonCardContent>
        </div>
        <div className='footer'>
        <CustomFooter />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notice;

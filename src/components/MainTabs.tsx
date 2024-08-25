import React, { useEffect, useState } from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { calendar, location, informationCircle, people, homeOutline, notifications, notificationsCircleOutline, calendarOutline, ticketOutline } from 'ionicons/icons';
import SpeakerList from '../pages/listgaurd';
import SpeakerDetail from '../pages/DutyInfo';
import SessionDetail from '../pages/DutyInfo';
import MapView from '../pages/DutyInfo';
import Notice from '../pages/Notice';
import GetProfile from '../pages/Accountupd';
import Dashboard from '../pages/Dashboard';
import DashboardOp from '../pages/DashboardOp';
 import GetTicket from '../pages/getTicket';
 import GetSop from '../pages/getSop';
 import GetGallery from '../pages/getGallery';
 import GetListGuard from '../pages/listgaurd';
 import GetIdCard from '../pages/idCard';
 import GetLanguageSelector from '../pages/LanguageSelector';
 import GetemergencyContact from '../pages/emergencyContact';
 import Gethelptxt from '../pages/helptxt';
 
 import GetPostReport from '../pages/getPostReport';
import DutyInfo from '../pages/DutyInfo';
import Listgaurd from '../pages/listgaurd';
import { t } from 'i18next';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {
  const [loggedUserData, setLoggedUserData] = useState();

  useEffect(() => {
    const loggedUserData = localStorage.getItem('loggedInUser');
    setLoggedUserData(JSON.parse(loggedUserData));
    //console.log("Tab logged user type condition", loggedUserData);
  }, []);

  function renderDashboardHandler(){
    if(loggedUserData && loggedUserData?.designation_catagory == 'Operation'){
     // console.log("++++++renderDashboardHandler ", 'checker', loggedUserData);
      return <DashboardOp />;
    }else if(loggedUserData && (loggedUserData?.designation_catagory == 'Guard' || loggedUserData?.designation_catagory == 'Gaurd')){
      //console.log("++++++renderDashboardHandler ", 'guard', loggedUserData);
      return <Dashboard />;
    }
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/pages/tabs/Dashboard" />
         <Route
          path="/pages/tabs/Dashboard"
          render={() => renderDashboardHandler()}
          exact={true}
        />
        <Route
          path="/pages/tabs/getTicket"
          render={() => <GetTicket />}
          exact={true}
        />
        <Route
          path="/pages/tabs/speakers/:id"
          component={SpeakerDetail}
          exact={true}
        />
        <Route path="/pages/tabs/Dashboard/:id" component={SessionDetail} />
        <Route exact path="/pages/tabs/DutyInfo" render={() => <GetProfile />} component={DutyInfo} />
        <Route path="/pages/tabs/getSop" render={() => <GetSop />} exact={true} />
        <Route path="/pages/tabs/Accountupd" render={() => <GetProfile />} exact={true} />
        <Route path="/pages/tabs/getTicket/:id" component={SessionDetail} />
        <Route path="/pages/tabs/getSop" render={() => <GetSop />} exact={true} />
        <Route path="/pages/tabs/getGallery" render={() => <GetGallery />} exact={true} />
        <Route path="/pages/tabs/listgaurd" render={() => <Listgaurd />} exact={true} />
        <Route path="/pages/tabs/idCard" render={() => <GetIdCard />} exact={true} />
        <Route path="/pages/tabs/LanguageSelector" render={() => <GetLanguageSelector />} exact={true} />
        <Route path="/pages/tabs/emergencyContact" render={() => <GetemergencyContact />} exact={true} />
        <Route path="/pages/tabs/helptxt" render={() => <Gethelptxt />} exact={true} />
        
        <Route path="/pages/tabs/getPostReport" render={() => <GetPostReport />} exact={true} />
      
        <Route 
          path="/pages/tabs/Dashboard/Notice" 
          component={Notice}
          exact={true} 
        />
        <Route 
          path="/pages/tabs/Notice" 
          render={() => <Notice />} 
          component={Notice}
          exact={true} 
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="Dashboard" href="/pages/tabs/Dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>{t('dashboard')}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="getTicket" href="/pages/tabs/getTicket">
          <IonIcon icon={ticketOutline} />
          <IonLabel>{t('Tickets')}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="getSop" href="/pages/tabs/getSop">
          <IonIcon icon={calendarOutline} />
          <IonLabel>{t('SOP')}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Notice" href="/pages/tabs/Notice">
          <IonIcon icon={notificationsCircleOutline} />
          <IonLabel>{t('Notification')}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Setting" href="/pages/tabs/Accountupd">
          <IonIcon icon={people} />
          <IonLabel>{t('Profile')}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;

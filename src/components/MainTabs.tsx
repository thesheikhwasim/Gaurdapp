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
import SpeakerList from '../pages/ListGuard';
import SpeakerDetail from '../pages/DutyInfo';
import SessionDetail from '../pages/DutyInfo';
import MapView from '../pages/DutyInfo';
import Notice from '../pages/Notice';
import Dashboard from '../pages/Dashboard';
import DashboardOp from '../pages/DashboardOp';
 import GetTicket from '../pages/getTicket';
import GetRequests from '../pages/getRequest';
import DutyInfo from '../pages/DutyInfo';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {
  const [loggedUserData, setLoggedUserData] = useState();

  useEffect(() => {
    const loggedUserData = localStorage.getItem('loggedInUser');
    setLoggedUserData(JSON.parse(loggedUserData));
    console.log("Tab logged user type condition", loggedUserData);
  }, []);

  function renderDashboardHandler(){
    if(loggedUserData && loggedUserData?.designation_catagory == 'Operation'){
      console.log("++++++renderDashboardHandler ", 'checker', loggedUserData);
      return <DashboardOp />;
    }else if(loggedUserData && (loggedUserData?.designation_catagory == 'Guard' || loggedUserData?.designation_catagory == 'Gaurd')){
      console.log("++++++renderDashboardHandler ", 'guard', loggedUserData);
      return <Dashboard />;
    }
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/pages/tabs/Dashboard" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
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
        <Route exact path="/pages/tabs/Dashboard/DutyInfo" component={DutyInfo} />
        <Route path="/pages/tabs/getTicket/:id" component={SessionDetail} />
        <Route path="/pages/tabs/getRequest" render={() => <GetRequests />} exact={true} />
        <Route path="/pages/tabs/Notice" render={() => <Notice />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="Dashboard" href="/pages/tabs/Dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="getTicket" href="/pages/tabs/getTicket">
          <IonIcon icon={ticketOutline} />
          <IonLabel>Ticket</IonLabel>
        </IonTabButton>
        <IonTabButton tab="getRequest" href="/pages/tabs/getRequest">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Leave</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Notice" href="/pages/tabs/Notice">
          <IonIcon icon={notificationsCircleOutline} />
          <IonLabel>Notice</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;

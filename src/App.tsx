import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Loader from './pages/Loader';
import { useTranslation } from 'react-i18next';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import LanguageSelector from './pages/LanguageSelector';
import Recruitment from './pages/Recruitment';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Face from './pages/Face';
import Accountupd from './pages/Accountupd';
import getRequest from './pages/getRequest';
import getTicket from './pages/getTicket';
import AddNewGuard from './pages/AddNewGuard';
import idCard from './pages/idCard';

// import ListGuards from './pages/listGuard.js';

import DutyInfo from './pages/DutyInfo';
import Attendance from './pages/Attendance';
import Notice from './pages/Notice';
import Routes from './pages/Routes';
import Routeslive from './pages/Routeslive';
import Routesend from './pages/Routesend';
import Routesreport from './pages/Routesreport';
import DocumentUpload from './pages/DocumentUpload';
import Logout from './pages/Logout';

// import Logout from './pages/Logout';
setupIonicReact();

const App: React.FC = () => {
  const { t } = useTranslation();
  return (
    <I18nextProvider i18n={i18n}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              {/* <Route exact path="/" component={Loader}/> */}
              <Route exact path="/" component={LanguageSelector}/>
              <Route exact path="/pages/Login" component={Login}/>
              {/* <Route exact path="/pages/Register" component={Register}/> */}
              {/* <Route exact path="/pages/Recruitment" component={Recruitment}/> */}
              <Route exact path="/pages/Dashboard" component={Dashboard}/>
              <Route exact path="/pages/Accountupd" component={Accountupd}/>
              <Route exact path="/pages/getRequest" component={getRequest}/>
              <Route exact path="/pages/getTicket" component={getTicket}/>
              <Route exact path="/pages/DutyInfo" component={DutyInfo}/>
              <Route exact path="/pages/AddNewGuard" component={AddNewGuard}/>
              <Route exact path="/pages/idCard" component={idCard}/>
              <Route exact path="/pages/LanguageSelector" component={LanguageSelector}/>

              {/* <Route exact path="/pages/ListGuard" component={ListGuards}/> */}
              <Route exact path="/pages/Notice" component={Notice}/>
              {/* <Route exact path="/pages/Logout" component={Logout}/> */}
              {/* <Route exact path="/pages/Account" component={Account}/> */}
              <Route exact path="/pages/Face" component={Face}/>
              {/*<Route exact path="/pages/Accountupd" component={Accountupd}/> */}
              <Route exact path="/pages/Attendance" component={Attendance}/>
             {/* <Route exact path="/pages/Notice" component={Notice}/>
              <Route exact path="/pages/Routes" component={Routes}/>
              <Route exact path="/pages/Routeslive" component={Routeslive}/>
              <Route exact path="/pages/Routesend" component={Routesend}/>
              <Route exact path="/pages/Routesreport" component={Routesreport}/>             */}
              <Route exact path="/pages/DocumentUpload" component={DocumentUpload}/>
              <Route exact path="/pages/Logout" component={Logout}/>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </I18nextProvider>
  );
};

export default App;

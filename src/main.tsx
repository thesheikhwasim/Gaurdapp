import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { addListeners, registerNotifications } from './utility/pushNotifications';

registerNotifications(); //Initialise notification prompt
addListeners(); //Add listner to check notification conditions and values

// Call the element loader before the render call
defineCustomElements(window);
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
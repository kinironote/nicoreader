import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie'	// ←react-cookeもモジュールを読み込む

ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>, document.getElementById('root') )
registerServiceWorker();

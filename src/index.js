import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {FakeStoreIndex} from './Fakestore/FakestoreIndex';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FakeStoreIndex/>
      </LocalizationProvider>
    </CookiesProvider>
  </React.StrictMode>
);

reportWebVitals();
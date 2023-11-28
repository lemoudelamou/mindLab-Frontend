import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './Componenets/Navbar';
import Home from './Componenets/Home';
import Data from './Componenets/Data';
import Footer from './Componenets/Footer';
import PatientInfoPage from './Componenets/PatientInfoPage';
import SettingsPage from './Componenets/SettingsPage';
import ReactionTimeExperiment from './Componenets/ReactionTimeExperiment'
import Results from './Componenets/Results';
import 'core-js/stable';
import 'regenerator-runtime/runtime';



export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

function AppRouter() {
  const location = useLocation();

  return (
    <div>
      {location.pathname === '' ? null : <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/patient-info" element={<PatientInfoPage/>}/>
        <Route path="/settings" element={<SettingsPage />}/>
        <Route path="/ReactionTimeExperiment" element={<ReactionTimeExperiment/>}/>
        <Route path="/results" element={<Results />} />
        <Route path="/Home" element={<Home />}/>
        <Route path="/data" element={<Data />}/>

      </Routes>
      {location.pathname === '' ? null : <Footer/>}

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

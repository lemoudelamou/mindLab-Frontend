import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './Componenets/Home';
import Data from './Componenets/Data/Data';
import Footer from './Componenets/Footer/Footer';
import PatientInfoPage from './Componenets/Experiment/PatientInfoPage';
import SettingsPage from './Componenets/Experiment/SettingsPage';
import ReactionTimeExperiment from './Componenets/Experiment/ReactionTimeExperiment'
import Results from './Componenets/Experiment/Results';
import GroupResults from "./Componenets/Data/GroupResults";
import LevelsDescription from './Componenets/Sidebar/LevelsDescription';
import UserGuide from './Componenets/Sidebar/UserGuide';
import Contact from './Componenets/Sidebar/Contact'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import PatientList from './Componenets/Data/PatientList';
import DemoHome from './Demo/DemoHome'
import DemoPatientInfoPage from './Demo/DemoExperiment/DemoPatientInfoPage';
import DemoSettings from './Demo/DemoExperiment/DemoSettings';
import DemoExperiment from './Demo/DemoExperiment/DemoExperiment';
import DemoResults from "./Demo/DemoExperiment/DemoResults";
import DemoData from './Demo/Data/DemoData';
import DemoPatientList from './Demo/Data/DemoPatientList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';




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

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/patient-info" element={<PatientInfoPage/>}/>
        <Route path="/settings" element={<SettingsPage />}/>
        <Route path="/patientList" element={<PatientList />}/>
        <Route path="/reactionTimeExperiment" element={<ReactionTimeExperiment/>}/>
        <Route path="/results" element={<Results />} />
        <Route path="/group-results" element={<GroupResults />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/data" element={<Data />}/>
        <Route path="/levelsDescription" element={<LevelsDescription />}/>
        <Route path="/userGuide" element={<UserGuide />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/demoHome" element={<DemoHome />}/>
        <Route path="/demo-patient-info" element={<DemoPatientInfoPage/>}/>
        <Route path="/demo-settings" element={<DemoSettings />}/>
        <Route path="/demo-experiment" element={<DemoExperiment/>}/>
        <Route path="/demo-results" element={<DemoResults />} />
        <Route path="/demo-patientList" element={<DemoPatientList />} />
        <Route path="/demo-data" element={<DemoData />} />
      </Routes>



      {location.pathname === '' ? null : <Footer/>}



    </div>



  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

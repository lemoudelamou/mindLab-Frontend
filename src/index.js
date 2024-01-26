import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import './index.css';
import Home from './Components/Home/Home';
import Data from './Components/Data/Data';
import Footer from './Components/Footer/Footer';
import PatientInfoPage from './Components/Experiment/PatientInfoPage';
import SettingsPage from './Components/Experiment/SettingsPage';
import ReactionTimeExperiment from './Components/Experiment/ReactionTimes/ReactionTimeExperiment'
import Results from './Components/Data/Results';
import GroupResults from "./Components/Data/GroupResults";
import PatientResults from "./Components/Data/PatientResults";
import LevelsDescription from './Components/Sidebar/LevelsDescription';
import UserGuide from './Components/Sidebar/UserGuide';
import Contact from './Components/Sidebar/Contact'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import PatientList from './Components/Data/PatientList';
import DemoHome from './DemoComponents/DemoHome/DemoHome'
import DemoPatientInfoPage from './DemoComponents/DemoExperiment/DemoPatientInfoPage';
import DemoSettings from './DemoComponents/DemoExperiment/DemoSettings';
import DemoExperiment from './DemoComponents/DemoExperiment/DemoExperiment';
import DemoResults from "./DemoComponents/DemoData/DemoResults";
import DemoData from './DemoComponents/DemoData/DemoData';
import DemoPatientList from './DemoComponents/DemoData/DemoPatientList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Benefits from "./Components/Sidebar/Benefits";
import DemoVersion from "./Components/Sidebar/DemoVersion";
import AboutProject from "./Components/Sidebar/AboutProject";
import DemoPatientResults from "./DemoComponents/DemoData/DemoPatientResults";
import DemoGroupResults from "./DemoComponents/DemoData/DemoGroupResults";
import ModifyPatientResults from "./Components/Data/ModifyPatientResults";
import DemoModifyPatientResults from "./DemoComponents/DemoData/DemoModifyPatientResults";
import ConfirmClose from "./utils/ConfirmClose";
import Login from "./Components/authentification/Login";
import Register from "./Components/authentification/Register";
import {AuthProvider} from "./utils/AuthContext";
import Dashboard from "./Components/Dashboard/Dashbord";
import Calender from "./Components/Dashboard/Calender";
import Profile from "./Components/Dashboard/Profile";
import ForgotPassword from "./Components/authentification/ForgotPassword";
import ResetPassword from "./Components/authentification/ResetPassword";
import VerifyAccount from "./Components/authentification/VerifyAccount";
import List from "./Components/Dashboard/List";

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
        <Route path="/patient-results" element={<PatientResults />} />
        <Route path="/modify-patient-data" element={<ModifyPatientResults />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-registration" element={<VerifyAccount />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/calender" element={<Calender/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/list" element={<List/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/data" element={<Data />}/>
        <Route path="/about" element={<AboutProject />}/>
        <Route path="/levelsDescription" element={<LevelsDescription />}/>
        <Route path="/userGuide" element={<UserGuide />}/>
        <Route path="/benefits" element={<Benefits />}/>
        <Route path="/demo-version" element={<DemoVersion />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/demoHome" element={<DemoHome />}/>
        <Route path="/demo-patient-info" element={<DemoPatientInfoPage/>}/>
        <Route path="/demo-settings" element={<DemoSettings />}/>
        <Route path="/demo-experiment" element={<DemoExperiment/>}/>
        <Route path="/demo-results" element={<DemoResults />} />
        <Route path="/demo-patientList" element={<DemoPatientList />} />
        <Route path="/demo-patient-results" element={<DemoPatientResults />} />
        <Route path="/demo-modify-patient-data" element={<DemoModifyPatientResults />} />
        <Route path="/demo-group-results" element={<DemoGroupResults />} />
        <Route path="/demo-data" element={<DemoData />} />
      </Routes>
      {location.pathname === '' ? null : <Footer/>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
        <AuthProvider>
          <AppRouter/>
        </AuthProvider>
      </BrowserRouter>
);

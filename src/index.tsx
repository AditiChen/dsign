import "./i18n";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import App from "./App";
import Landing from "./pages/Landing/Landing";
import PortfolioBricks from "./pages/PortfolioBricks/PortfolioBricks";
import Profile from "./pages/Profile/Profile";
import ProjectList from "./pages/ProjectList/ProjectList";
import CreateNewProject from "./pages/CreateNewProject/CreateNewProject";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Landing />} />
        <Route path="portfolioBricks" element={<PortfolioBricks />} />
        <Route path="profile" element={<Profile />} />
        <Route path="projectList" element={<ProjectList />} />
        <Route path="createNewProject" element={<CreateNewProject />} />
        <Route path="*" element={<Navigate to="profile" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();

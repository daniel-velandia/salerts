import "./css/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { Provider } from "react-redux";
import { store } from "@/infraestructure/store";
import { AppFeedback, PrivateRoute } from "./components/common";
import DashboardLayout from "./components/layout/DashboardLayout";
import Error404 from "./pages/Error404";
import { StudentsPage } from "./pages/student/StudentsPage";
import { StudentCreateEditPage } from "./pages/student/StudentCreateEditPage";
import { StaffPage } from "./pages/staff/StaffPage";
import { StaffCreateEditPage } from "./pages/staff/StaffCreateEditPage";
import { GradeManagement } from "./pages/GradeManagement";
import { SubjectsPage } from "./pages/subjects/SubjectsPage";
import { SubjectCreateEditPage } from "./pages/subjects/SubjectCreateEditPage";
import { ProgramsPage } from "./pages/programs/ProgramsPage";
import { ConfigurationPage } from "./pages/configuration/ConfigurationPage";
import { GroupsPage } from "./pages/groups/GroupsPage";
import { GroupCreateEditPage } from "./pages/groups/GroupCreateEditPage";
import { ProfilePage } from "./pages/user/ProfilePage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppFeedback />
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/student" element={<StudentCreateEditPage />} />
              <Route path="/student/:id" element={<StudentCreateEditPage />} />
              <Route path="/academic-staff" element={<StaffPage />} />
              <Route
                path="/academic-staff/create-edit"
                element={<StaffCreateEditPage />}
              />
              <Route
                path="/academic-staff/create-edit/:id"
                element={<StaffCreateEditPage />}
              />
              <Route path="/grades" element={<GradeManagement />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route
                path="/subjects/create"
                element={<SubjectCreateEditPage />}
              />
              <Route
                path="/subjects/edit/:id"
                element={<SubjectCreateEditPage />}
              />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/new" element={<GroupCreateEditPage />} />
              <Route path="/groups/edit/:id" element={<GroupCreateEditPage />} />
              <Route path="/configuration" element={<ConfigurationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLandingPage from "./pages/UserLandingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAuth from "./components/features/AdminAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminAuth>
              <AdminDashboardPage />
            </AdminAuth>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


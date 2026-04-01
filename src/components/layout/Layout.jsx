import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import "./layout.css";

function Layout({ children }) {
  const location = useLocation();
  const isAdminLayout = location.pathname.startsWith("/admin-dashboard");

  return (
    <div className={`app-layout ${isAdminLayout ? "admin-layout" : ""}`}>

      <Sidebar/>

      <div className="app-layout-content">
        {children}
      </div>

    </div>
  );
}

export default Layout;
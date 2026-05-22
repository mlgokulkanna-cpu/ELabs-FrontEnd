import react from "react";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({children}:DashboardLayoutProps) => {
    return(
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div> 
    );
};

export default DashboardLayout;
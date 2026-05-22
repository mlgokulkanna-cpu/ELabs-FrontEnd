import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
const [collapsed, setCollapsed] = useState(false);
const navigate = useNavigate();
const location = useLocation();

const menuItems = [
{
label: "BOM Customer Overview",
path: "/overview",
icon: (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
<circle cx="9" cy="7" r="4"/>
<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>
)
},
{
label: "FG Drill-through",
path: "/drillthrough",
icon: (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="11" cy="11" r="8"/>
<line x1="21" y1="21" x2="16.65" y2="16.65"/>
<line x1="11" y1="8" x2="11" y2="14"/>
<line x1="8" y1="11" x2="14" y2="11"/>
</svg>
)
},
{
label: "Attachments",
path: "/attachments",
icon: (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
</svg>
)
}
];

return (
<div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
<div className="sidebar-header">
{collapsed ? (
<div className="sidebar-brand-collapsed">
<img
src="elab_logo.jpg"
alt="Elevation Labs"
className="sidebar-logo-small"
/>

<button
className="sidebar-toggle-collapsed"
onClick={() => setCollapsed(false)}
>
›
</button>
</div>
) : (
<div className="sidebar-brand">
<div className="sidebar-brand-left">
<img
src="elab_logo.jpg"
alt="Elevation Labs"
className="sidebar-logo"
/>

<span className="brand-text">Pages</span>
</div>

<button
className="sidebar-toggle"
onClick={() => setCollapsed(true)}
>
‹
</button>
</div>
)}
</div>

<div className="sidebar-menu">
{menuItems.map((item) => (
<div
key={item.path}
className={`menu-item ${
location.pathname === item.path ? "active" : ""
}`}
title={item.label}
onClick={() => navigate(item.path)}
>
<span className="menu-icon">
{item.icon}
</span>

{!collapsed && (
<span className="menu-text">
{item.label}
</span>
)}
</div>
))}
</div>
</div>
);
};

export default Sidebar;
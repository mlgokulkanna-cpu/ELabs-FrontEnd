import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">
          BOM Extraction - Customer Overview
        </h1>
        <p className="header-subtitle">
          Review extracted FG records and line items by client
        </p>
      </div>
    </header>
  );
};

export default Header;
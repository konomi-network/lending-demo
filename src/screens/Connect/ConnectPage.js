import React from "react";

import "./ConnectPage.scss";

export default function Main(props) {
  const { apiState } = props;
  const displayInfo = () => {
    if (apiState === "ERROR") return "Error Connecting to server";
    else if (apiState === "CONNECTING" || apiState === "CONNECT_INIT")
      return "Connecting...";
    else return null;
  };
  return (
    <div className="Connect-container">
      <p className="Connect-info">{displayInfo()}</p>
    </div>
  );
}

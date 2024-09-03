import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import UserGlobalState from "./ContextAPI/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserGlobalState>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserGlobalState>
);

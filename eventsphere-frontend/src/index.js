import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom"; 
import "./styles/global.css";
import { NotificationProvider } from "./components/NotificationContext";
 

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="377759184191-uj8lgqn4q4nfar3b49d2nupggnjtjfad.apps.googleusercontent.com">
      
      <NotificationProvider> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>

    </GoogleOAuthProvider>
  </React.StrictMode>
);


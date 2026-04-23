import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="377759184191-uj8lgqn4q4nfar3b49d2nupggnjtjfad.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


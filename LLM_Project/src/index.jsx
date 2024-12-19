import React from "react";
import ReactDOM from "react-dom/client";  // Import from 'react-dom/client' in React 18
import "./index.css"; 
import Translator from "./Translator";

const root = ReactDOM.createRoot(document.getElementById("root"));  // Create a root element
root.render(
  <React.StrictMode>
    <Translator />
  </React.StrictMode>
);

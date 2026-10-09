import React from "react";
import { createRoot } from "react-dom/client";
import AtelierConstructor from "./AtelierConstructor.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AtelierConstructor />
  </React.StrictMode>
);

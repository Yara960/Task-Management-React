import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./Components/Header";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />

    <div
      style={{
        height: "15px",
        backgroundColor: "#d1759e",
        width: "100%",
      }}
    />

    <App />
  </StrictMode>
);

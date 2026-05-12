jsx
  
import { useState } from "react";

export default function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#09090d", 
      color: "#f0ede8",
      fontFamily: "Georgia, serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12,
    }}>
      <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 4 }}>SPREAD THERAPY</div>
      <div style={{ fontSize: 28 }}>Trade with discipline. Not emotion.</div>
      <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>spreadtherapy.com — launching soon</div>
    </div>
  );
}

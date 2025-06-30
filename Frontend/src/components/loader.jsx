import React from "react";

const Loader = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <div className="loader" style={{
      margin: "0 auto",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #3498db",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite"
    }} />
    <div style={{ marginTop: "1rem", color: "#3498db" }}>Loading...</div>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);

export default Loader;

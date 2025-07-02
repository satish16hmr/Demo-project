import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store.js";
import router from "./router/index.jsx";
import { AuthProvider } from "./context/auth.context.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
          <AuthProvider>
           <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./lib/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

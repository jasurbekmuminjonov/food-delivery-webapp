import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { store } from "./context/store.js";
import { BrowserRouter } from "react-router-dom";
import "./assets/style.css";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

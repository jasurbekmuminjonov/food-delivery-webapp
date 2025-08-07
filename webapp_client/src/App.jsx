import { useEffect } from "react";
import Layout from "./layout/Layout";
// import { useLocation } from "react-router-dom";
const App = () => {
  useEffect(() => {
    if (window.Telegram.WebApp) {
      const telegramId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
      if (telegramId) {
        localStorage.setItem("telegram_id", telegramId);
        console.log("Telegram ID:", telegramId);
      }
    }
  }, []);
  return <Layout />;
};

export default App;

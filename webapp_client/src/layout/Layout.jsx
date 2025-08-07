import { useEffect } from "react";

const Layout = () => {
  let telegramId;
  useEffect(() => {
    if (window.Telegram.WebApp) {
      telegramId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
      if (telegramId) {
        localStorage.setItem("telegram_id", telegramId);
        console.log("Telegram ID:", telegramId);
      }
    }
  }, []);
  return (
    <div className="layout">
      <p>{telegramId}</p>
    </div>
  );
};

export default Layout;

import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const start = queryParams.get("start");
  return (
    <div className="layout">
      <p>{localStorage.getItem("telegram_id")}</p>
      <p>{start}</p>
      <p>{window.Telegram && window.Telegram.WebApp.initDataUnsafe.user.id}</p>
    </div>
  );
};

export default Layout;

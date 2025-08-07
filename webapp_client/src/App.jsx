import Layout from "./layout/Layout";
import { useLocation } from "react-router-dom";
const App = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const start = queryParams.get("start");
  if (!localStorage.getItem("telegram_id") && start) {
    localStorage.setItem("telegram_id", start);
  }
  return <Layout />;
};

export default App;

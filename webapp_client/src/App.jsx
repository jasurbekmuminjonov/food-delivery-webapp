import Layout from "./layout/Layout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket";
import { useGetOrdersQuery } from "./context/services/order.service";

const App = () => {
  const location = useLocation();
  const { refetch } = useGetOrdersQuery();

  const queryParams = new URLSearchParams(location.search);
  useEffect(() => {
    socket.on("preparing_completed", () => {
      refetch();
    });

    return () => {
      socket.off("preparing_completed");
    };
  }, [refetch]);

  const start = queryParams.get("start");
  if (!localStorage.getItem("telegram_id") && start) {
    localStorage.setItem("telegram_id", start);
  }
  return <Layout />;
};

export default App;

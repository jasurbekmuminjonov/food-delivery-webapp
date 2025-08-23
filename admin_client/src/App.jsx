import { useEffect, useRef } from "react";
import { useGetOrderQuery } from "./context/services/order.service";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import socket from "./socket";
import { notification } from "antd";
import orderSound from "./assets/order_sound.mp3";
import deliveringSound from "./assets/delivering_sound.mp3";
import cancelingSound from "./assets/canceling_sound.mp3";
const App = () => {
  const { refetch } = useGetOrderQuery();
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(orderSound);

    socket.on("new_order", (order) => {
      refetch();

      notification.open({
        message: `#${order._id.slice(0, -6).toUpperCase()} buyurtma tushdi`,
        placement: "topRight",
        duration: 0,
      });

      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Audio autoplay bloklandi:", err.message);
        });
      }
    });
    socket.on("order_canceled", (order) => {
      refetch();

      notification.open({
        message: `#${order._id
          .slice(0, -6)
          .toUpperCase()} buyurtma bekor qilindi`,
        placement: "topRight",
        duration: 0,
      });

      const cancelingAudio = new Audio(cancelingSound);
      cancelingAudio.play().catch((err) => {
        console.log("Audio autoplay bloklandi:", err.message);
      });
    });

    socket.on("complete_delivering", (order) => {
      refetch();

      notification.open({
        message: `#${order._id
          .slice(0, -6)
          .toUpperCase()} buyurtma yetkazib berildi`,
        placement: "topRight",
        duration: 0,
      });

      const completeAudio = new Audio(deliveringSound);
      completeAudio.play().catch((err) => {
        console.log("Audio autoplay bloklandi:", err.message);
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("complete_delivering");
      socket.off("order_canceled");
    };
  }, [refetch]);

  const token = localStorage.getItem("token");
  return token ? <Layout /> : <Login />;
};

export default App;

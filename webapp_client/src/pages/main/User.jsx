import { useEffect } from "react";
import { useLazyGetUserByQueryQuery } from "../../context/services/user.service";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Divider } from "antd";

const User = () => {
  const [getUser, { data: userData = {} }] = useLazyGetUserByQueryQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getUser(localStorage.getItem("telegram_id"));
  }, []);
  return (
    <div className="basket-wrapper">
      <div className="products-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <h3>Foydalanuvchi hisobi</h3>
        <button onClick={() => navigate("/search")}>
          <IoSearchOutline />
        </button>
      </div>
      <div className="progress" style={{ height: "auto" }}>
        <div>
          <strong style={{ fontSize: "16px", fontWeight: "600" }}>Ism:</strong>
          <p style={{ fontSize: "14px" }}>{userData.user_name}</p>
        </div>
        <Divider style={{ margin: "5px" }} />
        <div>
          <strong style={{ fontSize: "16px", fontWeight: "600" }}>
            Telefon raqam:
          </strong>
          <p style={{ fontSize: "14px" }}>{userData.user_phone}</p>
        </div>
        <Divider style={{ margin: "5px" }} />
        <div>
          <strong style={{ fontSize: "16px", fontWeight: "600" }}>Jins:</strong>
          <p style={{ fontSize: "14px" }}>
            {userData.user_gender === "male" ? "Erkak" : "Ayol"}
          </p>
        </div>
        <Divider style={{ margin: "5px" }} />
        <div>
          <strong style={{ fontSize: "16px", fontWeight: "600" }}>
            Telegram ID:
          </strong>
          <p style={{ fontSize: "14px" }}>{userData.telegram_id}</p>
        </div>
      </div>
    </div>
  );
};

export default User;

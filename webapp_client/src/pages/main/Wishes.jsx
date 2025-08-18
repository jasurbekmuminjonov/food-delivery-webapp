import { useState } from "react";
import Card from "../../components/Card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import Empty from "../../components/Empty";

const Wishes = () => {
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];

  const navigate = useNavigate();
  return (
    <div className="extra-products">
      <div className="products-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <h3>Sevimlilar</h3>
        <button onClick={() => navigate("/search")}>
          <IoSearchOutline />
        </button>
      </div>
      {wishes.length > 0 ? (
        <div className="extra-products-container">
          {wishes.map((p) => (
            <Card key={p._id} item={p} basket={basket} setBasket={setBasket} />
          ))}
        </div>
      ) : (
        <Empty text="Bu yerda hali hech narsa yo'q. Tovar kartasidagi yurakchaga bosing va u bu yerga tushadi" />
      )}
    </div>
  );
};

export default Wishes;

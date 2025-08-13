import { useGetProductsQuery } from "../../context/services/product.service";
import { useState } from "react";
import Card from "../../components/Card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import Empty from "../../components/Empty";

const Wishes = () => {
  const { data: products = [] } = useGetProductsQuery();
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const [wishes, setWishes] = useState(
    JSON.parse(localStorage.getItem("wishes")) || []
  );

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
      {products.filter((i) => wishes.includes(i._id)).length > 0 ? (
        <div className="extra-products-container">
          {products
            .filter((i) => wishes.includes(i._id))
            .map((p) => (
              <Card item={p} basket={basket} setBasket={setBasket} />
            ))}
        </div>
      ) : (
        <Empty text="Bu yerda hali hech narsa yo'q. Tovar kartasidagi yurakchaga bosing va u bu yerga tushadi" />
      )}
    </div>
  );
};

export default Wishes;

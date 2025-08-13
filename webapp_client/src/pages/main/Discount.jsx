import { useGetProductsQuery } from "../../context/services/product.service";
import { useState } from "react";
import Card from "../../components/Card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

const Discount = () => {
  const { data: products = [] } = useGetProductsQuery();
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const navigate = useNavigate();
  return (
    <div className="extra-products">
      <div className="products-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <h3>Chegirmalar</h3>
        <button onClick={() => navigate("/search")}>
          <IoSearchOutline />
        </button>
      </div>
      <div className="extra-products-container">
        {products
          .filter((i) => i.discount_log.find((d) => d.status === "active"))
          .map((p) => (
            <Card item={p} basket={basket} setBasket={setBasket} />
          ))}
      </div>
    </div>
  );
};

export default Discount;

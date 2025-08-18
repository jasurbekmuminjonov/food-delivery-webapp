import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useLazyGetProductsByQueryQuery } from "../../context/services/product.service";

const Discount = () => {
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );

  const [getDiscountProducts, { data: discountedProducts = [] }] =
    useLazyGetProductsByQueryQuery();
  useEffect(() => {
    getDiscountProducts({ discount: "true" });
  }, [getDiscountProducts]);
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
        {discountedProducts.map((p) => (
          <Card key={p._id} item={p} basket={basket} setBasket={setBasket} />
        ))}
      </div>
    </div>
  );
};

export default Discount;

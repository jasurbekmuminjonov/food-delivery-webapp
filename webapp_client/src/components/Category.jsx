import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../context/services/category.service";
import { useLazyGetProductsByQueryQuery } from "../context/services/product.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import Card from "./Card";
import EmptyCard from "./EmptyCard";
import { MdDeliveryDining } from "react-icons/md";
import { BsBasket3 } from "react-icons/bs";
import { useGetOrdersQuery } from "../context/services/order.service";
const Category = () => {
  const { category } = useParams();
  if (!category) {
    window.location.href = "/";
  }
  const [getCategoryProducts, { data: categoryProducts = [] }] =
    useLazyGetProductsByQueryQuery();
  const { data: orders = [] } = useGetOrdersQuery();

  useEffect(() => {
    getCategoryProducts({ category_id: category });
  }, [getCategoryProducts, category]);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState({});
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!categoryProducts?.length) return;

    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [categoryProducts, location.hash]);

  useEffect(() => {
    setSelectedCategory(categories.find((c) => c._id === category));
  }, [category, categories, categoryProducts]);

  return (
    <div
      className="extra-products"
      style={{ paddingBlockStart: "50px", paddingBlockEnd: "60px" }}
    >
      <div
        className="products-header-wrapper"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          top: "0",
          left: "0",
          background: "#fff",
          zIndex: "3",
        }}
      >
        <div
          style={{
            position: "static",
            width: "430px",
            height: "50px",
            paddingBlock: "0",
            paddingInline: "5px",
          }}
          className="products-header"
        >
          <button onClick={() => navigate("/")}>
            <FaArrowLeftLong />
          </button>
          <h3>{selectedCategory?.category}</h3>
          <button onClick={() => navigate("/search")}>
            <IoSearchOutline />
          </button>
        </div>
      </div>
      <div className="payment-fixed-wrapper">
        <div className="basket-sticky">
          <div>
            <button>
              <BsBasket3 size={20} />
              <span>{basket.length}</span>
            </button>
            {orders.filter(
              (o) =>
                o.order_status === "preparing" ||
                o.order_status === "delivering"
            ).length > 0 && (
              <button onClick={() => navigate("/order")}>
                <MdDeliveryDining size={30} />
              </button>
            )}
          </div>
          <button onClick={() => navigate("/basket")}>
            {basket.length < 1
              ? "Savat bo'sh"
              : Number(
                  basket
                    .reduce((acc, item) => {
                      const product = item.product;

                      if (!product) return acc;

                      const discount = product.discount_log?.find(
                        (d) => d.status === "active"
                      );

                      let price = product.selling_price;

                      if (discount) {
                        price = price - (price / 100) * discount.percent;
                      }

                      return acc + price * item.quantity;
                    }, 0)
                    .toFixed()
                ).toLocaleString("ru-RU") + " so'm"}
          </button>
        </div>
      </div>
      {selectedCategory?.subcategories?.map((item) => (
        <>
          <p style={{ fontWeight: "600" }} key={item._id} id={item._id}>
            {item.subcategory}
          </p>
          <div className="extra-products-container">
            {categoryProducts?.filter((i) => i.subcategory._id === item._id)
              .length > 0 ? (
              categoryProducts
                ?.filter((i) => i.subcategory._id === item._id)
                ?.map((p) => (
                  <Card
                    key={p._id}
                    item={p}
                    basket={basket}
                    setBasket={setBasket}
                  />
                ))
            ) : (
              <EmptyCard />
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default Category;

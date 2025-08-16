import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../context/services/category.service";
import { useGetProductsQuery } from "../context/services/product.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import Card from "./Card";
import emptyShelf from "../assets/empty_shelf.avif";
const Category = () => {
  const { category } = useParams();
  if (!category) {
    window.location.href = "/";
  }
  const { data: products = [] } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState({});
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  });

  useEffect(() => {
    setSelectedCategory(categories.find((c) => c._id === category));
  }, [category, products, categories]);

  return (
    <div className="extra-products" style={{ paddingBlockStart: "50px" }}>
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
          <h3>{selectedCategory.category}</h3>
          <button onClick={() => navigate("/search")}>
            <IoSearchOutline />
          </button>
        </div>
      </div>

      {selectedCategory?.subcategories?.map((item) => (
        <>
          <p style={{ fontWeight: "600" }} id={item._id}>
            {item.subcategory}
          </p>
          <div className="extra-products-container">
            {products?.filter((i) => i.subcategory._id === item._id).length >
            0 ? (
              products
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
              <div className="card">
                <div className="card-image">
                  <img src={emptyShelf} alt="" />
                </div>
                <div className="card-title">
                  <h5 style={{ textAlign: "center" }}>
                    Bu turkumda mahsulotlar yo'q
                  </h5>
                </div>
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default Category;

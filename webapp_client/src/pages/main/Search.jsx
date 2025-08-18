import { FaArrowLeft } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../context/services/category.service";
import { Collapse, Space } from "antd";
import { useLazyGetProductsByNameQueryQuery } from "../../context/services/product.service";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import SearchLoading from "../../components/SearchLoading";
import { categories as categoryIcons } from "../../constants/categories";

const Search = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoryLoading } =
    useGetCategoriesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [getDiscountProducts, { data: discountedProducts = [], isLoading }] =
    useLazyGetProductsByNameQueryQuery();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    getDiscountProducts({ q: debouncedQuery });
  }, [debouncedQuery, getDiscountProducts]);

  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );

  const collapseItems = categories.map((cat) => {
    const matched = categoryIcons.find((c) => c.category_id === cat._id);

    return {
      key: cat._id,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {matched?.category_icon && (
            <img
              src={matched.category_icon}
              alt={cat.category}
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
          )}
          <span>{cat.category}</span>
        </div>
      ),
      children: (
        <Space direction="vertical">
          {cat.subcategories.map((sub) => (
            <li
              key={sub._id}
              style={{
                padding: "4px 0",
                paddingLeft: "24px",
                cursor: "pointer",
                listStyle: "none",
              }}
              onClick={() => navigate(`/category/${cat._id}#${sub._id}`)}
            >
              {sub.subcategory}
            </li>
          ))}
        </Space>
      ),
    };
  });

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="search">
          <IoSearch size={20} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            type="search"
            placeholder="Do'kondan topish"
          />
        </div>
      </div>
      {isLoading || categoryLoading ? (
        <SearchLoading />
      ) : discountedProducts.length > 0 ? (
        <div className="extra-products-container">
          {discountedProducts.map((p) => (
            <Card key={p._id} item={p} basket={basket} setBasket={setBasket} />
          ))}
        </div>
      ) : (
        <div className="category-list" style={{ marginTop: "10px" }}>
          <Collapse
            style={{ border: "0", background: "transparent" }}
            accordion
            items={collapseItems}
          />
        </div>
      )}
    </div>
  );
};

export default Search;

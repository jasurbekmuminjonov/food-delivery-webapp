import { FaArrowLeft } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../context/services/category.service";
import { Collapse, Space } from "antd";
import { useGetProductsQuery } from "../../context/services/product.service";
import { useEffect, useState } from "react";
import Card from "../../components/Card";

const Search = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: products = [] } = useGetProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  useEffect(() => {
    const filtered =
      searchQuery.length >= 2
        ? products.filter((p) => {
            const words = p.product_name
              .toLowerCase()
              .split(/[\s\-–—.,;:!?"“”‘’()[\]{}\\\/\n\r*+=@\$%]+/);
            return words.includes(searchQuery.toLowerCase());
          })
        : [];

    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const collapseItems = categories.map((cat) => ({
    key: cat._id,
    label: cat.category,
    children: (
      <Space direction="vertical">
        {cat.subcategories.map((sub) => (
          <li
            key={sub._id}
            style={{ padding: "4px 0", paddingLeft: "24px", cursor: "pointer" }}
          >
            {sub.subcategory}
          </li>
        ))}
      </Space>
    ),
  }));

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
      {filteredProducts.length > 0 ? (
        <div className="extra-products-container">
          {filteredProducts.map((p) => (
            <Card item={p} basket={basket} setBasket={setBasket} />
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

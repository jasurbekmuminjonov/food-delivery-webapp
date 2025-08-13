import { useNavigate, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../../context/services/product.service";
import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Collapse, Space } from "antd";
import { useState } from "react";
import Card from "../../components/Card";
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate("/");
  if (!id) {
    window.location.href = "/";
  }
  const { data: products = [] } = useGetProductsQuery();
  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const [wishes, setWishes] = useState(
    JSON.parse(localStorage.getItem("wishes")) || []
  );
  const item = products?.find((p) => p._id === id) || {};
  const discount = item?.discount_log?.find((d) => d.status === "active");
  const handleAddToBasket = () => {
    const updatedBasket = [
      ...basket,
      {
        product_id: item?._id,
        quantity: item?.starting_quantity,
      },
    ];
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };
  const handleIncrease = () => {
    const updatedBasket = basket.map((p) => {
      if (p.product_id === item?._id) {
        return {
          ...p,
          quantity: p.quantity + item?.starting_quantity,
        };
      }
      return p;
    });
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleAddToWishes = () => {
    const updatedWishes = [...wishes, item._id];
    setWishes(updatedWishes);
    localStorage.setItem("wishes", JSON.stringify(updatedWishes));
  };
  const handleRemoveFromWishes = () => {
    const updatedWishes = wishes.filter((w) => w !== item._id);
    setWishes(updatedWishes);
    localStorage.setItem("wishes", JSON.stringify(updatedWishes));
  };

  const handleDecrease = () => {
    const current = basket?.find((p) => p.product_id === item?._id);
    if (!current) return;
    if (current.quantity === item?.starting_quantity) {
      const updatedBasket = basket.filter((p) => p.product_id !== item?._id);
      setBasket(updatedBasket);
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
    } else {
      const updatedBasket = basket.map((p) => {
        if (p.product_id === item?._id) {
          return {
            ...p,
            quantity: p.quantity - item?.starting_quantity,
          };
        }
        return p;
      });
      setBasket(updatedBasket);
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
    }
  };

  return (
    <div className="product-wrapper">
      <div className="product-price">
        {discount ? (
          <Space
            direction="vertical"
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
            }}
          >
            <b className="discount-b">
              {Number(
                (
                  item?.selling_price -
                  (item?.selling_price / 100) * discount?.percent
                ).toFixed()
              ).toLocaleString("ru-RU")}{" "}
              so'm
            </b>
            <span className="discount-span">
              {item?.selling_price?.toLocaleString("ru-RU")} so'm
            </span>
          </Space>
        ) : (
          <p>{item?.selling_price?.toLocaleString("ru-RU")} so'm</p>
        )}
        {basket?.find((p) => p.product_id === item?._id) ? (
          <div className="product-counter">
            <button onClick={handleDecrease}>
              <FaMinus />
            </button>
            <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {basket?.find((p) => p.product_id === item?._id)?.quantity}{" "}
              {item.unit !== "dona" && (
                <span style={{ fontSize: "13px" }}>{item.unit}</span>
              )}
            </p>
            <button onClick={handleIncrease}>
              <FaPlus />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToBasket}
            disabled={item.status === "not_available"}
          >
            {item.status === "not_available" ? "Mavjud emas" : "Savatga"}
          </button>
        )}
      </div>
      <div className="product-image">
        <img src={item?.image_log?.find((i) => i.isMain).image_url} alt="" />
        <div className="actions">
          <button>
            {wishes.find((w) => w === item._id) ? (
              <FaHeart color="red" onClick={handleRemoveFromWishes} />
            ) : (
              <FaRegHeart onClick={handleAddToWishes} />
            )}
          </button>
          <button onClick={() => navigate(-1)}>
            <FaX />
          </button>
        </div>
      </div>
      <div className="product-body">
        <h2>{item?.product_name}</h2>
        <p>{item?.unit_description}</p>
        <span>{item?.product_description}</span>
        <Collapse
          style={{
            border: "0",
            background: "transparent",
            borderTop: "1px solid #d9d9d9",
          }}
          accordion
          items={[
            {
              key: "1",
              label: "Tovar haqida batafsil",
              children: (
                <Space direction="vertical">
                  <label>
                    <strong>Tovar tarkibi</strong>
                    <br />
                    <span>{item?.product_ingredients}</span>
                  </label>
                  <label>
                    <strong>Yaroqlilik muddati</strong>
                    <br />
                    <span>{item?.expiration} k.</span>
                  </label>
                </Space>
              ),
            },
          ]}
        />
      </div>
      <div className="extra-products">
        <h3>Yana nimadir olasizmi?</h3>
        <div className="extra-products-container">
          {products
            .filter(
              (i) =>
                i.category._id === item.category._id &&
                i.status !== "not_available" &&
                i._id !== item._id
            )
            .map((p) => (
              <Card item={p} basket={basket} setBasket={setBasket} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Product;

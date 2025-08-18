import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Card = ({ item, basket, setBasket }) => {
  const activeDiscount = item.discount_log.find((i) => i.status === "active");
  const mainImage = item.image_log.find((i) => i.isMain)?.image_url;
  const navigate = useNavigate();
  const handleAddToBasket = () => {
    const updatedBasket = [
      ...basket,
      {
        product_id: item._id,
        product:item,
        quantity: item.starting_quantity,
      },
    ];
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleIncrease = () => {
    const updatedBasket = basket.map((p) => {
      if (p.product_id === item._id) {
        return {
          ...p,
          quantity: Number((p.quantity + item.starting_quantity)?.toFixed(2)),
        };
      }
      return p;
    });
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleDecrease = () => {
    const current = basket.find((p) => p.product_id === item._id);
    if (!current) return;
    if (current.quantity <= item.starting_quantity) {
      const updatedBasket = basket.filter((p) => p.product_id !== item._id);
      setBasket(updatedBasket);
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
    } else {
      const updatedBasket = basket.map((p) => {
        if (p.product_id === item._id) {
          return {
            ...p,
            quantity: Number((p.quantity - item.starting_quantity)?.toFixed(2)),
          };
        }
        return p;
      });
      setBasket(updatedBasket);
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
    }
  };

  return (
    <div className="card">
      <div
        className="card-image"
        onClick={() => navigate(`/product/${item._id}`)}
      >
        <img src={mainImage} alt="" />
        <div className="tags">
          {activeDiscount && (
            <p style={{ background: "red" }}>-{activeDiscount.percent}%</p>
          )}
          {item.additionals.map((i, idx) => (
            <p key={idx} style={{ background: "#1677FF" }}>
              {i}
            </p>
          ))}
        </div>
      </div>

      <div className="card-title">
        {activeDiscount ? (
          <>
            <b onClick={() => navigate(`/product/${item._id}`)}>
              {Number(
                (
                  item.selling_price -
                  (item.selling_price / 100) * activeDiscount?.percent
                ).toFixed()
              ).toLocaleString("ru-RU")}{" "}
              so'm
            </b>
            <span onClick={() => navigate(`/product/${item._id}`)}>
              {item.selling_price?.toLocaleString("ru-RU")} so'm
            </span>
          </>
        ) : (
          <h4
            style={{ fontWeight: "500" }}
            onClick={() => navigate(`/product/${item._id}`)}
          >
            {item.selling_price?.toLocaleString("ru-RU")} so'm
          </h4>
        )}
        <p onClick={() => navigate(`/product/${item._id}`)}>
          {item.product_name}
        </p>
        <h5 onClick={() => navigate(`/product/${item._id}`)}>
          {item.unit_description}
        </h5>

        {basket?.find((p) => p.product_id === item._id) ? (
          <div className="counter">
            <button onClick={handleDecrease}>
              <FaMinus />
            </button>
            <p>
              {basket.find((p) => p.product_id === item._id)?.quantity}{" "}
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
    </div>
  );
};

export default Card;

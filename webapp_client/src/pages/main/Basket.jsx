import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useLazyGetUserByQueryQuery } from "../../context/services/user.service";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import cashImg from "../../assets/cash.png";
import {
  useCreateOrderMutation,
  useGetOrdersQuery,
} from "../../context/services/order.service";
import Empty from "../../components/Empty";
const Basket = () => {
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const { data: orders = [] } = useGetOrdersQuery();

  const activeOrder = useMemo(() => {
    const active = orders.find(
      (o) => o.order_status === "preparing" || o.order_status === "delivering"
    );
    return active;
  }, [orders]);

  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [createOrder] = useCreateOrderMutation();
  const [getUser, { data: userData = {} }] = useLazyGetUserByQueryQuery();
  const [selectedCourier, setSelectedCourier] = useState("male");

  useEffect(() => {
    getUser(localStorage.getItem("telegram_id"));
  }, [getUser]);
  useEffect(() => {
    setSelectedCourier(userData.user_gender);
  }, [userData]);

  useEffect(() => {
    const total = basket.reduce((acc, item) => {
      const product = item.product;
      if (!product) return acc;

      const discount = product.discount_log?.find((d) => d.status === "active");
      let price = product.selling_price;

      if (discount) {
        price = price - (price / 100) * discount.percent;
      }

      return acc + price * item.quantity;
    }, 0);

    setTotalPrice(total);
  }, [basket]);
  const handleIncrease = (item) => {
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

  const handleDecrease = (item) => {
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

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setConfirmModal(false);
      setClosing(false);
    }, 200);
  };

  async function handleSubmit() {
    try {
      const newBasket = basket.map((p) => {
        const product = p.product;
        const activeDiscount = product.discount_log.find(
          (d) => d.status === "active"
        );

        let sale_price;
        if (activeDiscount) {
          sale_price = Number(
            (
              product.selling_price -
              (product.selling_price / 100) * activeDiscount.percent
            ).toFixed()
          );
        } else {
          sale_price = product.selling_price;
        }

        return {
          ...p,
          sale_price: Number(sale_price?.toFixed()),
        };
      });
      await createOrder({
        products: newBasket,
        delivery_fee: totalPrice >= 100000 ? 0 : 5000,
        requested_courier: selectedCourier,
        order_address: {
          lat: userData.default_address.lat,
          long: userData.default_address.long,
        },
        bonus:
          orders.length === 0 &&
          newBasket.reduce((acc, p) => acc + p.quantity * p.sale_price, 0) >=
            250000,
      });
      localStorage.removeItem("basket");
      setBasket([]);
      navigate("/success");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="basket-wrapper">
      {confirmModal && (
        <div className="modal-container" onClick={closeModal}>
          <div
            style={{ height: "210px" }}
            className={`aksiya-modal ${closing ? "hide" : ""}`}
          >
            <div className="modal-body">
              {userData.isBlocked ? (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                    Sizning hisobingiz bloklangan
                  </h3>
                  <p>
                    Hisobingiz qoidalarga zid faoliyat tufayli bloklandi.
                    Batafsil ma'lumot uchun biz bilan bog'laning
                  </p>

                  <button onClick={closeModal}>Ok</button>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                    Buyurtma berishga ishonchingiz komilmi?
                  </h3>
                  <p>
                    Agarda buyurtmani bergach, bekor qilsangiz hisobingiz
                    bloklanishi mumkin
                  </p>
                  <br />
                  <div>
                    <button onClick={closeModal}>Yo'q</button>
                    <button onClick={handleSubmit}>Albatta</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="basket-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <div className="basket-actions">
          <button onClick={() => navigate("/search")}>
            <IoSearchOutline size={18} />
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("basket");
              setBasket([]);
            }}
          >
            <AiOutlineDelete size={18} />
          </button>
        </div>
      </div>
      <h3>Savat</h3>
      {basket.length > 0 ? (
        <>
          <div className="progress">
            <strong>
              Yetkazish {totalPrice >= 100000 ? "0" : "5 000"} so'm
            </strong>
            <p>
              {totalPrice >= 100000
                ? "Bepul yetkazish"
                : "Bepul yetkazishgacha " +
                  Number((100000 - totalPrice)?.toFixed()).toLocaleString(
                    "ru-RU"
                  ) +
                  " so'm"}
            </p>
            <progress value={totalPrice / 1000} max={100} />
          </div>
          <div className="basket-products">
            {basket.map((p) => (
              <div key={p.product_id} className="basket-product">
                <img
                  src={p.product.image_log.find((i) => i.isMain).image_url}
                  alt=""
                />
                <div className="basket-title">
                  <p>{p.product.product_name}</p>
                  {p.product.discount_log.find((d) => d.status === "active") ? (
                    <>
                      <b>
                        {Number(
                          (
                            p.product.selling_price -
                            (p.product.selling_price / 100) *
                              p.product.discount_log.find(
                                (d) => d.status === "active"
                              )?.percent
                          ).toFixed()
                        ).toLocaleString("ru-RU")}{" "}
                        so'm
                      </b>
                      <span>
                        {p.product.selling_price?.toLocaleString("ru-RU")} so'm
                      </span>
                    </>
                  ) : (
                    <h4 style={{ fontWeight: "500" }}>
                      {p.product.selling_price?.toLocaleString("ru-RU")} so'm
                    </h4>
                  )}

                  <h5>{p.product.unit_description}</h5>
                </div>
                <div className="counter">
                  <button onClick={() => handleDecrease(p.product)}>
                    <FiMinus />
                  </button>
                  <p>
                    {p.quantity}{" "}
                    {p.product.unit !== "dona" && (
                      <span style={{ fontSize: "13px" }}>{p.product.unit}</span>
                    )}
                  </p>

                  <button onClick={() => handleIncrease(p.product)}>
                    <FiPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-fixed-wrapper">
            <div className="payment-fixed">
              <button
                disabled={activeOrder}
                onClick={() => setConfirmModal(true)}
              >
                {activeOrder ? (
                  <p>Birinchi aktiv buyurtmangizni qabul qiling</p>
                ) : (
                  <>
                    <p>
                      {totalPrice >= 100000
                        ? Number(totalPrice?.toFixed())?.toLocaleString("ru-RU")
                        : Number(
                            (totalPrice + 5000)?.toFixed()
                          )?.toLocaleString("ru-RU")}{" "}
                      so'm
                    </p>
                    <p>Buyurtma berish</p>
                    <FaCheck />
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="progress">
            <strong>To'lov usuli</strong>
            <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img width="30px" src={cashImg} alt="" /> Naqd bilan kuryerga
            </p>
          </div>
          <div className="progress" style={{ height: "auto" }}>
            <p>
              Noqulaylik tug'dirmaslik uchun qanday kuryer yuborishimizni
              istaysiz?
            </p>
            <div>
              <button
                style={
                  selectedCourier === "male"
                    ? { background: "#519872", color: "#fff" }
                    : {
                        background: "#fff",
                        color: "#519872",
                        border: "1px solid #519872",
                      }
                }
                onClick={() => setSelectedCourier("male")}
              >
                Erkak
              </button>
              <button
                style={
                  selectedCourier === "female"
                    ? { background: "#519872", color: "#fff" }
                    : {
                        background: "#fff",
                        color: "#519872",
                        border: "1px solid #519872",
                      }
                }
                onClick={() => setSelectedCourier("female")}
              >
                Ayol
              </button>
            </div>
          </div>
          <div className="progress">
            <strong>Yetkazish manzili</strong>
            <p
              style={{
                borderRadius: "15px",
                background: "#F8F7F5",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40px",
                cursor: "pointer",
              }}
              onClick={() => {
                !userData?.default_address?.lat ||
                !userData?.default_address?.long
                  ? navigate("/places")
                  : navigate(
                      `/map?lat=${userData?.default_address?.lat}&long=${userData?.default_address?.long}`
                    );
              }}
            >
              {userData?.default_address?.lat
                ? "Tanlangan manzil"
                : "Manzilni tanlash +"}
            </p>
          </div>
        </>
      ) : (
        <Empty
          text={
            'Hali hech qanday mahsulotni savatga solmadingiz. Tovar kartasidagi "Savatga" tugmasi bosing, u bu yerga tushadi'
          }
        />
      )}
    </div>
  );
};

export default Basket;

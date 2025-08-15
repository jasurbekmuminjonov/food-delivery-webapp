import {
  FaChevronRight,
  FaPercent,
  FaQrcode,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
import { IoLocationSharp, IoSearch } from "react-icons/io5";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import gift from "../../assets/gift.png";
import { useGetProductsQuery } from "../../context/services/product.service";
import { useEffect, useMemo, useRef, useState } from "react";
import vegetables from "../../assets/images/vegetables.png";
import fruits from "../../assets/images/fruits.png";
import cheese from "../../assets/images/cheese.png";
import egg from "../../assets/images/egg.png";
import milk from "../../assets/images/milk.png";
import qatiq from "../../assets/images/qatiq.png";
import tvorojok from "../../assets/images/tvorojok.png";
import yogurt from "../../assets/images/yogurt.png";
import aksiya from "../../assets/aksiya.png";
import gift_ios from "../../assets/gift_ios.png";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { useLazyGetUserByQueryQuery } from "../../context/services/user.service";
import { BsBasket3 } from "react-icons/bs";
import { useGetOrdersQuery } from "../../context/services/order.service";
import { MdDeliveryDining } from "react-icons/md";
const Home = () => {
  const { data: products = [] } = useGetProductsQuery();
  const [aksiyaModal, setAksiyaModal] = useState(false);
  const { data: orders = [] } = useGetOrdersQuery();
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();
  const [getUser, { data: userData = {} }] = useLazyGetUserByQueryQuery();

  useEffect(() => {
    getUser(localStorage.getItem("telegram_id"));
  }, []);

  const [basket, setBasket] = useState(
    JSON.parse(localStorage.getItem("basket")) || []
  );
  const searchRef = useRef(null);

  const [showSticky, setShowSticky] = useState(false);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setAksiyaModal(false);
      setClosing(false);
    }, 200);
  };

  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowSticky(entry.intersectionRatio === 0);
      },
      {
        root: null,
        threshold: [0, 1],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const discountedProducts = useMemo(() => {
    const discounted = products.filter((item) =>
      item.discount_log.some((d) => d.status === "active")
    );
    const sorted = discounted.sort(
      (a, b) =>
        b.discount_log.find((d) => d.status === "active")?.percent -
        a.discount_log.find((d) => d.status === "active")?.percent
    );
    return sorted;
  }, [products]);

  return (
    <div className="home">
      <div
        style={
          showSticky
            ? { transform: "translateY(0px)" }
            : { transform: "translateY(-62px)" }
        }
        className="search-sticky-wrapper"
      >
        <div className="search-sticky">
          <div className="search" onClick={() => navigate("/search")}>
            <IoSearch size={20} />
            <p>Do'kondan topish</p>
          </div>
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
                      const product = products.find(
                        (i) => i._id === item.product_id
                      );

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
      {aksiyaModal && (
        <div className="modal-container" onClick={closeModal}>
          <div className={`aksiya-modal ${closing ? "hide" : ""}`}>
            <div className="modal-image">
              <img src={aksiya} alt="" />
            </div>
            <div className="modal-body">
              <h3>Birinchi buyurtma uchun sovg'a</h3>
              <p>
                Birinchi buyurtma uchun qo'shimcha sovg'ani qabul qilib oling.
                Aksiya barcha turdagi mahsulotlarga amal qiladi. Buyurtma
                summasi 250 000 so'mda oshishi kerak{" "}
                <img width="15px" height="15px" src={gift_ios} alt="" />
              </p>
              <br />
              <button onClick={closeModal}>Hohlayman!</button>
            </div>
          </div>
        </div>
      )}
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          !userData?.default_address?.lat || !userData?.default_address?.long
            ? navigate("/places")
            : navigate(
                `/map?lat=${userData?.default_address?.lat}&long=${userData?.default_address?.long}`
              );
        }}
      >
        <IoLocationSharp />
        {!userData?.default_address?.lat || !userData?.default_address?.long
          ? "Manzilni tanlash"
          : "Manzil tanlangan"}
        <FaChevronRight />
      </p>
      <div
        className="search"
        ref={searchRef}
        onClick={() => navigate("/search")}
      >
        <IoSearch size={20} />
        <p>Do'kondan topish</p>
      </div>
      <div className="container">
        <div onClick={() => navigate("/discount")}>
          <button>
            <FaPercent size={25} color="orange" />
          </button>
          <b>Chegirmalar</b>
        </div>
        <div onClick={() => navigate("/wishes")}>
          <button>
            <FaRegHeart size={25} color="red" />
          </button>
          <b>Saralangan</b>
        </div>
        <div>
          <button>
            <PiArrowCounterClockwiseBold size={25} color="blue" />
          </button>
          <b>Avvalgi haridlar</b>
        </div>
        <div>
          <button onClick={() => navigate("/user")}>
            <FaRegUser size={25} color="green" />
          </button>
          <b>Hisob</b>
        </div>
      </div>
      <div className="box" onClick={() => setAksiyaModal(true)}>
        <div>
          <img src={gift} alt="gift" />
          <p>
            Birinchi 250 000 so'mdan <br /> oshgan buyurtma uchun sovg'a
          </p>
        </div>
        <FaChevronRight />
      </div>
      <div className="discount">
        <div className="discount-head">
          <b>Chegirmadagi tovarlar</b>
          <button onClick={() => navigate("/discount")}>
            Hammasi <FaChevronRight />
          </button>
        </div>
        <div className="discount-body">
          {discountedProducts.length > 0 ? (
            discountedProducts
              ?.slice(0, 4)
              ?.map((item) => (
                <Card basket={basket} setBasket={setBasket} item={item} />
              ))
          ) : (
            <div className="card"></div>
          )}
        </div>
      </div>
      <div className="category-container">
        <b>Sabzavot va mevalar</b>
        <div className="category-box">
          <div className="category-card" style={{ background: "#C1E2D9" }}>
            <p>Sabzavot, qo'ziqorin, ko'katlar</p>
            <img src={vegetables} alt="vegetables" />
          </div>
          <div className="category-card" style={{ background: "#C1E2D9" }}>
            <p>Mevalar va rezavorlar</p>
            <img src={fruits} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Sut mahsulotlari</p>
        <div className="category-flex">
          <div className="category-item">
            <p>Sut va sariyog'</p>
            <img height="110" src={milk} alt="" />
          </div>
          <div className="category-item">
            <p>Tuxum</p>
            <img src={egg} alt="" />
          </div>
          <div className="category-item">
            <p>Tvorojok va siroklar</p>
            <img src={tvorojok} alt="" />
          </div>
          <div className="category-item">
            <p>Yogurt</p>
            <img height="110" src={yogurt} alt="" />
          </div>
          <div className="category-item">
            <p>Pishloq</p>
            <img src={cheese} alt="" />
          </div>
          <div className="category-item">
            <p>Qatiqli mahsulotlar</p>
            <img src={qatiq} alt="" />
          </div>
        </div>
      </div>
      <div className="discount">
        <div className="discount-head">
          <b>Sizga yoqadi</b>
          <button>
            Hammasi <FaChevronRight />
          </button>
        </div>
        <div className="discount-body">
          {discountedProducts?.slice(0, 4)?.map((item) => (
            <Card basket={basket} setBasket={setBasket} item={item} />
          ))}
        </div>
      </div>
      <div className="category-container">
        <b>Go'sht va parranda</b>
        <div className="category-box">
          <div className="category-card" style={{ background: "#EFC6E4" }}>
            <p>Go'sht va parranda</p>
            <img src={vegetables} alt="vegetables" />
          </div>
          <div className="category-card" style={{ background: "#EFC6E4" }}>
            <p>Kolbasa mahsulotlari</p>
            <img src={fruits} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Dengiz mahsulotlari</p>
        <div className="category-flex">
          <div className="category-item" style={{ background: "#D9E5F3" }}>
            <p>Baliq</p>
            <img height="110" src={milk} alt="" />
          </div>
          <div className="category-item" style={{ background: "#D9E5F3" }}>
            <p>Dengiz mahsulotlari</p>
            <img src={egg} alt="" />
          </div>
          <div className="category-item" style={{ background: "#D9E5F3" }}>
            <p>Baliqli gazaklar</p>
            <img src={tvorojok} alt="" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Suv va ichimliklar</p>
        <div className="category-penta">
          <div className="category-item">
            <p>Sut va sariyog'</p>
            <img height="110" src={milk} alt="" />
          </div>
          <div className="category-item">
            <p>Tuxum</p>
            <img src={egg} alt="" />
          </div>
          <div className="category-item">
            <p>Tvorojok va siroklar</p>
            <img src={tvorojok} alt="" />
          </div>
          <div className="category-item">
            <p>Yogurt</p>
            <img height="110" src={yogurt} alt="" />
          </div>
          <div className="category-item">
            <p>Pishloq</p>
            <img src={cheese} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

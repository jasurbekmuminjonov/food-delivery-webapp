import {
  FaChevronRight,
  FaPercent,
  FaQrcode,
  FaRegHeart,
} from "react-icons/fa";
import { IoLocationSharp, IoSearch } from "react-icons/io5";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import gift from "../../assets/gift.png";
import { useGetProductsQuery } from "../../context/services/product.service";
import { useMemo, useState } from "react";
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
import Skeleton from "react-loading-skeleton";
const Home = () => {
  const { data: products = [] } = useGetProductsQuery();
  const [aksiyaModal, setAksiyaModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setAksiyaModal(false);
      setClosing(false);
    }, 200);
  };
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
      <p onClick={() => navigate("/places")}>
        <IoLocationSharp />
        Manzilni tanlash
        <FaChevronRight />
      </p>
      <div className="search">
        <IoSearch size={20} />
        <p>Do'kondan topish</p>
      </div>
      <div className="container">
        <div>
          <button>
            <FaPercent size={25} color="orange" />
          </button>
          <b>Chegirmalar</b>
        </div>
        <div>
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
          <button>
            <FaQrcode size={25} color="green" />
          </button>
          <b>QR kod</b>
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
          <button>
            Hammasi <FaChevronRight />
          </button>
        </div>
        <div className="discount-body">
          {discountedProducts.length > 0 ? (
            discountedProducts?.slice(0, 4)?.map((item) => (
              <div className="card">
                <div className="card-image">
                  <img
                    src={item.image_log.find((i) => i.isMain)?.image_url}
                    alt=""
                  />
                </div>
                <div className="card-title">
                  <div className="tags">
                    <p
                      style={{
                        background: "red",
                      }}
                    >
                      -
                      {
                        item.discount_log.find((i) => i.status === "active")
                          ?.percent
                      }
                      %
                    </p>
                    {item.additionals.map((i) => (
                      <p
                        style={{
                          background: "#1677FF",
                        }}
                      >
                        {i}
                      </p>
                    ))}
                  </div>
                  <b>
                    {Number(
                      (
                        item.selling_price -
                        (item.selling_price / 100) *
                          item.discount_log.find((i) => i.status === "active")
                            .percent
                      ).toFixed()
                    ).toLocaleString("ru-RU")}{" "}
                    so'm
                  </b>
                  <span>
                    {item.selling_price?.toLocaleString("ru-RU")} so'm
                  </span>
                  <p>{item.product_name}</p>
                  <h5>{item.unit_description}</h5>
                  <button>Savatga</button>
                </div>
              </div>
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
      <div className="discount">
        <div className="discount-head">
          <b>Top sotilayotgan tovarlar</b>
          <button>
            Hammasi <FaChevronRight />
          </button>
        </div>
        <div className="discount-body">
          {discountedProducts?.slice(0, 4)?.map((item) => (
            <div className="card">
              <div className="card-image">
                <img
                  src={item.image_log.find((i) => i.isMain)?.image_url}
                  alt=""
                />
              </div>
              <div className="card-title">
                <div className="tags">
                  <p
                    style={{
                      background: "red",
                    }}
                  >
                    -
                    {
                      item.discount_log.find((i) => i.status === "active")
                        ?.percent
                    }
                    %
                  </p>
                  {item.additionals.map((i) => (
                    <p
                      style={{
                        background: "#1677FF",
                      }}
                    >
                      {i}
                    </p>
                  ))}
                </div>
                <b>
                  {Number(
                    (
                      item.selling_price -
                      (item.selling_price / 100) *
                        item.discount_log.find((i) => i.status === "active")
                          .percent
                    ).toFixed()
                  ).toLocaleString("ru-RU")}{" "}
                  so'm
                </b>
                <span>{item.selling_price?.toLocaleString("ru-RU")} so'm</span>
                <p>{item.product_name}</p>
                <h5>{item.unit_description}</h5>
                <button>Savatga</button>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default Home;

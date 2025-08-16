import {
  FaChevronRight,
  FaPercent,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
import { BsBasket3 } from "react-icons/bs";
import { MdDeliveryDining } from "react-icons/md";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import { IoLocationSharp, IoSearch } from "react-icons/io5";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetProductsQuery } from "../../context/services/product.service";
import { useLazyGetUserByQueryQuery } from "../../context/services/user.service";
import { useGetOrdersQuery } from "../../context/services/order.service";

import ayol_gigiyenasi from "../../assets/images/ayol_gigiyenasi.png";
import baliq_gazak from "../../assets/images/baliq_gazak.png";
import biskvit from "../../assets/images/biskvit.png";
import bolalar_aksesuar from "../../assets/images/bolalar_aksesuar.png";
import bolalar_gigiyenasi from "../../assets/images/bolalar_gigiyenasi.png";
import bolalar_ovqati from "../../assets/images/bolalar_ovqati.avif";
import cheese from "../../assets/images/cheese.png";
import choy from "../../assets/images/kofe_stakan.png";
import egg from "../../assets/images/egg.png";
import elektr from "../../assets/images/elektr.png";
import energetik from "../../assets/images/energetik.png";
import fish from "../../assets/images/baliq.png";
import fruits from "../../assets/images/fruits.png";
import gazlangan from "../../assets/images/gazlangan.png";
import goshtli_konserva from "../../assets/images/goshtli_konserva.png";
import hlebsty from "../../assets/images/hlebsty.png";
import idish_uchun from "../../assets/images/idish_uchun.png";
import itlar_uchun from "../../assets/images/itlar_uchun.png";
import kanselyariy from "../../assets/images/kanselyariy.png";
import kassada from "../../assets/images/kassada.webp";
import kir_uchun from "../../assets/images/kir_uchun.png";
import kofe from "../../assets/images/kofe.png";
import kolbasa from "../../assets/images/kolbasa.png";
import marmelad from "../../assets/images/marmelad.png";
import mayda_buyumlar from "../../assets/images/mayda_buyumlar.png";
import murabbo from "../../assets/images/murabbo.png";
import meat from "../../assets/images/meat.png";
import milk from "../../assets/images/milk.png";
import mushuklar_uchun from "../../assets/images/mushuklar_uchun.png";
import muzqaymoq from "../../assets/images/muzqaymoq.png";
import non from "../../assets/images/non.png";
import ogiz_uchun from "../../assets/images/ogiz_uchun.png";
import oshxona_uchun from "../../assets/images/oshxona_uchun.png";
import oyinchoq from "../../assets/images/oyinchoq.png";
import oyoq_kiyim_uchun from "../../assets/images/oyoq_kiyim_uchun.png";
import pechenye from "../../assets/images/pechenye.png";
import pishiriq from "../../assets/images/pishiriq.png";
import qatiq from "../../assets/images/qatiq.png";
import qogoz from "../../assets/images/qogoz.png";
import sabzavotli_konserva from "../../assets/images/sabzavotli_konserva.png";
import dengiz from "../../assets/images/dengiz.webp";
import shakar from "../../assets/images/shakar.png";
import sharbat from "../../assets/images/sharbat.jpg";
import shokolad from "../../assets/images/shokolad.png";
import snek from "../../assets/images/snek.png";
import soch_uchun from "../../assets/images/soch_uchun.png";
import soqol_uchun from "../../assets/images/soqol_uchun.png";
import sous from "../../assets/images/sous.png";
import suv from "../../assets/images/suv.webp";
import taglik from "../../assets/images/taglik.png";
import tana_uchun from "../../assets/images/tana_uchun.png";
import tez_pishiring from "../../assets/images/tez_pishiring.png";
import tvorojok from "../../assets/images/tvorojok.png";
import un from "../../assets/images/un.png";
import vegetables from "../../assets/images/vegetables.png";
import xilma_xil from "../../assets/images/xilma_xil.webp";
import yigishtirish_uchun from "../../assets/images/yigishtirish_uchun.png";
import yog from "../../assets/images/yog.png";
import yogurt from "../../assets/images/yogurt.png";
import yorma from "../../assets/images/yorma.png";
import yuz_uchun from "../../assets/images/yuz_uchun.png";
import ziravor from "../../assets/images/ziravor.png";
import choy_quruq from "../../assets/images/choy_quruq.png";

import gift from "../../assets/gift.png";
import aksiya from "../../assets/aksiya.png";
import gift_ios from "../../assets/gift_ios.png";

import Card from "../../components/Card";
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
        <p>Sabzavot va mevalar</p>
        <div className="category-box">
          <div
            onClick={() =>
              navigate(
                "/category/689483c535da7e65ae3c4d50#6894846835da7e65ae3c4d7d"
              )
            }
            className="category-card"
            style={{ background: "#C1E2D9" }}
          >
            <p>Sabzavot, qo'ziqorin, ko'katlar</p>
            <img src={vegetables} alt="vegetables" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483c535da7e65ae3c4d50#6894847435da7e65ae3c4d80"
              )
            }
            className="category-card"
            style={{ background: "#C1E2D9" }}
          >
            <p>Mevalar va rezavorlar</p>
            <img src={fruits} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Sut mahsulotlari</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#68987f4e7a4e91bf97fbc5b8"
              )
            }
            className="category-item"
          >
            <p>Sut va sariyog'</p>
            <img src={milk} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#6894848b35da7e65ae3c4d86"
              )
            }
            className="category-item"
          >
            <p>Tuxum</p>
            <img src={egg} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#68987f8d7a4e91bf97fbc5d0"
              )
            }
            className="category-item"
          >
            <p>Tvorojok va siroklar</p>
            <img src={tvorojok} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#6894849e35da7e65ae3c4d8c"
              )
            }
            className="category-item"
          >
            <p>Yogurt</p>
            <img src={yogurt} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#689484a435da7e65ae3c4d8f"
              )
            }
            className="category-item"
          >
            <p>Pishloq</p>
            <img src={cheese} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ce35da7e65ae3c4d53#689484ad35da7e65ae3c4d92"
              )
            }
            className="category-item"
          >
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
        <p>Go'sht va parranda</p>
        <div className="category-box">
          <div
            onClick={() =>
              navigate(
                "/category/689483d835da7e65ae3c4d56#68987fd27a4e91bf97fbc5e5"
              )
            }
            className="category-card"
            style={{ background: "#EFC6E4" }}
          >
            <p>Go'sht va parranda</p>
            <img src={meat} alt="vegetables" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483d835da7e65ae3c4d56#689484c335da7e65ae3c4d98"
              )
            }
            className="category-card"
            style={{ background: "#EFC6E4" }}
          >
            <p>Kolbasa mahsulotlari</p>
            <img src={kolbasa} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Dengiz mahsulotlari</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/689483df35da7e65ae3c4d59#689484cb35da7e65ae3c4d9b"
              )
            }
            className="category-item"
            style={{ background: "#D9E5F3" }}
          >
            <p>Baliq</p>
            <img style={{ height: "50px", width: "75px" }} src={fish} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483df35da7e65ae3c4d59#689484d335da7e65ae3c4d9e"
              )
            }
            className="category-item"
            style={{ background: "#D9E5F3" }}
          >
            <p>Dengiz mahsulotlari</p>
            <img src={dengiz} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483df35da7e65ae3c4d59#689484dd35da7e65ae3c4da1"
              )
            }
            className="category-item"
            style={{ background: "#D9E5F3" }}
          >
            <p>Baliqli gazaklar</p>
            <img src={baliq_gazak} alt="" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Suv va ichimliklar</p>
        <div className="category-penta">
          <div
            onClick={() =>
              navigate(
                "/category/688cab0f66ac4bb5a48e7651#688f3b12d1705249599c6b4d"
              )
            }
            className="category-item"
            style={{ background: "#E6E1F5" }}
          >
            <p>Suv</p>
            <img style={{ width: "75px", height: "100px" }} src={suv} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/688cab0f66ac4bb5a48e7651#688cac0c66ac4bb5a48e7655"
              )
            }
            className="category-item"
            style={{ background: "#E6E1F5" }}
          >
            <p>Gazlangan ichimliklar</p>
            <img
              style={{ height: "100px", width: "75px" }}
              src={gazlangan}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/688cab0f66ac4bb5a48e7651#6894852535da7e65ae3c4da5"
              )
            }
            className="category-item"
            style={{ background: "#E6E1F5" }}
          >
            <p>Sharbatlar va morslar</p>
            <img
              style={{ width: "30px", marginRight: "5px", marginBottom: "5px" }}
              src={sharbat}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/688cab0f66ac4bb5a48e7651#6894853035da7e65ae3c4da8"
              )
            }
            className="category-item"
            style={{ background: "#E6E1F5" }}
          >
            <p>Yaxna choy va qahva</p>
            <img
              style={{ width: "55px", marginRight: "5px" }}
              src={choy}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/688cab0f66ac4bb5a48e7651#68a051d9a5d7906913b4f5a8"
              )
            }
            className="category-item"
            style={{ background: "#E6E1F5" }}
          >
            <p>Energetik ichimliklar</p>
            <img style={{ width: "65px" }} src={energetik} alt="" />
          </div>
        </div>
      </div>
      <div className="discount">
        <div className="discount-head">
          <b>Shirinlik sevuvchilar</b>
          <button
            onClick={() => navigate("/category/689483ea35da7e65ae3c4d5f")}
          >
            Hammasi <FaChevronRight />
          </button>
        </div>
        <div className="discount-body">
          {discountedProducts
            ?.filter(
              (p) =>
                p.status === "available" &&
                p.category._id === "689483ea35da7e65ae3c4d5f"
            )
            .slice(0, 4)
            ?.map((item) => (
              <Card basket={basket} setBasket={setBasket} item={item} />
            ))}
        </div>
      </div>
      <div className="category-container">
        <p>Shirinliklar</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894856035da7e65ae3c4dae"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Shokolad va konfetlar</p>
            <img src={shokolad} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894856835da7e65ae3c4db1"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Biskvit</p>
            <img
              style={{ width: "75px", height: "50px" }}
              src={biskvit}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894857035da7e65ae3c4db4"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Pechenye va vafli</p>
            <img
              style={{ width: "75px", height: "50px", marginBottom: "5px" }}
              src={pechenye}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894857935da7e65ae3c4db7"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Pastila va marmelad</p>
            <img src={marmelad} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894858135da7e65ae3c4dba"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Murabbo va pastalar</p>
            <img
              style={{ width: "50px", marginRight: "5px " }}
              src={murabbo}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483ea35da7e65ae3c4d5f#6894858b35da7e65ae3c4dbd"
              )
            }
            className="category-item"
            style={{ background: "#F6D9DE" }}
          >
            <p>Kassada</p>
            <img
              style={{ width: "50px", height: "75px" }}
              src={kassada}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Oziq ovqat mollari</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485a235da7e65ae3c4dc0"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Makaronlar yormalar va un</p>
            <img src={un} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485ab35da7e65ae3c4dc3"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Yormalar va myusli</p>
            <img
              style={{ width: "50px", marginRight: "5px" }}
              src={yorma}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485af35da7e65ae3c4dc6"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Yog'</p>
            <img
              style={{ width: "40px", marginRight: "5px" }}
              src={yog}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485b435da7e65ae3c4dc9"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Souslar</p>
            <img style={{ width: "50px", height: "100px" }} src={sous} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485b735da7e65ae3c4dcc"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Shakar</p>
            <img
              style={{ width: "40px", marginRight: "5px" }}
              src={shakar}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485bc35da7e65ae3c4dcf"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Ziravorlar</p>
            <img
              style={{ width: "50px", marginRight: "5px" }}
              src={ziravor}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485c035da7e65ae3c4dd2"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Choy</p>
            <img
              style={{ width: "50px", marginRight: "5px" }}
              src={choy_quruq}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485c735da7e65ae3c4dd5"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Qahva va kakao</p>
            <img
              style={{ width: "35px", marginRight: "5px" }}
              src={kofe}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483f635da7e65ae3c4d62#689485cb35da7e65ae3c4dd8"
              )
            }
            className="category-item"
            style={{ background: "#DFF2EE" }}
          >
            <p>Sneklar</p>
            <img
              style={{ width: "50px", marginRight: "5px" }}
              src={snek}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Non mahsulotlari</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/689483fc35da7e65ae3c4d65#689485d935da7e65ae3c4ddb"
              )
            }
            className="category-item"
            style={{ background: "#FCEDDA" }}
          >
            <p>Non</p>
            <img
              style={{ width: "65px", marginRight: "5px" }}
              src={non}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483fc35da7e65ae3c4d65#689485dd35da7e65ae3c4dde"
              )
            }
            className="category-item"
            style={{ background: "#FCEDDA" }}
          >
            <p>Pishiriqlar</p>
            <img src={pishiriq} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/689483fc35da7e65ae3c4d65#689485e435da7e65ae3c4de1"
              )
            }
            className="category-item"
            style={{ background: "#FCEDDA" }}
          >
            <p>Xlebtsy</p>
            <img src={hlebsty} alt="" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Muzlatilgan mahsulotlar va muzqaymoq</p>
        <div className="category-box">
          <div
            onClick={() =>
              navigate(
                "/category/6894840835da7e65ae3c4d68#689485f635da7e65ae3c4de4"
              )
            }
            className="category-card"
            style={{ background: "#B9CCEA" }}
          >
            <p>Muzqaymoq va muz</p>
            <img src={muzqaymoq} alt="vegetables" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894840835da7e65ae3c4d68#689485fc35da7e65ae3c4de7"
              )
            }
            className="category-card"
            style={{ background: "#B9CCEA" }}
          >
            <p>Tez pishiring</p>
            <img src={tez_pishiring} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Turli xil konservalar</p>
        <div className="category-box">
          <div
            onClick={() =>
              navigate(
                "/category/6894841035da7e65ae3c4d6b#6894860e35da7e65ae3c4dea"
              )
            }
            className="category-card"
            style={{ background: "#DAE6F4" }}
          >
            <p>Sabzavotli va mevali</p>
            <img src={sabzavotli_konserva} alt="vegetables" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894841035da7e65ae3c4d6b#6894861635da7e65ae3c4ded"
              )
            }
            className="category-card"
            style={{ background: "#DAE6F4" }}
          >
            <p>Go'shtli va baliqli</p>
            <img src={goshtli_konserva} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Bolalar uchun</p>
        <div className="category-penta">
          <div
            onClick={() =>
              navigate(
                "/category/6894843135da7e65ae3c4d6e#6894862035da7e65ae3c4df0"
              )
            }
            className="category-item"
            style={{ background: "#F6C58A" }}
          >
            <p>Bolalar ovqatlari</p>
            <img src={bolalar_ovqati} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894843135da7e65ae3c4d6e#6894862735da7e65ae3c4df3"
              )
            }
            className="category-item"
            style={{ background: "#F6C58A" }}
          >
            <p>Tagliklar va salfetkalar</p>
            <img src={taglik} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894843135da7e65ae3c4d6e#6894862f35da7e65ae3c4df6"
              )
            }
            className="category-item"
            style={{ background: "#F6C58A" }}
          >
            <p>Bolalar gigiyenasi</p>
            <img
              style={{ width: "75px", marginBlock: "5px", marginRight: "5px" }}
              src={bolalar_gigiyenasi}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894843135da7e65ae3c4d6e#6894863a35da7e65ae3c4df9"
              )
            }
            className="category-item"
            style={{ background: "#F6C58A" }}
          >
            <p>Idishlar va aksessuarlar</p>
            <img src={bolalar_aksesuar} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894843135da7e65ae3c4d6e#6894863f35da7e65ae3c4dfc"
              )
            }
            className="category-item"
            style={{ background: "#F6C58A" }}
          >
            <p>O'yinchoqlar</p>
            <img style={{ width: "70px" }} src={oyinchoq} alt="" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Uy hayvonlari uchun</p>
        <div className="category-box">
          <div
            onClick={() =>
              navigate(
                "/category/6894843835da7e65ae3c4d71#6894864835da7e65ae3c4dff"
              )
            }
            className="category-card"
            style={{ background: "#F9DDB8" }}
          >
            <p>Mushuklar uchun</p>
            <img src={mushuklar_uchun} alt="vegetables" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894843835da7e65ae3c4d71#6894864d35da7e65ae3c4e02"
              )
            }
            className="category-card"
            style={{ background: "#F9DDB8" }}
          >
            <p>Itlar uchun</p>
            <img src={itlar_uchun} alt="fruits" />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Gigiyena va parvarish</p>
        <div className="category-penta">
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#6894865635da7e65ae3c4e05"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Tana uchun</p>
            <img src={tana_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#6894865b35da7e65ae3c4e08"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Soch uchun</p>
            <img style={{ width: "75px" }} src={soch_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#6894865f35da7e65ae3c4e0b"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Yuz uchun</p>
            <img
              style={{ width: "50px", height: "100px" }}
              src={yuz_uchun}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#6894866635da7e65ae3c4e0e"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Soqol olish uchun</p>
            <img src={soqol_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#688f3b12d1705249599c6b4d"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Ayol gigiyenasi</p>
            <img src={ayol_gigiyenasi} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#688f3b12d1705249599c6b4d"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Og'iz bo'shlig'i uchun</p>
            <img
              style={{ marginBottom: "5px", marginRight: "5px" }}
              src={ogiz_uchun}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844435da7e65ae3c4d74#688f3b12d1705249599c6b4d"
              )
            }
            className="category-item"
            style={{ background: "#AD9CE0" }}
          >
            <p>Foydali mayda buyumlar</p>
            <img
              style={{ width: "65px", marginBottom: "5px", marginRight: "5px" }}
              src={mayda_buyumlar}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Chinniyu chiroq</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/6894844a35da7e65ae3c4d77#689486e435da7e65ae3c4e1b"
              )
            }
            className="category-item"
            style={{ background: "#DEF1ED" }}
          >
            <p>Idishlar uchun</p>
            <img style={{ width: "75px" }} src={idish_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844a35da7e65ae3c4d77#689486ec35da7e65ae3c4e1e"
              )
            }
            className="category-item"
            style={{ background: "#DEF1ED" }}
          >
            <p>Kir yuvish uchun</p>
            <img
              style={{ width: "50px", marginRight: "5px", marginBottom: "5px" }}
              src={kir_uchun}
              alt=""
            />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844a35da7e65ae3c4d77#689486f635da7e65ae3c4e21"
              )
            }
            className="category-item"
            style={{ background: "#DEF1ED" }}
          >
            <p>Yig'ishtirish uchun</p>
            <img
              style={{ width: "50px", marginRight: "5px", marginBottom: "5px" }}
              src={yigishtirish_uchun}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="category-container">
        <p>Ro'zg'or uchun</p>
        <div className="category-flex">
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894871135da7e65ae3c4e24"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Qog'oz va salfetkalar</p>
            <img style={{ width: "80px" }} src={qogoz} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894871735da7e65ae3c4e27"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Oshxona uchun</p>
            <img src={oshxona_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894871f35da7e65ae3c4e2a"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Kiyim va oyoq kiyimi uchun</p>
            <img src={oyoq_kiyim_uchun} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894872735da7e65ae3c4e2d"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Xilma-xil buyumlar</p>
            <img src={xilma_xil} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894872d35da7e65ae3c4e30"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Elektr jihozlari</p>
            <img src={elektr} alt="" />
          </div>
          <div
            onClick={() =>
              navigate(
                "/category/6894844f35da7e65ae3c4d7a#6894873735da7e65ae3c4e33"
              )
            }
            className="category-item"
            style={{ background: "#FFF1DE" }}
          >
            <p>Kanselyariya buyumlari</p>
            <img src={kanselyariy} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

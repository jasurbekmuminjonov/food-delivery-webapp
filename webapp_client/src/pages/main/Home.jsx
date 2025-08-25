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

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLazyGetProductsByQueryQuery } from "../../context/services/product.service";
import {
  useCreateUserMutation,
  useLazyGetUserByQueryQuery,
} from "../../context/services/user.service";
import { useGetOrdersQuery } from "../../context/services/order.service";

import ayol_gigiyenasi from "../../assets/categories/ayol_gigiyenasi.png";
import baliq_gazak from "../../assets/categories/baliq_gazak.png";
import biskvit from "../../assets/categories/biskvit.png";
import bolalar_aksesuar from "../../assets/categories/bolalar_aksesuar.png";
import bolalar_gigiyenasi from "../../assets/categories/bolalar_gigiyenasi.png";
import bolalar_ovqati from "../../assets/categories/bolalar_ovqati.avif";
import cheese from "../../assets/categories/cheese.png";
import choy from "../../assets/categories/kofe_stakan.png";
import egg from "../../assets/categories/egg.png";
import elektr from "../../assets/categories/elektr.png";
import energetik from "../../assets/categories/energetik.png";
import fish from "../../assets/categories/baliq.png";
import fruits from "../../assets/categories/fruits.png";
import gazlangan from "../../assets/categories/gazlangan.png";
import goshtli_konserva from "../../assets/categories/goshtli_konserva.png";
import hlebsty from "../../assets/categories/hlebsty.png";
import idish_uchun from "../../assets/categories/idish_uchun.png";
import itlar_uchun from "../../assets/categories/itlar_uchun.png";
import kanselyariy from "../../assets/categories/kanselyariy.png";
import kassada from "../../assets/categories/kassada.webp";
import kir_uchun from "../../assets/categories/kir_uchun.png";
import kofe from "../../assets/categories/kofe.png";
import kolbasa from "../../assets/categories/kolbasa.png";
import marmelad from "../../assets/categories/marmelad.png";
import mayda_buyumlar from "../../assets/categories/mayda_buyumlar.png";
import murabbo from "../../assets/categories/murabbo.png";
import meat from "../../assets/categories/meat.png";
import milk from "../../assets/categories/milk.png";
import mushuklar_uchun from "../../assets/categories/mushuklar_uchun.png";
import muzqaymoq from "../../assets/categories/muzqaymoq.png";
import non from "../../assets/categories/non.png";
import ogiz_uchun from "../../assets/categories/ogiz_uchun.png";
import oshxona_uchun from "../../assets/categories/oshxona_uchun.png";
import oyinchoq from "../../assets/categories/oyinchoq.png";
import oyoq_kiyim_uchun from "../../assets/categories/oyoq_kiyim_uchun.png";
import pechenye from "../../assets/categories/pechenye.png";
import pishiriq from "../../assets/categories/pishiriq.png";
import qatiq from "../../assets/categories/qatiq.png";
import qogoz from "../../assets/categories/qogoz.png";
import sabzavotli_konserva from "../../assets/categories/sabzavotli_konserva.png";
import dengiz from "../../assets/categories/dengiz.webp";
import shakar from "../../assets/categories/shakar.png";
import sharbat from "../../assets/categories/sharbat.jpg";
import shokolad from "../../assets/categories/shokolad.png";
import snek from "../../assets/categories/snek.png";
import soch_uchun from "../../assets/categories/soch_uchun.png";
import soqol_uchun from "../../assets/categories/soqol_uchun.png";
import sous from "../../assets/categories/sous.png";
import suv from "../../assets/categories/suv.webp";
import taglik from "../../assets/categories/taglik.png";
import tana_uchun from "../../assets/categories/tana_uchun.png";
import tez_pishiring from "../../assets/categories/tez_pishiring.png";
import tvorojok from "../../assets/categories/tvorojok.png";
import un from "../../assets/categories/un.png";
import vegetables from "../../assets/categories/vegetables.png";
import xilma_xil from "../../assets/categories/xilma_xil.webp";
import yigishtirish_uchun from "../../assets/categories/yigishtirish_uchun.png";
import yog from "../../assets/categories/yog.png";
import yogurt from "../../assets/categories/yogurt.png";
import yorma from "../../assets/categories/yorma.png";
import yuz_uchun from "../../assets/categories/yuz_uchun.png";
import ziravor from "../../assets/categories/ziravor.png";
import choy_quruq from "../../assets/categories/choy_quruq.png";

import gift from "../../assets/gift.png";
import aksiya from "../../assets/aksiya.png";
import gift_ios from "../../assets/gift_ios.png";

import Card from "../../components/Card";
import EmptyCard from "../../components/EmptyCard";
const Home = () => {
  const [aksiyaModal, setAksiyaModal] = useState(false);
  const { data: orders = [] } = useGetOrdersQuery();
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();
  const homeRef = useRef(null);

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem("homeScrollY");
    if (savedScrollY && homeRef.current) {
      homeRef.current.scrollTop = parseInt(savedScrollY);
    }

    const handleScroll = () => {
      sessionStorage.setItem("homeScrollY", homeRef.current.scrollTop);
    };

    const div = homeRef.current;
    if (div) div.addEventListener("scroll", handleScroll);

    return () => {
      if (div) div.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [getUser, { data: userData = {} }] = useLazyGetUserByQueryQuery();
  const [getDiscountProducts, { data: discountedProducts = [] }] =
    useLazyGetProductsByQueryQuery();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    getDiscountProducts({ discount: "true" });
  }, [getDiscountProducts]);
  const [getSweetProducts, { data: sweetProducts = [] }] =
    useLazyGetProductsByQueryQuery();
  useEffect(() => {
    getSweetProducts({ category_id: "689483ea35da7e65ae3c4d5f" });
  }, [getSweetProducts]);

  useEffect(() => {
    getUser(localStorage.getItem("telegram_id"));
  }, [getUser]);

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

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Sizning brauzeringiz joylashuvni qo'llab quvvatlamaydi");
      return;
    }
    if (userData?.default_address?.lat) {
      return;
    }

    navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await createUser({
            telegram_id: localStorage.getItem("telegram_id"),
            default_address: {
              lat: pos.coords.latitude,
              long: pos.coords.longitude,
            },
          }).unwrap();
        } catch (error) {
          console.error(error);
        }
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [createUser, userData]);

  return (
    <div className="home" ref={homeRef}>
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
      {aksiyaModal && (
        <div className="modal-container" onClick={closeModal}>
          <div className={`aksiya-modal ${closing ? "hide" : ""}`}>
            <div className="modal-image">
              <img loading="lazy" src={aksiya} alt="" />
            </div>
            <div className="modal-body">
              <h3>Birinchi buyurtma uchun sovg'a</h3>
              <p>
                Birinchi buyurtma uchun qo'shimcha sovg'ani qabul qilib oling.
                Aksiya barcha turdagi mahsulotlarga amal qiladi. Buyurtma
                summasi 250 000 so'mda oshishi kerak{" "}
                <img
                  loading="lazy"
                  width="15px"
                  height="15px"
                  src={gift_ios}
                  alt=""
                />
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
        <div onClick={() => navigate("/order/history")}>
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
          <img loading="lazy" src={gift} alt="gift" />
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
              ?.slice(0, 6)
              ?.map((item) => (
                <Card
                  key={item._id}
                  basket={basket}
                  setBasket={setBasket}
                  item={item}
                />
              ))
          ) : (
            <EmptyCard />
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
            <img loading="lazy" src={vegetables} alt="vegetables" />
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
            <img loading="lazy" src={fruits} alt="fruits" />
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
            <img loading="lazy" src={milk} alt="" />
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
            <img loading="lazy" src={egg} alt="" />
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
            <img loading="lazy" src={tvorojok} alt="" />
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
            <img loading="lazy" src={yogurt} alt="" />
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
            <img loading="lazy" src={cheese} alt="" />
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
            <img loading="lazy" src={qatiq} alt="" />
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
          {discountedProducts.length > 0 ? (
            discountedProducts
              ?.slice(0, 6)
              ?.map((item) => (
                <Card
                  key={item._id}
                  basket={basket}
                  setBasket={setBasket}
                  item={item}
                />
              ))
          ) : (
            <EmptyCard />
          )}
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
            <img loading="lazy" src={meat} alt="vegetables" />
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
            <img loading="lazy" src={kolbasa} alt="fruits" />
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
            <img
              loading="lazy"
              style={{ height: "50px", width: "75px" }}
              src={fish}
              alt=""
            />
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
            <img loading="lazy" src={dengiz} alt="" />
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
            <img loading="lazy" src={baliq_gazak} alt="" />
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
            <img
              loading="lazy"
              style={{ width: "75px", height: "100px" }}
              src={suv}
              alt=""
            />
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
              loading="lazy"
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
              loading="lazy"
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
              loading="lazy"
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
            <img
              loading="lazy"
              style={{ width: "65px" }}
              src={energetik}
              alt=""
            />
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
          {sweetProducts.length > 0 ? (
            sweetProducts
              ?.slice(0, 6)
              ?.map((item) => (
                <Card
                  key={item._id}
                  basket={basket}
                  setBasket={setBasket}
                  item={item}
                />
              ))
          ) : (
            <EmptyCard />
          )}
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
            <img loading="lazy" src={shokolad} alt="" />
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
              loading="lazy"
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
              loading="lazy"
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
            <img loading="lazy" src={marmelad} alt="" />
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
              loading="lazy"
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
              loading="lazy"
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
            <img loading="lazy" src={un} alt="" />
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
              loading="lazy"
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
              loading="lazy"
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
            <img
              loading="lazy"
              style={{ width: "50px", height: "100px" }}
              src={sous}
              alt=""
            />
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
              loading="lazy"
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
              loading="lazy"
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
              loading="lazy"
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
              loading="lazy"
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
              loading="lazy"
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
              loading="lazy"
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
            <img loading="lazy" src={pishiriq} alt="" />
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
            <img loading="lazy" src={hlebsty} alt="" />
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
            <img loading="lazy" src={muzqaymoq} alt="vegetables" />
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
            <img loading="lazy" src={tez_pishiring} alt="fruits" />
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
            <img loading="lazy" src={sabzavotli_konserva} alt="vegetables" />
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
            <img loading="lazy" src={goshtli_konserva} alt="fruits" />
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
            <img loading="lazy" src={bolalar_ovqati} alt="" />
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
            <img loading="lazy" src={taglik} alt="" />
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
              loading="lazy"
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
            <img loading="lazy" src={bolalar_aksesuar} alt="" />
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
            <img
              loading="lazy"
              style={{ width: "70px" }}
              src={oyinchoq}
              alt=""
            />
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
            <img loading="lazy" src={mushuklar_uchun} alt="vegetables" />
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
            <img loading="lazy" src={itlar_uchun} alt="fruits" />
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
            <img loading="lazy" src={tana_uchun} alt="" />
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
            <img
              loading="lazy"
              style={{ width: "75px" }}
              src={soch_uchun}
              alt=""
            />
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
              loading="lazy"
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
            <img loading="lazy" src={soqol_uchun} alt="" />
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
            <img loading="lazy" src={ayol_gigiyenasi} alt="" />
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
              loading="lazy"
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
              loading="lazy"
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
            <img
              loading="lazy"
              style={{ width: "75px" }}
              src={idish_uchun}
              alt=""
            />
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
              loading="lazy"
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
              loading="lazy"
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
            <img loading="lazy" style={{ width: "80px" }} src={qogoz} alt="" />
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
            <img loading="lazy" src={oshxona_uchun} alt="" />
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
            <img loading="lazy" src={oyoq_kiyim_uchun} alt="" />
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
            <img loading="lazy" src={xilma_xil} alt="" />
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
            <img loading="lazy" src={elektr} alt="" />
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
            <img loading="lazy" src={kanselyariy} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

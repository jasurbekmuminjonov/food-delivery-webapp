import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../../context/services/order.service";
import { IoSearchOutline } from "react-icons/io5";
import { FaArrowLeftLong, FaX } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { useMemo } from "react";
import { Divider } from "antd";
import giftIos from "../../assets/gift_ios.png";
import { useGetProductsQuery } from "../../context/services/product.service";
import cashImg from "../../assets/cash.png";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
import { LuClock2 } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";

const Order = () => {
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: products = [] } = useGetProductsQuery();

  const navigate = useNavigate();
  const activeOrder = useMemo(() => {
    const active = orders.find(
      (o) => o.order_status === "preparing" || o.order_status === "delivering"
    );
    return active;
  }, [orders]);

  function returnProductFromId(id) {
    return products.find((p) => p._id === id);
  }
  const statusTypes = {
    preparing: {
      text: "Tayyorlanmoqda",
      icon: <LuClock2 size={20} />,
    },
    delivering: {
      text: "Yo'lda",
      icon: <MdDeliveryDining size={20} />,
    },
    completed: {
      text: "Yetkazildi",
      icon: <IoMdDoneAll size={20} />,
    },
    canceled: {
      text: "Bekor qilindi",
      icon: <FaX size={20} />,
    },
  };

  return (
    <div className="basket-wrapper">
      <div className="basket-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <div className="basket-actions">
          <button onClick={() => navigate("/search")}>
            <IoSearchOutline size={18} />
          </button>
          <button>
            <AiOutlineDelete size={18} />
          </button>
        </div>
      </div>
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginTop: "5px",
          flexShrink: 0,
        }}
      >
        Aktiv buyurtma
        {activeOrder?.bonus && (
          <>
            <img width="30px" src={giftIos} alt="" />
          </>
        )}
      </h3>

      <div className="progress" style={{ height: "auto" }}>
        <p>
          Yetkazish {activeOrder?.delivery_fee?.toLocaleString("ru-RU")} so'm
        </p>
        <p style={{ marginTop: "5px" }}>
          Mahsulotlar{" "}
          {activeOrder?.products
            ?.reduce((acc, p) => acc + p.quantity * p.sale_price, 0)
            ?.toLocaleString("ru-RU")}{" "}
          so'm
        </p>
        <Divider />
        <strong>
          Jami to'lov {activeOrder?.total_price?.toLocaleString("ru-RU")} so'm
        </strong>
      </div>
      <div className="progress" style={{ height: "auto" }}>
        <strong>Kuryer</strong>
        {activeOrder?.courier_id === null ? (
          <p>Sizning buyurtmangizga hali kuryer biriktirilmadi</p>
        ) : (
          <div>
            <img
              width={50}
              src={
                activeOrder?.courier_id.courier_gender === "male"
                  ? male
                  : female
              }
              alt=""
            />
            <div>
              <p>{activeOrder?.courier_id.courier_name}</p>
              <a href={`tel:${activeOrder?.courier_id.courier_phone}`}>
                {activeOrder?.courier_id.courier_phone}
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="progress">
        <strong>Buyurtma holati</strong>
        <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {statusTypes[activeOrder?.order_status]?.text}{" "}
          {statusTypes[activeOrder?.order_status]?.icon}
        </p>
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
            height: "30px",
          }}
          onClick={() => {
            navigate(
              `/map?lat=${activeOrder?.order_address?.lat}&long=${activeOrder?.order_address?.long}`
            );
          }}
        >
          Tanlangan manzil
        </p>
      </div>
      <h3>Mahsulotlar</h3>
      <div className="basket-products">
        {activeOrder?.products?.map((p) => (
          <div className="basket-product">
            <img
              src={
                returnProductFromId(p.product_id).image_log.find(
                  (i) => i.isMain
                ).image_url
              }
              alt=""
            />
            <div className="basket-title">
              <p>{returnProductFromId(p.product_id).product_name}</p>
              {returnProductFromId(p.product_id).discount_log.find(
                (d) => d.status === "active"
              ) ? (
                <>
                  <b>
                    {Number(
                      (
                        returnProductFromId(p.product_id).selling_price -
                        (returnProductFromId(p.product_id).selling_price /
                          100) *
                          returnProductFromId(p.product_id).discount_log.find(
                            (d) => d.status === "active"
                          )?.percent
                      ).toFixed()
                    ).toLocaleString("ru-RU")}{" "}
                    so'm
                  </b>
                  <span>
                    {returnProductFromId(
                      p.product_id
                    ).selling_price?.toLocaleString("ru-RU")}{" "}
                    so'm
                  </span>
                </>
              ) : (
                <h4 style={{ fontWeight: "500" }}>
                  {returnProductFromId(
                    p.product_id
                  ).selling_price?.toLocaleString("ru-RU")}{" "}
                  so'm
                </h4>
              )}

              <h5>{returnProductFromId(p.product_id).unit_description}</h5>
            </div>
            <div className="quantity">
              <p>
                {p.quantity} {returnProductFromId(p.product_id).unit}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="progress">
        <strong>To'lov usuli</strong>
        <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <img width="30px" src={cashImg} alt="" /> Naqd bilan kuryerga
        </p>
      </div>
    </div>
  );
};

export default Order;

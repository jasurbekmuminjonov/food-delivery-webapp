import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery } from "../../context/services/order.service";
import { FaArrowLeftLong, FaX } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { LuClock2 } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { Collapse } from "antd"; // ⬅️ antd collapse import
import Empty from "../../components/Empty";

const { Panel } = Collapse;

const OrderHistory = () => {
  const { data: orders = [] } = useGetOrdersQuery();
  const navigate = useNavigate();

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
    <div className="order-history">
      <div className="basket-header">
        <button onClick={() => navigate("/")}>
          <FaArrowLeftLong />
        </button>
        <h3>Buyurtmalar tarixi</h3>
        <div className="basket-actions">
          <button onClick={() => navigate("/search")}>
            <IoSearchOutline size={18} />
          </button>
        </div>
      </div>
      {orders.length > 0 ? (
        <div className="orders-container">
          {orders
            ?.toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.map((o) => (
              <div className="order_card" key={o._id}>
                <strong>
                  Jami mahsulot:
                  <p>
                    {o.products
                      .reduce((acc, p) => acc + p.quantity * p.sale_price, 0)
                      ?.toLocaleString("ru-RU")}{" "}
                    so'm
                  </p>
                </strong>
                <strong>
                  Yetkazib berish:
                  <p>{o.delivery_fee?.toLocaleString("ru-RU")} so'm</p>
                </strong>
                <strong>
                  Jami:
                  <p>{o.total_price?.toLocaleString("ru-RU")} so'm</p>
                </strong>
                <strong>
                  Holati:
                  <p>{statusTypes[o.order_status].text} </p>
                  {statusTypes[o.order_status].icon}
                </strong>
                <strong>
                  Kuryer: <p>{o.courier_id.courier_name}</p>
                </strong>
                <strong>
                  Buyurtma sanasi:{" "}
                  <p>{new Date(o.createdAt).toLocaleString("ru-RU")}</p>
                </strong>

                <Collapse style={{ background: "transparent" }}>
                  <Panel header="Tovarlar" key="1">
                    <div className="basket-products">
                      {o.products.map((p) => (
                        <div
                          key={p.product_id_id}
                          className="basket-product"
                          style={{
                            border: "1px solid #ccc",
                            marginBottom: "6px",
                          }}
                        >
                          <img
                            src={
                              p.product_id.image_log.find((i) => i.isMain)
                                .image_url
                            }
                            alt=""
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="basket-title">
                            <p>
                              {p.product_id.product_name}{" "}
                              {p.product_id.unit_description}
                            </p>
                            <h4 style={{ fontWeight: "500" }}>
                              {p.sale_price?.toLocaleString("ru-RU")} so'm
                            </h4>
                          </div>
                          <p>
                            {p.quantity} {p.product_id.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </Collapse>
              </div>
            ))}
        </div>
      ) : (
        <Empty text={"Sizda hali buyurtmalar mavjud emas"} />
      )}
    </div>
  );
};

export default OrderHistory;

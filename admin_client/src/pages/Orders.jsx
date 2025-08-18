import { useMemo, useState } from "react";
import {
  useCompletePreparingMutation,
  useGetOrderQuery,
} from "../context/services/order.service";
import {
  Button,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  notification,
} from "antd";
import moment from "moment";
import { FaCheckDouble, FaLocationDot } from "react-icons/fa6";
import { IoMdPrint } from "react-icons/io";
import { useGetCouriersQuery } from "../context/services/courier.service";

const Orders = () => {
  const { data: orders = [], isLoading } = useGetOrderQuery();
  const { data: couriers = [] } = useGetCouriersQuery();
  const [completePreparing] = useCompletePreparingMutation();

  const [orderFilter, setOrderFilter] = useState("preparing");
  const [selectedDate, setSelectedDate] = useState(["", ""]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderFilter ? o.order_status === orderFilter : true;

      const matchesDate =
        selectedDate[0] && selectedDate[1]
          ? moment(o.createdAt).isSameOrAfter(
              moment(selectedDate[0]).startOf("day")
            ) &&
            moment(o.createdAt).isSameOrBefore(
              moment(selectedDate[1]).endOf("day")
            )
          : true;

      return matchesStatus && matchesDate;
    });
  }, [orders, orderFilter, selectedDate]);

  const productColumns = [
    {
      title: "Mahsulot rasmi",
      dataIndex: "product_id",
      render: (text) => (
        <img width={60} src={text?.image_log.find((i) => i.isMain).image_url} />
      ),
    },
    {
      title: "Mahsulot nomi",
      dataIndex: "product_id",
      render: (id) => id?.product_name || "-",
    },
    {
      title: "Birlik",
      dataIndex: "product_id",
      render: (id) => id?.unit || "-",
    },
    {
      title: "Birlik qo'shimchasi",
      dataIndex: "product_id",
      render: (id) => id?.unit_description || "-",
    },
    {
      title: "Soni",
      dataIndex: "quantity",
    },
    {
      title: "Sotuv narxi",
      dataIndex: "sale_price",
      render: (text) => text.toLocaleString("ru-RU"),
    },
    {
      title: "Umumiy",
      render: (_, record) =>
        (record.sale_price * record.quantity).toLocaleString("ru-RU"),
    },
    {
      title: "",
      render: () => <input type="checkbox" name="" id="" />,
    },
  ];

  const columns = [
    {
      title: "Foydalanuvchi",
      dataIndex: "user_id",
      render: (text) => (
        <Popover
          title="Foydalanuvchi malumotlari"
          trigger="click"
          content={
            <Space direction="vertical">
              <p>Ismi: {text.user_name}</p>
              <p>Tel raqami: {text.user_phone}</p>
              <p>Jinsi: {text.user_gender === "male" ? "Erkak" : "Ayol"}</p>
            </Space>
          }
        >
          <Button>{text.user_name}</Button>
        </Popover>
      ),
    },
    {
      title: "So'ralgan kuryer",
      dataIndex: "requested_courier",
      render: (text) => (text === "male" ? "Erkak" : "Ayol"),
    },
    {
      title: "Zakaz umumiy summasi",
      dataIndex: "total_price",
      render: (text) => text.toLocaleString("ru-RU"),
    },
    {
      title: "Mahsulotlar",
      dataIndex: "products",
      render: (products) => (
        <Button
          onClick={() => {
            setSelectedProducts(products);
            setIsModalOpen(true);
          }}
        >
          {products.length} ta
        </Button>
      ),
    },
    {
      title: "Zakaz holati",
      render: (_, record) => (
        <Popover
          trigger="click"
          content={
            <Table
              size="small"
              pagination={false}
              dataSource={[
                {
                  createdAt: record.createdAt,
                  prepared_date: record.prepared_date,
                  delivered_date: record.delivered_date,
                  canceled_date: record.canceled_date,
                },
              ]}
              columns={[
                {
                  title: "Tushgan sana",
                  dataIndex: "createdAt",
                  render: (text) =>
                    text ? moment(text).format("DD.MM.YYYY HH:mm") : "-",
                },
                {
                  title: "Kuryerga berilgan sana",
                  dataIndex: "prepared_date",
                  render: (text) =>
                    text ? moment(text).format("DD.MM.YYYY HH:mm") : "-",
                },
                {
                  title: "Yetkazib berilgan sana",
                  dataIndex: "delivered_date",
                  render: (text) =>
                    text ? moment(text).format("DD.MM.YYYY HH:mm") : "-",
                },
                {
                  title: "Bekor qilingan sana",
                  dataIndex: "canceled_date",
                  render: (text) =>
                    text ? moment(text).format("DD.MM.YYYY HH:mm") : "-",
                },
              ]}
            />
          }
        >
          <Button>
            {record.order_status === "preparing"
              ? "Yangi tushgan"
              : record.order_status === "delivering"
              ? "Kuryerga berilgan"
              : record.order_status === "completed"
              ? "Egasiga berilgan"
              : "Bekor qilingan"}
          </Button>
        </Popover>
      ),
    },
    {
      title: "Dostafka xizmati",
      dataIndex: "delivery_fee",
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      render: (text) =>
        text ? <Tag color="green">Bor!</Tag> : <Tag color="yellow">Yo'q</Tag>,
    },
    {
      title: "Biriktirilgan kuryer",
      dataIndex: "courier_id",
      render: (text) => (text ? text.courier_name : "-"),
    },
    {
      title: "Manzil",
      dataIndex: "order_address",
      render: (text) => (
        <Button
          icon={
            <FaLocationDot
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${text.lat},${text.long}`,
                  "_blank"
                )
              }
            />
          }
        />
      ),
    },
    {
      title: "Kuryerga berish",
      render: (_, record) => (
        <Popover
          content={
            <Form
              onFinish={async (values) => {
                try {
                  await completePreparing({
                    orderId: record._id,
                    body: { courier_id: values.courier_id },
                  });
                  notification.success({
                    message: "Zakaz kuryerga biriktirildi",
                    description: "",
                  });
                } catch (err) {
                  console.log(err);
                  notification.error({
                    message: "Zakazni kuryerga biriktirishda xatolik",
                    description: "",
                  });
                }
              }}
              layout="vertical"
            >
              <Form.Item
                name="courier_id"
                rules={[{ required: true, message: "Kuryerni tanlang" }]}
              >
                <Select style={{ width: "200px" }}>
                  {couriers.map((c) => (
                    <Select.Option
                      style={
                        c.courier_gender === "male"
                          ? { color: "#0ba5fe" }
                          : { color: "#ee50aa" }
                      }
                      value={c._id}
                    >
                      {c.courier_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Tanlash
                </Button>
              </Form.Item>
            </Form>
          }
          trigger="click"
        >
          <Button
            disabled={record.order_status !== "preparing"}
            icon={<FaCheckDouble />}
          />
        </Popover>
      ),
    },
    {
      title: "Chop etish",
      render: (_, record) => (
        <Button onClick={() => handlePrint(record)} icon={<IoMdPrint />} />
      ),
    },
  ];

  const handlePrint = (record) => {
    const printWindow = window.open("", "_blank", "width=400,height=600");

    const productsHtml = record.products
      .map(
        (p) => `
      <tr>
        <td>${p.product_id.product_name}</td>
        <td style="text-align:center;">${p.quantity}</td>
        <td style="text-align:right;">${p.sale_price.toLocaleString(
          "ru-RU"
        )}</td>
      </tr>
    `
      )
      .join("");

    const subtotal = record.products.reduce(
      (sum, p) => sum + p.sale_price * p.quantity,
      0
    );

    const delivery = record.delivery_fee || 0;
    const total = record.total_price || subtotal + delivery;

    printWindow.document.write(`
    <html>
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <title>Chek</title>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: "Poppins", sans-serif;
              font-size: 12px;
              width: 80mm;
              padding: 5px;
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .header {
              padding-bottom: 5px;
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .header h2 {
              margin: 0;
              font-size: 16px;
              text-align: center;
            }
            .info {
              font-size: 12px;
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              gap: 5px;
              align-items: end;
            }
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

table th, table td {
  padding: 4px 0;
  border: 1px solid #000;
  padding-inline: 5px;
}

table th {
  font-weight: 600;
  text-align: left;
   background: #f0f0f0;
}

table td:nth-child(2) {
  text-align: center; 
}

             table td:nth-child(3) {
              text-align: right;
            }

            .footer {
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 5px;
              text-align: center;
              font-size: 12px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Bim - onlayn supermarket</h2>
          <div>Buyurtma ID si: #${record._id.slice(-6)?.toUpperCase()}</div>
          <div>Kuryer: ${record?.courier_id?.courier_name || "-"}</div>
          <div>Vaqt: ${new Date(record.createdAt).toLocaleString("ru-RU")}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">Mahsulot nomi</th>
              <th style="text-align:center;">Miqdori</th>
              <th style="text-align:right;">Narxi</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <div class="info">
          <div>Mahsulot: ${subtotal.toLocaleString("ru-RU")}</div>
          <div>Yetkazib berish: ${delivery.toLocaleString("ru-RU")}</div>
          <div><b>UMUMIY: ${total.toLocaleString("ru-RU")} SO'M</b></div>
        </div>

        <div class="footer">
          Xaridingiz uchun rahmat!
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="orders-page">
      <Space>
        <Select
          style={{ width: "200px" }}
          value={orderFilter}
          onChange={setOrderFilter}
        >
          <Select.Option value="preparing">Yangi tushgan</Select.Option>
          <Select.Option value="delivering">Kuryerga berilgan</Select.Option>
          <Select.Option value="completed">Egasiga berilgan</Select.Option>
          <Select.Option value="canceled">Bekor qilingan</Select.Option>
          <Select.Option value="">Barchasi</Select.Option>
        </Select>
        <input
          type="date"
          value={selectedDate[0]}
          onChange={(e) => setSelectedDate([e.target.value, selectedDate[1]])}
        />
        <input
          type="date"
          value={selectedDate[1]}
          onChange={(e) => setSelectedDate([selectedDate[0], e.target.value])}
        />

        <p>
          Umumiy zakaz summasi:{" "}
          {filteredOrders
            .reduce((acc, o) => acc + o.total_price, 0)
            .toLocaleString("ru-RU")}
        </p>
      </Space>

      <Table
        loading={isLoading}
        dataSource={filteredOrders}
        columns={columns}
        size="small"
        rowKey="_id"
      />

      <Modal
        title="Mahsulotlar ro'yxati"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Table
          dataSource={selectedProducts}
          columns={productColumns}
          pagination={false}
          rowKey={(r) => r.product_id}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default Orders;

import { useMemo, useRef, useState } from "react";
import {
  useCreateDiscountForProductMutation,
  useDeleteImageInProductMutation,
  useGetProductsQuery,
  useInsertImageToProductMutation,
  useRemoveDiscountInProductMutation,
  useSetImageToMainMutation,
  useToggleProductStatusMutation,
} from "../context/services/product.service";
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popover,
  Space,
  Table,
  Tag,
} from "antd";
import { IoMdEye } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { RiImageAddLine } from "react-icons/ri";
import { TbRosetteDiscount, TbRosetteDiscountOff } from "react-icons/tb";

const Products = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [imageLog, setImageLog] = useState({});
  const [imageModal, setImageModal] = useState(false);
  const [setImageToMain] = useSetImageToMainMutation();
  const [deleteImageInProduct] = useDeleteImageInProductMutation();
  const [insertImageToProduct] = useInsertImageToProductMutation();
  const [insertingProduct, setInsertingProduct] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [createDiscount] = useCreateDiscountForProductMutation();
  const [removeDiscount] = useRemoveDiscountInProductMutation();
  const [toggleStatus] = useToggleProductStatusMutation();
  const navigate = useNavigate();
  const fileRef = useRef();

  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      item.product_name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [products, searchQuery]);

  const columns = [
    {
      title: "Tovar nomi",
      dataIndex: "product_name",
    },
    {
      title: "Holati",
      dataIndex: "status",
      render: (text, record) =>
        text === "available" ? (
          <Tag
            style={{ cursor: "pointer" }}
            onClick={async () => {
              try {
                const res = await toggleStatus(record._id).unwrap();
                notification.success({ message: res.message, description: "" });
              } catch (err) {
                console.log(err);
                notification.error({
                  message: err.data.message,
                  description: "",
                });
              }
            }}
            color="green"
          >
            Mavjud
          </Tag>
        ) : (
          <Tag
            style={{ cursor: "pointer" }}
            onClick={async () => {
              try {
                const res = await toggleStatus(record._id).unwrap();
                notification.success({ message: res.message, description: "" });
              } catch (err) {
                console.log(err);
                notification.error({
                  message: err.data.message,
                  description: "",
                });
              }
            }}
            color="red"
          >
            Mavjud emas
          </Tag>
        ),
    },
    {
      title: "Sotish narxi",
      dataIndex: "selling_price",
      render: (text) => <strong>{text?.toLocaleString()}</strong>,
    },
    {
      title: "Kategoriya",
      dataIndex: "category",
      render: (text) => text.category,
    },
    {
      title: "Subkategoriya",
      dataIndex: "subcategory",
      render: (text) => text.subcategory,
    },
    {
      title: "Birligi",
      dataIndex: "unit",
    },
    {
      title: "Birlik qo'shimchasi",
      dataIndex: "unit_description",
    },
    {
      title: "Aktiv chegirma",
      dataIndex: "discount_log",
      render: (text) => {
        const activeDiscount = text.find((i) => i.status === "active");
        return activeDiscount ? (
          <Tag color="red">-{activeDiscount.percent}%</Tag>
        ) : (
          <Tag color="green">0%</Tag>
        );
      },
    },
    {
      title: "Tovar tavsifi",
      dataIndex: "product_description",
      render: (text) => (
        <Popover
          overlayStyle={{ width: "300px" }}
          trigger={"hover"}
          content={() => <Card>{text}</Card>}
          placement="bottom"
        >
          <Button icon={<IoMdEye />} />
        </Popover>
      ),
    },
    {
      title: "Tovar tarkibi",
      dataIndex: "product_ingredients",
      render: (text) => (
        <Popover
          overlayStyle={{ width: "300px" }}
          trigger={"hover"}
          content={() => <Card>{text}</Card>}
          placement="bottom"
        >
          <Button icon={<IoMdEye />} />
        </Popover>
      ),
    },
    {
      title: "Qo'shimchalar",
      dataIndex: "additionals",
      render: (text) => (
        <Popover
          trigger={"hover"}
          content={() => (
            <Space direction="vertical">
              {text.map((item) => (
                <Tag>{item}</Tag>
              ))}
            </Space>
          )}
          placement="bottom"
        >
          <Button icon={<IoMdEye />} />
        </Popover>
      ),
    },
    {
      title: "Rasmlar",
      render: (_, record) => (
        <Button
          onClick={() => {
            setImageLog(record);
            setImageModal(true);
          }}
          icon={<IoMdEye />}
        />
      ),
    },
    {
      title: "Yaroqlilik kunlari",
      dataIndex: "expiration",
    },
    {
      title: "Ozuq. qiy",
      dataIndex: "nutritional_value",
      render: (text) => {
        const columns = [
          {
            title: "Kaloriya",
            dataIndex: "kkal",
            key: "kkal",
          },
          {
            title: "Oqsillar",
            dataIndex: "protein",
            key: "protein",
          },
          {
            title: "Yog'lar",
            dataIndex: "fat",
            key: "fat",
          },
          {
            title: "Uglevodlar",
            dataIndex: "uglevod",
            key: "uglevod",
          },
        ];

        const dataSource = [
          {
            key: "1",
            kkal: text?.kkal || "-",
            protein: text?.protein || "-",
            fat: text?.fat || "-",
            uglevod: text?.uglevod || "-",
          },
        ];

        return (
          <Popover
            trigger="hover"
            placement="bottom"
            content={
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                bordered
              />
            }
          >
            <Button icon={<IoMdEye />} />
          </Popover>
        );
      },
    },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <Space>
          <Button
            warning
            icon={<MdEdit />}
            onClick={() => navigate(`/product/add/${record._id}`)}
          />
          <Button
            onClick={() => {
              setInsertingProduct(record._id);
              fileRef.current.click();
            }}
            icon={<RiImageAddLine />}
          />
          <Popover
            trigger="click"
            content={() => (
              <Form
                layout="vertical"
                onFinish={async (values) => {
                  try {
                    const res = await createDiscount({
                      id: record._id,
                      body: { percent: Number(values.percent) },
                    }).unwrap();
                    notification.success({ message: res.message });
                  } catch (err) {
                    console.log(err);
                    notification.error({
                      message: err.data.message,
                      description: "",
                    });
                  }
                }}
              >
                <Form.Item
                  name="percent"
                  rules={[{ required: true, message: "Chegirma foizi" }]}
                  label="Chegirma foizda"
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Saqlash</Button>
                </Form.Item>
              </Form>
            )}
          >
            <Button
              disabled={record.discount_log.find((i) => i.status === "active")}
              icon={<TbRosetteDiscount size={20} />}
            />
          </Popover>
          <Button
            disabled={!record.discount_log.find((i) => i.status === "active")}
            icon={<TbRosetteDiscountOff size={20} />}
            onClick={async () => {
              try {
                const activeDiscountIndex = record.discount_log.find(
                  (i) => i.status === "active"
                )._id;

                if (activeDiscountIndex === -1) return;

                const res = await removeDiscount({
                  product: record._id,
                  discount_index: activeDiscountIndex,
                }).unwrap();

                notification.success({ message: res.message });
              } catch (err) {
                console.log(err);
                notification.error({
                  message: err?.data?.message || "Xatolik yuz berdi",
                  description: "",
                });
              }
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="products">
      <Modal
        title="Rasmlar"
        open={imageModal}
        footer={null}
        width={1280}
        onCancel={() => {
          setImageLog({});
          setImageModal(false);
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {imageLog.image_log?.map((item, index) => (
            <Badge.Ribbon key={index} text={item.isMain ? "Asosiy" : ""}>
              <Card
                title={
                  <Space>
                    <Button
                      disabled={item.isMain}
                      onClick={async () => {
                        try {
                          await setImageToMain({
                            product: imageLog._id,
                            image_index: index,
                          });
                          setImageLog({});
                          setImageModal(false);
                        } catch (err) {
                          console.log(err);
                          notification.error({
                            message: "Rasmni belgilashda xatolik",
                          });
                        }
                      }}
                      icon={<FaHome />}
                    />
                    <Button
                      disabled={item.isMain}
                      onClick={async () => {
                        try {
                          await deleteImageInProduct({
                            product: imageLog._id,
                            image_index: index,
                          });
                          setImageLog({});
                          setImageModal(false);
                        } catch (err) {
                          console.log(err);
                          notification.error({
                            message: "Rasmni o'chirishda xatolik",
                          });
                        }
                      }}
                      icon={<FaXmark />}
                      danger
                      type="dashed"
                    />
                  </Space>
                }
                size="small"
                style={{ width: 200 }}
              >
                <img
                  src={item.image_url}
                  alt=""
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "contain",
                    borderRadius: 4,
                  }}
                />
              </Card>
            </Badge.Ribbon>
          ))}
        </div>
      </Modal>
      <input
        accept="image/*"
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onClick={(e) => {
          e.target.value = null;
        }}
        onChange={async (e) => {
          try {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);
            const res = await insertImageToProduct({
              id: insertingProduct,
              formData,
            }).unwrap();
            notification.success({ message: res.message, description: "" });
          } catch (err) {
            console.log(err);
            notification.error(err.data.message);
          }
        }}
      />
      <Input.Search
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tovar nomi bilan qidirish"
        style={{ width: "400px", padding: "5px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={isLoading}
        size="small"
      />
    </div>
  );
};

export default Products;

import { useRef, useState } from "react";
import {
  Upload,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  message,
  Checkbox,
} from "antd";
import { FaX } from "react-icons/fa6";
import { useCreateProductMutation } from "../context/services/product.service";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ProductAdd = () => {
  const [additionals, setAdditionals] = useState([]);
  const [newAdditional, setNewAdditional] = useState("");
  const [fileList, setFileList] = useState([]);
  const [showNutrition, setShowNutrition] = useState(true);

  const [createProduct] = useCreateProductMutation();
  const formRef = useRef();

  const handleAddAdditional = () => {
    if (newAdditional.trim()) {
      setAdditionals([...additionals, newAdditional.trim()]);
      setNewAdditional("");
    }
  };

  const handleRemoveAdditional = (index) => {
    setAdditionals(additionals.filter((_, i) => i !== index));
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Agar showNutrition false bo‘lsa, nutritional_value ni kiritmaymiz
        if (key === "nutritional_value" && !showNutrition) return;

        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(`${key}.${subKey}`, subValue);
        });
      } else {
        formData.append(key, value);
      }
    });

    additionals.forEach((item) => formData.append("additionals[]", item));
    fileList.forEach((file) => {
      formData.append("image_log", file.originFileObj);
    });

    try {
      await createProduct(formData).unwrap();
      message.success("Mahsulot muvaffaqiyatli qo'shildi");
      formRef.current.resetFields();
      setAdditionals([]);
      setFileList([]);
      setShowNutrition(true);
    } catch (err) {
      console.error("Xatolik:", err);
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="product-add">
      <div className="product-add-form">
        <Form
          layout="vertical"
          onFinish={onFinish}
          ref={formRef}
          autoComplete="off"
          style={{ display: "flex", gap: "15px" }}
        >
          <div className="product-add-grid">
            <Form.Item
              label="Tovar nomi"
              name="product_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Tovar tavsifi" name="product_description">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Tovar tarkibi" name="product_ingredients">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Tovar birligi va tavsifi"
              style={{ gridColumn: "span 2" }}
            >
              <div style={{ display: "flex", gap: 16, width: "100%" }}>
                <Form.Item name="unit" rules={[{ required: true }]} noStyle>
                  <Select placeholder="Tovar birligi" style={{ width: "100%" }}>
                    <Select.Option value="dona">Dona</Select.Option>
                    <Select.Option value="gr">Kilogramm</Select.Option>
                    <Select.Option value="litr">Litr</Select.Option>
                    <Select.Option value="sm">Santimetr</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="unit_description"
                  rules={[{ required: true }]}
                  noStyle
                >
                  <Input
                    placeholder="Birlik tavsifi"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="expiration"
                  rules={[{ type: "number", min: 0 }]}
                  noStyle
                >
                  <InputNumber
                    placeholder="Yaroqlilik kunlari"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item label="Sotish narxi" name="selling_price">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Kategoriya" style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", gap: 16, width: "100%" }}>
                <Form.Item name="category" rules={[{ required: true }]} noStyle>
                  <Select placeholder="Kategoriya" style={{ width: "100%" }}>
                    <Select.Option value="688cab0f66ac4bb5a48e7651">
                      Ichimliklar
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="subcategory"
                  rules={[{ required: true }]}
                  noStyle
                >
                  <Select placeholder="Subkategoriya" style={{ width: "100%" }}>
                    <Select.Option value="688cac0c66ac4bb5a48e7655">
                      Gazli ichimliklar
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>
                  <Form.Item label="Qo'shimcha ma'lumotlar">
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={newAdditional}
                  onChange={(e) => setNewAdditional(e.target.value)}
                />
                <Button type="primary" onClick={handleAddAdditional}>
                  Qo'shish
                </Button>
              </Space.Compact>
              <div style={{ marginTop: "8px" }}>
                {additionals.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: 4,
                    }}
                  >
                    <span>{item}</span>
                    <Button
                      icon={<FaX />}
                      size="small"
                      type="text"
                      danger
                      onClick={() => handleRemoveAdditional(index)}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
            <Form.Item
              style={{ gridColumn: "span 2", marginBottom: 0 }}
              label={
                <Checkbox
                  checked={showNutrition}
                  onChange={(e) => setShowNutrition(e.target.checked)}
                >
                  100 gr tarkibida
                </Checkbox>
              }
            >
              {showNutrition && (
                <div style={{ display: "flex", gap: 16, width: "100%" }}>
                  <Form.Item
                    name={["nutritional_value", "kkal"]}
                    rules={[{ type: "number" }]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="Kkal"
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["nutritional_value", "protein"]}
                    rules={[{ type: "number" }]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="Oqsillar"
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["nutritional_value", "fat"]}
                    rules={[{ type: "number" }]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="Yog'lar"
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["nutritional_value", "uglevod"]}
                    rules={[{ type: "number" }]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="Uglevodlar"
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              )}
            </Form.Item>
          </div>
          <div className="product-add-grid">
      

            <Form.Item label="Rasmlar">
              <Upload
                listType="picture-card"
                multiple
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
              >
                {fileList.length < 8 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Yuklash</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Kiritish
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProductAdd;

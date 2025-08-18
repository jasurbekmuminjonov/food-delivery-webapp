import { useEffect, useState } from "react";
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
import {
  useCreateProductMutation,
  useEditProductMutation,
  useGetProductsQuery,
} from "../context/services/product.service";
import { PlusOutlined } from "@ant-design/icons";
import { MdOutlinePreview } from "react-icons/md";
import { cloneElement } from "react";
import { useGetCategoriesQuery } from "../context/services/category.service";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const ProductAdd = () => {
  const [additionals, setAdditionals] = useState([]);
  const [newAdditional, setNewAdditional] = useState("");
  const [fileList, setFileList] = useState([]);
  const [showNutrition, setShowNutrition] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState({});
  const { data: products = [] } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [editProduct] = useEditProductMutation();
  const [createProduct] = useCreateProductMutation();

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && products.length > 0) {
      const product = products.find((p) => p._id === id);
      if (product) {
        const {
          product_name,
          product_description,
          product_ingredients,
          nutritional_value,
          selling_price,
          additionals = [],
          unit,
          unit_description,
          starting_quantity,
          expiration,
          category,
          subcategory,
        } = product;

        form.setFieldsValue({
          product_name,
          product_description,
          product_ingredients,
          nutritional_value,
          selling_price,
          unit,
          unit_description,
          starting_quantity,
          expiration,
          category: category._id,
          subcategory: subcategory._id,
        });

        setAdditionals(additionals);
        setShowNutrition(!!nutritional_value);
        const cat = categories.find((cat) => cat._id === category._id);

        setSelectedCategory(cat);
      }
    }
  }, [id, products, categories, form, isEdit]);

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
      if (isEdit) {
        await editProduct({ id, body: formData }).unwrap();
        message.success("Mahsulot muvaffaqiyatli tahrirlandi");
      } else {
        await createProduct(formData).unwrap();
        message.success("Mahsulot muvaffaqiyatli qo'shildi");
      }
      form.resetFields();
      setAdditionals([]);
      setFileList([]);
      setShowNutrition(true);
      navigate("/product");
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
          form={form}
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
                    <Select.Option value="kg">Kilogramm</Select.Option>
                    <Select.Option value="litr">Litr</Select.Option>
                    <Select.Option value="m">Metr</Select.Option>
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
                  name="starting_quantity"
                  rules={[{ required: true }]}
                  noStyle
                >
                  <InputNumber
                    placeholder="Standart miqdor"
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
                  <Select
                    onChange={(id) => {
                      const category = categories.find((cat) => cat._id === id);
                      setSelectedCategory(category);
                      form.setFieldsValue({
                        category: id,
                        subcategory: undefined,
                      });
                    }}
                    value={form.getFieldValue("category")}
                    placeholder="Kategoriya"
                    style={{ width: "100%" }}
                  >
                    {categories.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.category}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="subcategory"
                  rules={[{ required: true }]}
                  noStyle
                >
                  <Select
                    disabled={!selectedCategory}
                    placeholder="Subkategoriya"
                    style={{ width: "100%" }}
                  >
                    {selectedCategory?.subcategories?.map((item) => (
                      <Select.Option value={item._id}>
                        {item.subcategory}
                      </Select.Option>
                    ))}
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
                <Button  onClick={handleAddAdditional}>
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
          </div>
          <div className="product-add-grid">
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
            <br />
            {!isEdit && (
              <Form.Item label="Rasmlar">
                <Upload
                  listType="picture-card"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  itemRender={(originNode, file, currFileList) => {
                    const index = currFileList.findIndex(
                      (f) => f.uid === file.uid
                    );

                    const styledNode =
                      index === 0
                        ? cloneElement(originNode, {
                            style: {
                              ...originNode.props.style,
                              border: "1px solid #1677ff",
                            },
                          })
                        : originNode;

                    return (
                      <div style={{ position: "relative" }}>
                        {styledNode}

                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: 4,
                            backgroundColor: "rgba(0,0,0,0)",
                          }}
                        >
                          <div style={{ textAlign: "right", color: "#fff" }}>
                            {index !== 0 && (
                              <Button
                                size="small"
                                onClick={() => {
                                  const newList = [...currFileList];
                                  const selected = newList.splice(index, 1)[0];
                                  newList.unshift(selected);
                                  setFileList(newList);
                                }}
                              >
                                <MdOutlinePreview />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                >
                  {fileList.length < 8 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Yuklash</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Saqlash
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProductAdd;

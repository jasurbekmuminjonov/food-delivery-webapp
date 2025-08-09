import { Button, Form, Input, notification, Select } from "antd";
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useCreateSubcategoryMutation,
  useGetCategoriesQuery,
} from "../context/services/category.service";

const CategoryAdd = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState("category");
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [createSubcategory] = useCreateSubcategoryMutation();

  const handleSubmit = async (values) => {
    try {
      if (type === "category") {
        const payload = { category: values.category };
        await createCategory(payload).unwrap();
        notification.success({ message: "Kategoriya qo'shildi" });
      } else {
        const payload = {
          category_id: values.category_id,
          subcategory: values.subcategory,
        };
        await createSubcategory(payload).unwrap();
        notification.success({ message: "Subkategoriya qo'shildi" });
      }
      // form.resetFields();
    } catch (err) {
      notification.error({
        message: "Xatolik",
        description: err?.data?.message || "Serverda xatolik yuz berdi",
      });
    }
  };

  return (
    <div className="category-add">
      <div className="category-add-form">
        <Form autoComplete="off" form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item>
            <Select value={type} onChange={setType}>
              <Select.Option value="category">Kategoriya</Select.Option>
              <Select.Option value="subcategory">Subkategoriya</Select.Option>
            </Select>
          </Form.Item>
          {type === "subcategory" && (
            <Form.Item
              rules={[{ required: true, message: "Tanlash majburiy" }]}
              name="category_id"
              label="Bog'langan kategoriya"
            >
              <Select>
                {categories.map((item) => (
                  <Select.Option value={item._id}>
                    {item.category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name={type}
            label="Nomi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CategoryAdd;

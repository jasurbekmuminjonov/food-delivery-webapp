import { Button, Form, Input, notification, Select } from "antd";
import { FaSave } from "react-icons/fa";
import {
  useCreateCourierMutation,
  useEditCourierMutation,
  useGetCouriersQuery,
} from "../context/services/courier.service";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const CourierAdd = () => {
  const [form] = Form.useForm();
  const { data: couriers = [] } = useGetCouriersQuery();
  const navigate = useNavigate();
  const [createCourier, { isLoading }] = useCreateCourierMutation();
  const [editCourier, { isLoading: editLoading }] = useEditCourierMutation();
  const { id } = useParams();
  useEffect(() => {
    if (id && couriers.length) {
      const courier = couriers.find((c) => c._id === id);

      if (!courier) {
        notification.error({ message: "Kuryer topilmadi" });
        return (window.location.href = "/courier/add");
      }

      form.setFieldsValue({
        courier_name: courier.courier_name,
        courier_phone: courier.courier_phone,
        courier_login: courier.courier_login,
        courier_gender: courier.courier_gender,
      });
    }
  }, [id, couriers, form]);

  async function handleSubmitForm(values) {
    try {
      let res;
      if (id) {
        res = await editCourier({ id, body: values }).unwrap();
      } else {
        res = await createCourier(values).unwrap();
      }
      notification.success({ message: res.message });
      form.resetFields();
      navigate("/courier");
    } catch (err) {
      console.log(err);
      notification.error({ message: err.data.message, description: "" });
    }
  }
  return (
    <div className="courier-add">
      <Form
       autoComplete="off"
        form={form}
        layout="vertical"
        style={{ width: "50%" }}
        onFinish={handleSubmitForm}
      >
        <Form.Item
          rules={[{ required: true, message: "Majburiy!" }]}
          name="courier_name"
          label="Kuryer ismi"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Majburiy!" }]}
          name="courier_phone"
          label="Kuryer telefon raqami"
        >
          <Input placeholder="+998931234567" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Majburiy!" }]}
          name="courier_login"
          label="Kuryer logini"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[!id ? { required: true, message: "Majburiy!" } : {}]}
          name="courier_password"
          label="Kuryer paroli"
        >
          <Input.Password disabled={id} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Majburiy!" }]}
          name="courier_gender"
          label="Kuryer jinsi"
        >
          <Select>
            <Select.Option value="male">Erkak</Select.Option>
            <Select.Option value="female">Ayol</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            loading={isLoading || editLoading}
            type="primary"
            htmlType="submit"
            icon={<FaSave />}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CourierAdd;

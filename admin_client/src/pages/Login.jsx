import { useLoginAdminMutation } from "../context/services/admin.service";
import { notification, Form, Input, Button, Typography } from "antd";
import { LuLogIn } from "react-icons/lu";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loginAdmin] = useLoginAdminMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await loginAdmin({
        admin_login: values.admin_login,
        admin_password: values.admin_password,
      }).unwrap();
      if (res) {
        localStorage.setItem("token", res);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: err?.data?.message || "Kirishda xatolik",
        description: "",
      });
    }
  };

  return (
    <div
      className="login"
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        className="login-form"
      >
        <Title level={3}>Hisobingizga kiring</Title>

        <Form.Item
          label="Login"
          name="admin_login"
          rules={[{ required: true, message: "Iltimos, loginni kiriting!" }]}
        >
          <Input placeholder="Login" />
        </Form.Item>

        <Form.Item
          label="Parol"
          name="admin_password"
          rules={[{ required: true, message: "Iltimos, parolni kiriting!" }]}
        >
          <Input.Password placeholder="Parol" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block icon={<LuLogIn />}>
            Kirish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

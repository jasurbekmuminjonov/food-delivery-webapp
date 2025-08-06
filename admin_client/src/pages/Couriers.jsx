import { Button, Form, Input, notification, Popover, Space, Table } from "antd";
import {
  useEditCourierPasswordMutation,
  useGetCouriersQuery,
} from "../context/services/courier.service";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";
import { FaSave, FaUser } from "react-icons/fa";

const Couriers = () => {
  const { data: couriers = [], isLoading } = useGetCouriersQuery();
  const [editCourierPassword, { isLoading: passwordLoading }] =
    useEditCourierPasswordMutation();
  const navigate = useNavigate();
  const columns = [
    { title: "Kuryer ismi", dataIndex: "courier_name" },
    { title: "Kuryer tel raqami", dataIndex: "courier_phone" },
    {
      title: "Kuryer jinsi",
      dataIndex: "courier_gender",
      render: (text) => (text === "male" ? "Erkak" : "Ayol"),
    },
    { title: "Kuryer logini", dataIndex: "courier_login" },
    { title: "Kuryer paroli", render: () => <span>******</span> },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => navigate(`/courier/add/${record._id}`)}
            icon={<MdEdit />}
          />
          <Popover
            trigger="click"
            content={() => (
              <Form
               autoComplete="off"
                layout="vertical"
                size="small"
                onFinish={async (values) => {
                  try {
                    const res = await editCourierPassword({
                      id: record._id,
                      body: values,
                    }).unwrap();
                    notification.success({
                      message: res.message,
                      description: "",
                    });
                  } catch (err) {
                    console.log(err);
                    notification.error({
                      message: err.data.message,
                      description: "",
                    });
                  }
                }}
              >
                <Form.Item name="courier_password" label="Yangi parol">
                  <Input.Password size="small" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<FaSave />}>
                    O'zgartirish
                  </Button>
                </Form.Item>
              </Form>
            )}
          >
            <Button icon={<GrUserAdmin />} />
          </Popover>
          <Button icon={<FaUser />} />
        </Space>
      ),
    },
  ];
  return (
    <div className="courier">
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={couriers}
        size="small"
      />
    </div>
  );
};

export default Couriers;

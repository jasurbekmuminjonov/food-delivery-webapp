import { useState, useMemo } from "react";
import { Table, Input, Select, Button, Space, Tag } from "antd";
import {
  useBlockUserToggleMutation,
  useGetUsersQuery,
} from "../context/services/admin.service";

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [userBlockToggle] = useBlockUserToggleMutation();

  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.user_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.user_phone?.toLowerCase().includes(searchText.toLowerCase());
      const matchesGender = genderFilter
        ? u.user_gender === genderFilter
        : true;
      return matchesSearch && matchesGender;
    });
  }, [users, searchText, genderFilter]);

  const handleBlockToggle = async (id) => {
    try {
      await userBlockToggle(id);
    } catch (error) {
      console.error("Block toggle failed", error);
    }
  };

  const columns = [
    {
      title: "Ismi",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Telefon",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "Jinsi",
      dataIndex: "user_gender",
      key: "user_gender",
      render: (gender) =>
        gender === "male" ? (
          <Tag color="blue">Erkak</Tag>
        ) : (
          <Tag color="pink">Ayol</Tag>
        ),
    },
    {
      title: "Telegram ID",
      dataIndex: "telegram_id",
      key: "telegram_id",
    },
    {
      title: "Holati",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked) =>
        isBlocked ? (
          <Tag color="red">Bloklangan</Tag>
        ) : (
          <Tag color="green">Faol</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type={record.isBlocked ? "default" : "primary"}
          danger={record.isBlocked}
          onClick={() => handleBlockToggle(record._id)}
        >
          {record.isBlocked ? "Ochish" : "Bloklash"}
        </Button>
      ),
    },
  ];

  return (
    <div className="users-page">
      <Space style={{ margin: "5px 5px" }}>
        <Search
          placeholder="Ismi va tel raqami bo'yicha qidirish"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Jinsi bo'yicha filter"
          allowClear
          style={{ width: 150 }}
          onChange={(val) => setGenderFilter(val || "")}
        >
          <Option value="male">Erkak</Option>
          <Option value="female">Ayol</Option>
        </Select>
      </Space>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Users;

import React, { useEffect, useState } from "react";
import { Layout, Button, Input, List, Modal, message } from "antd";
import {
  getTodolistByusername,
  createTodoList,
  deleteTodoList,
} from "../api/TodoService";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const Sidebar = ({ onSelectList, selectedList, onListDeleted }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [todoLists, setTodoLists] = useState([]);
  const [newTodoListName, setNewTodoListName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchTodoLists = async () => {
    try {
      const lists = await getTodolistByusername();
      console.log("Fetched to-do lists:", lists);
      if (!Array.isArray(lists)) {
        throw new Error("Expected an array of to-do lists");
      }
      setTodoLists(lists);
    } catch (error) {
      message.error("Failed to fetch to-do lists.");
      console.error("Fetch error:", error);
    }
  };

  const handleCreateTodoList = async () => {
    if (!newTodoListName.trim()) {
      message.warning("Please enter a valid to-do list name.");
      return;
    }
    try {
      await createTodoList(newTodoListName);
      message.success("To-do list created successfully!");
      setIsModalVisible(false);
      setNewTodoListName("");
      fetchTodoLists();
    } catch (error) {
      message.error("Failed to create to-do list.");
      console.error("Create error:", error);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewTodoListName("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodoLists();
    }
  }, []);

  return (
    <Sider
      width={300}
      style={{
        background: "#fff",
        padding: "16px",
        overflow: "auto",
        height: "100vh",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "16px", width: "100%" }}
      >
        Create New To-Do List
      </Button>
      <List
        bordered
        dataSource={todoLists}
        renderItem={(item) => (
          <List.Item
            style={{
              cursor: "pointer",
              background:
                selectedList && selectedList.title === item.title
                  ? "#e6f7ff"
                  : undefined,
            }}
            onClick={() => onSelectList(item)}
          >
            {/* {item.listName} */}
            <span>{item.listName}</span>
            <Button
              danger
              type="link"
              size="small"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await deleteTodoList(item.id);
                  message.success("To-do list deleted!");
                  fetchTodoLists();
                } catch (error) {
                  message.error("Failed to delete to-do list.");
                }
              }}
            >
              Delete
            </Button>
          </List.Item>
        )}
        style={{ marginBottom: "16px" }}
      />
      <Modal
        title="Create New To-Do List"
        visible={isModalVisible}
        onOk={handleCreateTodoList}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter to-do list name"
          value={newTodoListName}
          onChange={(e) => setNewTodoListName(e.target.value)}
        />
      </Modal>
    </Sider>
  );
};

export default Sidebar;

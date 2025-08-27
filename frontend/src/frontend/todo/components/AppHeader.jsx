import React, { useState } from "react";
import { Layout, Input, Button, Avatar, Space, List, Modal, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authAction";
import { searchTasksByContent, updateTodo } from "../api/TodoService";
import user_image from "../assets/user_image.jpg";

const { Header } = Layout;

const AppHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();
  const searchResultsRef = React.useRef(null); // Reference for the search results container

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user) || {
    username: "User",
    profilePic: user_image,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // New useEffect hook to handle clicks outside the search results list
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // If the clicked element is not within the search results container
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearchResults([]); // Close the list by clearing the results
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResultsRef]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      console.log("Searching for:", searchQuery);
      const results = await searchTasksByContent(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    form.setFieldsValue({
      title: task.title || task.name,
      description: task.description,
      targetDate: task.targetDate,
    });
  };

  const handleUpdateTask = async () => {
    setUpdateLoading(true);
    try {
      const values = await form.validateFields();
      await updateTodo(selectedTask.id, {
        ...selectedTask,
        ...values,
      });
      Modal.success({ content: "Task updated!" });
      setSelectedTask(null);
      setSearchResults((prev) =>
        prev.map((t) => (t.id === selectedTask.id ? { ...t, ...values } : t))
      );
    } catch (error) {
      Modal.error({ content: "Failed to update task." });
    }
    setUpdateLoading(false);
  };

  const handleClick = () => {
    navigate("/dashboard");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
        position: "relative",
        justifyContent: "space-between", // Add this line
      }}
    >
      <Button
        type="text"
        onClick={handleClick}
        style={{ marginRight: 16, fontSize: 24, fontWeight: "bold" }}
      >
        Todo
      </Button>
      <Input.Search
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        enterButton="Search"
        loading={searchLoading}
        style={{ maxWidth: 400 }}
      />
      <Space>
        {isAuthenticated ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleProfileClick}
            >
              <Avatar
                src={user.profilePic}
                size={40}
                style={{ marginRight: 8 }}
              />
              <span>{user.username}</span>
            </div>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Space>
      {/* Search Results Dropdown/List */}
      {searchResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: "25%",
            width: 400,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            borderRadius: 4,
            maxHeight: 300,
            overflowY: "auto",
          }}
          ref={searchResultsRef} // Attach the ref here
        >
          <List
            size="small"
            dataSource={searchResults}
            renderItem={(task) => (
              <List.Item
                style={{ cursor: "pointer" }}
                onClick={() => handleTaskClick(task)}
              >
                {task.title || task.name}
              </List.Item>
            )}
          />
        </div>
      )}
      {/* Task Modal for update */}
      <Modal
        title="Task Details"
        visible={!!selectedTask}
        onCancel={() => setSelectedTask(null)}
        onOk={handleUpdateTask}
        confirmLoading={updateLoading}
        destroyOnClose
      >
        {selectedTask && (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter task name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Due Date" name="targetDate">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Header>
  );
};

export default AppHeader;

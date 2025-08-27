import React, { useState, useEffect } from "react";
import { Duration } from "luxon";
import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Layout,
  List,
  Spin,
  message,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Checkbox,
  Select,
} from "antd";
import Sidebar from "./Sidebar";
import {
  getTasksByTodoListName,
  createTodo,
  updateTodo,
  deleteTodo,
  createRepeat,
  clockIn,
  clockOut,
} from "../api/TodoService";

const { Content } = Layout;
const { Option } = Select;

const DashBoard = () => {
  const [selectedList, setSelectedList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timers, setTimers] = useState({}); // { [taskId]: { running: bool, start: Date, elapsed: number, clockEntryId: string } }
  const [editForm] = Form.useForm();
  const [updatingTask, setUpdatingTask] = useState(false);
  useEffect(() => {
    if (selectedTask) {
      editForm.setFieldsValue({
        title: selectedTask.title || selectedTask.name,
        description: selectedTask.description,
        targetDate: selectedTask.targetDate,
      });
    }
  }, [selectedTask, editForm]);
  // Update task handler
  const handleUpdateTask = async () => {
    try {
      setUpdatingTask(true);
      const values = await editForm.validateFields();
      await updateTodo(selectedTask.id, {
        ...selectedTask,
        ...values,
      });
      message.success("Task updated!");
      setSelectedTask(null);
      handleSelectList(selectedList); // Refresh tasks
    } catch (error) {
      message.error("Failed to update task.");
    }
    setUpdatingTask(false);
  };
  const [form] = Form.useForm();

  // Start timer for a task
  const handleStartTimer = async (task) => {
    try {
      const res = await clockIn(task.id);
      setTimers((prev) => ({
        ...prev,
        [task.id]: {
          running: true,
          start: Date.now(),
          elapsed: 0,
          clockEntryId: res.id, // Save clock entry id for clockOut
        },
      }));
    } catch (error) {
      message.error("Failed to start timer.");
    }
  };
  const handleListDeleted = (deletedList) => {
    setSelectedList(null);
    setTasks([]);
  };
  // Stop timer for a task
  const handleStopTimer = async (task) => {
    try {
      const timer = timers[task.id];
      if (!timer || !timer.clockEntryId) return;
      await clockOut(timer.clockEntryId);
      setTimers((prev) => ({
        ...prev,
        [task.id]: {
          ...prev[task.id],
          running: false,
          elapsed: (Date.now() - timer.start) / 1000, // seconds
        },
      }));
      message.success("Timer stopped!");
    } catch (error) {
      message.error("Failed to stop timer.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((taskId) => {
          if (updated[taskId].running) {
            updated[taskId].elapsed =
              (Date.now() - updated[taskId].start) / 1000;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleComplete = async (task) => {
    try {
      await updateTodo(task.id, {
        ...task,
        done: !task.done,
      });
      handleSelectList(selectedList); // Refresh tasks
    } catch (error) {
      message.error("Failed to update task.");
    }
  };

  const handleCreateTaskOk = async () => {
    try {
      const values = await form.validateFields();
      setCreatingTask(true);

      // Prepare repeat config if needed
      let repeatConfig = null;
      if (values.isRepeat) {
        repeatConfig = {
          intervals: values.interval || null,
          repeateFrequency: values.frequency || null,
          startDate: values.repeatStartDate
            ? values.repeatStartDate.format("YYYY-MM-DD")
            : undefined,
          endDate: values.repeatEndDate
            ? values.repeatEndDate.format("YYYY-MM-DD")
            : undefined,
        };
      }

      const payload = {
        title: values.title,
        description: values.description,
        targetDate: values.targetDate
          ? values.targetDate.format("YYYY-MM-DD")
          : undefined,
        isRepeat: !!values.isRepeat,
        repeat: repeatConfig,
      };

      if (values.isRepeat) {
        let todo = await createTodo(selectedList.listName, payload);
        repeatConfig = {
          ...repeatConfig,
          taskId: todo.id, // Associate repeat with the created todo
        };
        let todos = await createRepeat(repeatConfig);
      } else {
        await createTodo(selectedList.listName, payload);
      }

      message.success("Task created!");
      setShowCreateModal(false);
      setCreatingTask(false);
      handleSelectList(selectedList); // Refresh tasks
    } catch (error) {
      message.error("Failed to create task.");
      setCreatingTask(false);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await deleteTodo(task.id);
      message.success("Task deleted!");
      handleSelectList(selectedList); // Refresh tasks
    } catch (error) {
      message.error("Failed to delete task.");
    }
  };

  const handleSelectList = async (list) => {
    setSelectedList(list);
    setLoadingTasks(true);
    try {
      const taskData = await getTasksByTodoListName(
        list.title || list.listName
      );
      setTasks(taskData);
    } catch (error) {
      message.error("Failed to fetch tasks.");
      setTasks([]);
    }
    setLoadingTasks(false);
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
    form.resetFields();
  };

  const handleCreateTaskCancel = () => {
    setShowCreateModal(false);
    form.resetFields();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar
        onSelectList={handleSelectList}
        selectedList={selectedList}
        onListDeleted={handleListDeleted} // Pass the callback
      />{" "}
      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        {/* <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p> */}
        {selectedList && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
            <h2>Tasks in {selectedList.listName || selectedList.title}</h2>
            {loadingTasks ? (
              <Spin />
            ) : (
              <List
                bordered
                dataSource={tasks}
                locale={{ emptyText: "No tasks" }}
                renderItem={(task) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => handleTaskClick(task)}
                    actions={[
                      <Checkbox
                        checked={!!task.done}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleToggleComplete(task)}
                      >
                        Completed
                      </Checkbox>,
                      <Button
                        danger
                        type="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task);
                        }}
                      >
                        Delete
                      </Button>,
                      <Button
                        type={timers[task.id]?.running ? "default" : "primary"}
                        icon={<ClockCircleOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          timers[task.id]?.running
                            ? handleStopTimer(task)
                            : handleStartTimer(task);
                        }}
                      >
                        {timers[task.id]?.running ? "Stop" : "Start"}
                      </Button>,
                      timers[task.id] && (
                        <span>
                          {timers[task.id].elapsed
                            ? `${Math.floor(
                                timers[task.id].elapsed / 60
                              )}m ${Math.floor(timers[task.id].elapsed % 60)}s`
                            : "0m 0s"}
                        </span>
                      ),
                    ]}
                  >
                    {task.name || task.title}
                  </List.Item>
                )}
                style={{ background: "#fff" }}
              />
            )}
          </>
        )}

        {/* Task Details Modal */}
        <Modal
          title="Task Details"
          visible={!!selectedTask}
          onCancel={() => setSelectedTask(null)}
          onOk={handleUpdateTask}
          confirmLoading={updatingTask}
          destroyOnClose
          maskClosable={true}
        >
          {selectedTask && (
            <Form form={editForm} layout="vertical">
              <Form.Item
                label="Name"
                name="title"
                rules={[{ required: true, message: "Please enter task name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item label="Due Date" name="targetDate">
                <Input />
              </Form.Item>
              {/* You can add more fields here if needed */}
            </Form>
          )}
          {selectedTask && (
            <div>
              <p>
                <strong>Duration:</strong>{" "}
                {Duration.fromISO(selectedTask.duration).toFormat("hh:mm:ss")}
              </p>
              {selectedTask.isRepeat && selectedTask.repeat && (
                <>
                  <p>
                    <strong>Interval:</strong> {selectedTask.repeat.interval}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {selectedTask.repeat.frequency}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {selectedTask.repeat.startDate}
                  </p>
                  <p>
                    <strong>End Date:</strong> {selectedTask.repeat.endDate}
                  </p>
                </>
              )}
            </div>
          )}
        </Modal>

        {/* Create Task Modal */}
        <Modal
          title="Create Task"
          visible={showCreateModal}
          onOk={handleCreateTaskOk}
          onCancel={handleCreateTaskCancel}
          confirmLoading={creatingTask}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="title"
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
            <Form.Item
              label="targetDate"
              name="targetDate"
              rules={[{ required: true, message: "Please select due date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="isRepeat" valuePropName="checked">
              <Checkbox>Is Repeat</Checkbox>
            </Form.Item>
            {/* Repeat options, shown only if isRepeat is checked */}
            <Form.Item
              shouldUpdate={(prev, curr) =>
                prev.isRepeat !== curr.isRepeat ||
                prev.frequency !== curr.frequency
              }
            >
              {() =>
                form.getFieldValue("isRepeat") ? (
                  <>
                    <Form.Item
                      label="Frequency"
                      name="frequency"
                      rules={[
                        {
                          required: true,
                          message: "Please select frequency",
                        },
                      ]}
                    >
                      <Select allowClear>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                    {form.getFieldValue("frequency") === "other" && (
                      <Form.Item
                        label="Interval"
                        name="interval"
                        rules={[
                          {
                            required: true,
                            message: "Please enter interval",
                          },
                        ]}
                      >
                        <Input type="number" min={1} allowClear />
                      </Form.Item>
                    )}
                    <Form.Item
                      label="Start Date"
                      name="repeatStartDate"
                      rules={[
                        { required: true, message: "Please select start date" },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label="End Date"
                      name="repeatEndDate"
                      rules={[
                        { required: true, message: "Please select end date" },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DashBoard;

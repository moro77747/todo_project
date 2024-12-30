import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../redux/actions/taskActions";

const TaskForm = ({ task }) => {
  const [updatedTask, setUpdatedTask] = useState(task);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTask(task.id, updatedTask));
  };

  const handleChange = (e) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={updatedTask.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={updatedTask.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dueDate"
        value={updatedTask.dueDate}
        onChange={handleChange}
      />
      <select name="status" value={updatedTask.status} onChange={handleChange}>
        <option value="todo">To Do</option>
        <option value="inProgress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Update Task</button>
    </form>
  );
};

export default TaskForm;

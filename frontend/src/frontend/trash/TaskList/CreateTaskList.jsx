import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTaskList } from "../redux/actions/taskListActions";

const CreateTaskList = ({ taskListName }) => {
  const [newTaskListName, setNewTaskListName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTaskList(newTaskListName));
    setNewTaskListName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={`New ${taskListName} Task List`}
        value={newTaskListName}
        onChange={(e) => setNewTaskListName(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateTaskList;

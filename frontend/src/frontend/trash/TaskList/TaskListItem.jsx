import React from "react";
import { Link } from "react-router-dom";

const TaskListItem = ({ task }) => {
  return (
    <li>
      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
    </li>
  );
};

export default TaskListItem;

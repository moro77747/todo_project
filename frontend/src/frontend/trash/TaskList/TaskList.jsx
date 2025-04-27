import React from "react";
import TaskListItem from "./TaskListItem";

const TaskList = ({ tasks }) => {
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

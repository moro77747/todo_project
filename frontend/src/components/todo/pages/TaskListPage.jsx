import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../redux/actions/taskActions";
import TaskList from "../components/TaskList/TaskList";
import CreateTaskList from "../components/TaskList/CreateTaskList";

const TaskListPage = ({ taskListName }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskReducer.tasks);

  useEffect(() => {
    dispatch(getTasks(taskListName));
  }, [dispatch, taskListName]);

  return (
    <div>
      <h1>{taskListName} Task List</h1>
      <CreateTaskList taskListName={taskListName} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default TaskListPage;

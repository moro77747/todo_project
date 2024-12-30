import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTask } from "../redux/actions/taskActions";
import TaskDetails from "../components/Task/TaskDetails";
import TaskForm from "../components/Task/TaskForm";

const TaskPage = ({ taskId }) => {
  const dispatch = useDispatch();
  const task = useSelector((state) => state.taskReducer.currentTask);

  useEffect(() => {
    dispatch(getTask(taskId));
  }, [dispatch, taskId]);

  return (
    <div>
      <h1>Task Details</h1>
      <TaskDetails task={task} />
      <TaskForm task={task} />
    </div>
  );
};

export default TaskPage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../redux/actions/taskActions";
import TaskList from "../components/TaskList/TaskList";

const HomePage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.taskReducer.tasks);

  useEffect(() => {
    dispatch(getTasks("default"));
  }, [dispatch]);

  return (
    <div>
      <h1>Home Page</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default HomePage;

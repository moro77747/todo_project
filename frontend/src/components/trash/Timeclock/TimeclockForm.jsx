import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { startTimer, stopTimer } from "../redux/actions/timeclockActions";

const TimeclockForm = () => {
  const [taskId, setTaskId] = useState("");
  const dispatch = useDispatch();

  const handleStartTimer = () => {
    dispatch(startTimer(taskId));
  };

  const handleStopTimer = () => {
    dispatch(stopTimer());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Task ID"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      />
      <button onClick={handleStartTimer}>Start Timer</button>
      <button onClick={handleStopTimer}>Stop Timer</button>
    </div>
  );
};

export default TimeclockForm;

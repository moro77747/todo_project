import React from "react";
import { useSelector } from "react-redux";

const RepeatList = () => {
  const repeats = useSelector((state) => state.repeatReducer.repeats);

  return (
    <div>
      <h2>Repeat List</h2>
      <ul>
        {repeats.map((repeat) => (
          <li key={repeat.id}>{repeat.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RepeatList;

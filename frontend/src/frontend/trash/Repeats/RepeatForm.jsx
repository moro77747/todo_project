import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createRepeat } from "../../todo/redux/actions/repeatActions";

const RepeatForm = () => {
  const [repeatData, setRepeatData] = useState({ title: "", frequency: "" });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRepeat(repeatData));
    setRepeatData({ title: "", frequency: "" });
  };

  const handleChange = (e) => {
    setRepeatData({ ...repeatData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={repeatData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="frequency"
        placeholder="Frequency"
        value={repeatData.frequency}
        onChange={handleChange}
      />
      <button type="submit">Create Repeat</button>
    </form>
  );
};

export default RepeatForm;

import React from "react";
import { useSelector } from "react-redux";
import TaskListItem from "../TaskList/TaskListItem";

const SearchResults = () => {
  const searchResults = useSelector(
    (state) => state.searchReducer.searchResults
  );

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {searchResults.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;

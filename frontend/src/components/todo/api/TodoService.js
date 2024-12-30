import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

export const retrieveAllTodosForUsername = (username) =>
  apiClient.get(`/users/${username}/todos`);
export const signUp = async (values) => {
  const response = await apiClient.post("/users", values);
  // Handle success
  console.log("User registered successfully:", response.data);
  return response.data;
  //   try {
  //     const response = await apiClient.post("/users", values);
  //     // Handle success
  //     console.log("User registered successfully:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error registering user:", error);
  //     throw error; // or handle it as needed
  //   }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`api/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`api/tasks`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

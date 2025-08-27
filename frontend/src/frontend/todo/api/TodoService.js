import axios from "axios";
import store from "../redux/store"; // Import the Redux store
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Add a request interceptor to include the JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token; // Get token directly from store
    if (
      token &&
      !config.url.includes("/authenticate") &&
      !config.url.includes("/users")
    ) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signUp = async (values) => {
  const response = await apiClient.post("/users", values);
  // Handle success
  console.log("User registered successfully:", response.data);
  return response.data;
};

// API to authenticate user and generate JWT token
export const authenticateUser = async (credentials) => {
  try {
    const response = await apiClient.post("/authenticate", credentials);
    console.log("Authentication successful:", response.data);
    return response.data; // This will contain the JWT token
  } catch (error) {
    console.error(
      "Authentication failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateUser = async (values) => {
  const response = await apiClient.put("/users/update", values);
  // Handle success
  console.log("User registered successfully:", response.data);
  return response.data;
};

// API to get tasks by to-do list name
export const getTasksByTodoListName = async (todoListName) => {
  const response = await apiClient.get(`/api/${todoListName}`);
  return response.data;
};

// API to get tasklist by user name
export const getTodolistByusername = async () => {
  const response = await apiClient.post(`/api/tasklists`);
  return response.data;
};

// API to create a new to-do list
export const createTodoList = async (todoListName) => {
  const response = await apiClient.post(`/api/${todoListName}`);
  return response.data;
};

// API to create a new task in a specific to-do list
export const createTodo = async (todoListName, todo) => {
  const response = await apiClient.post(`/api/${todoListName}/todo`, todo);
  return response.data;
};

// API to get a task by its ID
export const getTaskById = async (id) => {
  const response = await apiClient.get(`/api/todos/${id}`);
  return response.data;
};

// API to search tasks by content
export const searchTasksByContent = async (content) => {
  const response = await apiClient.get(`/api/search/${content}`);
  return response.data;
};

// API to search tasks with filters
export const searchTodos = async (filters) => {
  const response = await apiClient.get("/api/todos", { params: filters });
  return response.data;
};

// API to update a task by its ID
export const updateTodo = async (id, updatedTodo) => {
  const response = await apiClient.put(`/api/todos/${id}`, updatedTodo);
  return response.data;
};

// API to delete a task by its ID
export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/api/tasks/${id}`);
  return response.data;
};

// API to delete a tasklist by its ID
export const deleteTodoList = async (id) => {
  const response = await apiClient.delete(`/api/tasklists/${id}`);
  return response.data;
};

// API to clock in for a task
export const clockIn = async (todoId) => {
  try {
    const response = await apiClient.post("/api/timeclock/clock-in", null, {
      params: { todoId },
    });
    console.log("Clock-in successful:", response.data);
    return response.data; // Returns the created ClockEntries object
  } catch (error) {
    console.error("Clock-in failed:", error.response?.data || error.message);
    throw error;
  }
};

// API to clock out for a task
export const clockOut = async (clockEntryId) => {
  try {
    const response = await apiClient.post("/api/timeclock/clock-out", null, {
      params: { clockEntryId },
    });
    console.log("Clock-out successful:", response.data);
    return response.data; // Returns the updated ClockEntries object
  } catch (error) {
    console.error("Clock-out failed:", error.response?.data || error.message);
    throw error;
  }
};

// API to create a new repeat configuration
export const createRepeat = async (repeat) => {
  try {
    const response = await apiClient.post("/api/repeats", repeat);
    console.log("Repeat configuration created successfully:", response.data);
    return response.data; // Returns the list of associated tasks
  } catch (error) {
    console.error(
      "Failed to create repeat configuration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// API to get a repeat configuration by ID
export const getRepeatById = async (repeatId) => {
  try {
    const response = await apiClient.get(`/api/repeats/${repeatId}`);
    console.log("Fetched repeat configuration:", response.data);
    return response.data; // Returns the Repeat object
  } catch (error) {
    console.error(
      "Failed to fetch repeat configuration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// API to delete a repeat configuration by ID
export const deleteRepeat = async (repeatId) => {
  try {
    const response = await apiClient.delete(`/api/repeats/${repeatId}`);
    console.log("Repeat configuration deleted successfully");
    return response.status; // Returns the HTTP status code
  } catch (error) {
    console.error(
      "Failed to delete repeat configuration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// API to update a repeat configuration by ID
export const updateRepeat = async (repeatId, updatedRepeat) => {
  try {
    const response = await apiClient.put(
      `/api/repeats/${repeatId}`,
      updatedRepeat
    );
    console.log("Repeat configuration updated successfully:", response.data);
    return response.data; // Returns the updated Repeat object
  } catch (error) {
    console.error(
      "Failed to update repeat configuration:",
      error.response?.data || error.message
    );
    throw error;
  }
};

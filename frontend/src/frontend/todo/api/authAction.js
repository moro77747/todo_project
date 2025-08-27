import { authenticateUser, signUp } from "../api/TodoService";

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await authenticateUser(credentials);
    localStorage.setItem("token", response.token);
    localStorage.setItem("tokenIssuedAt", Date.now().toString());
    dispatch({
      type: "auth/loginSuccess",
      payload: { token: response?.token }, // response.token, not response.data.token
    });
  } catch (error) {
    dispatch({
      type: "auth/loginFailure",
      payload: error.response?.data || error.message,
    });
    throw error;
  }
};

export const signupUser = (userData) => async (dispatch) => {
  try {
    await signUp(userData);
    dispatch({ type: "auth/signupSuccess" });
  } catch (error) {
    dispatch({
      type: "auth/signupFailure",
      payload: error.response?.data || error.message,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: "auth/logout" });
};

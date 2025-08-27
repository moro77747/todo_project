const TOKEN_EXPIRY_MINUTES = 1440;
const initialState = {
  isAuthenticated: !!localStorage.getItem("token") && !isTokenExpired(),
  user: null,
  token: !isTokenExpired() ? localStorage.getItem("token") : null,
  error: null,
};

function isTokenExpired() {
  const issuedAt = parseInt(localStorage.getItem("tokenIssuedAt"), 10);
  if (!issuedAt) return true;
  const now = Date.now();
  const diffMinutes = (now - issuedAt) / (1000 * 60);
  return diffMinutes > TOKEN_EXPIRY_MINUTES;
}

export const authenticateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "auth/loginSuccess":
      return {
        ...state,
        isAuthenticated: true,
        user: null,
        token: action.payload.token,
        error: null,
      };
    case "auth/loginFailure":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case "auth/logout":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case "auth/signupSuccess":
      return {
        ...state,
        error: null,
      };
    case "auth/signupFailure":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

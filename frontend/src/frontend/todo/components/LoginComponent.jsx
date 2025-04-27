import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../trash/AuthUtils";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      // Handle successful login (e.g., redirect to dashboard)
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display error message)
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

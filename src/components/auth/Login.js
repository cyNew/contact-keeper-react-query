import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "../../context/AuthState";
import { useAlerts } from "../../context/AlertState";

const login = async (user) => {
  try {
    const res = await axios.post("/api/auth/login", user);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export default function Login(props) {
  const { isAuthenticated, loadUser } = useAuth();
  const { setAlert } = useAlerts();

  const mutation = useMutation(login, {
    onSuccess: (data) => loadUser(data),
    onError: (err) => setAlert(err.message, "danger"),
  });

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
  }, [isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert("Please fill in all fields", "danger");
    } else {
      mutation.mutate({ email, password });
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>

        <input
          type="submit"
          value="Login"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
}

import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import setAuthToken from "../utils/setAuthToken";

const AuthContext = createContext();

const getProfile = async () => {
  try {
    const res = await axios.get("/api/auth");
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  return authContext;
};

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

export default function AuthState(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const load = async (token) => {
      try {
        const user = await getProfile();
        if (user) {
          dispatch({
            type: LOGIN,
            payload: { token, user },
          });
        }
      } catch (error) {

        dispatch({
          type: LOGOUT,
        });
      }
    };

    if (localStorage.token) {
      setAuthToken(localStorage.token);
      load(localStorage.token);
    }
  }, []);

  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  const loadUser = async (data) => {
    const token = data.access_token;
    localStorage.setItem("token", token)
    setAuthToken(token);
    const user = await getProfile();
    dispatch({
      type: LOGIN,
      payload: { token, user },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loadUser,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

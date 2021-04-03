import { createContext, useContext, useReducer } from "react";
import * as uuid from "uuid";

const AlertContext = createContext();

const SET_ALERT = "SET_ALERT";
const REMOVE_ALERT = "REMOVE_ALERT";

export const useAlerts = () => {
  return useContext(AlertContext);
};

function alertReducer(state, action) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];

    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== action.payload);

    default:
      return state;
  }
}

export default function AlertState(props) {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type = "danger", timeout = 5000) => {
    const id = uuid.v4();

    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        type,
        id,
      },
    });

    setTimeout(
      () =>
        dispatch({
          type: REMOVE_ALERT,
          payload: id,
        }),
      timeout
    );
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
}

import { createContext, useContext, useReducer } from "react";

const initialState = {
  current: null,
  filter: null,
};

const ContactContext = createContext();

const useFilter = () => {
  const { filter, setFilter, clearFilter } = useContext(ContactContext);
  return { filter, setFilter, clearFilter };
};

const useCurrent = () => {
  const { setCurrent, clearCurrent, current } = useContext(ContactContext);
  return { current, setCurrent, clearCurrent };
};

const SET_CURRENT = "SET_CURRENT";
const CLEAR_CURRENT = "CLEAR_CURRENT";
const SET_FILTER = "SET_FILTER";
const CLEAR_FILTER = "CLEAR_FILTER";

const contactReducer = (state, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };

    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };

    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
      };

    default:
      return state;
  }
};

export default function ContactState(props) {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const setFilter = (filterText) => {
    dispatch({
      type: SET_FILTER,
      payload: filterText,
    });
  };

  const clearFilter = () => {
    dispatch({
      type: CLEAR_FILTER,
    });
  };

  // Set Current Contact
  const setCurrent = (contact) => {
    dispatch({
      type: SET_CURRENT,
      payload: contact,
    });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({
      type: CLEAR_CURRENT,
    });
  };

  return (
    <ContactContext.Provider
      value={{
        current: state.current,
        filter: state.filter,
        setFilter,
        clearFilter,
        setCurrent,
        clearCurrent,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
}

export { useFilter, useCurrent };

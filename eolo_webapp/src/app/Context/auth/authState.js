import { useState, useEffect, useReducer } from "react";
import AuthContext from "./authContext";
import authTypes from "./authTypes";
import reducer from "./authReducer";

const AuthProvider = ({ children }) => {
  const [initialState, setInitialState] = useState({
    user: {},
    token: null,
    isAuth: false,
  });

  useEffect(() => {
    try {
      const userI = JSON.parse(window.localStorage.getItem("user"));
      const tokenI = JSON.parse(window.localStorage.getItem("token"));

      if (tokenI !== null) {
        setInitialState({
          user: userI,
          token: tokenI,
          isAuth: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (initialState.token !== null) {
      dispatch({
        type: authTypes.LOGIN,
        payload: initialState,
      });
    }
  }, [initialState]);

  const [user, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        user,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

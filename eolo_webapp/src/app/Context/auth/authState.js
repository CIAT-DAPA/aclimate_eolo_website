import { useState, useEffect, useReducer } from "react";
import AuthContext from "./authContext";
import authTypes from "./authTypes";
import reducer from "./authReducer";

const AuthProvider = ({ children }) => {
  const [initialState, setInitialState] = useState({
    user: {},
    isAuth: false,
    loading: true
  });

  useEffect(() => {
    const getLocalStorage = async () => {
      try {
        const userI = await JSON.parse(window.localStorage.getItem("user"));
        if (userI && userI.password !== undefined && userI.user !== undefined) {
          setInitialState({
            user: userI,
            isAuth: true,
            loading: false
          });
        }else{
          setInitialState({
            ...isAuth,
            loading: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLocalStorage()
    return () => {
      console.log('Componente desmontado');
    };
  }, []);

  useEffect(() => {
    if (
      initialState.user &&
      initialState.user.password !== undefined &&
      initialState.user.user !== undefined
    ) {
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

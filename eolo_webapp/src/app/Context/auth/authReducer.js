import authTypes from "./authTypes";


const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case authTypes.LOGIN:

      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("token", JSON.stringify(payload.token));
      return {
        ...state,
        isAuth: true,
        user: payload.user,
        token: payload.token,
      };
    case  (authTypes.UPDATE):
      
        const userI = {
          email: payload.email,
          password: payload.password
        }
        localStorage.setItem("user", JSON.stringify(userI));
        return {
         ...state,
         user: userI,
       };
      
    case authTypes.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuth: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default reducer;
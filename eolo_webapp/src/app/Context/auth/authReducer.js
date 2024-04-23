import authTypes from "./authTypes";


const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case authTypes.LOGIN:

      localStorage.setItem("user", JSON.stringify(payload.user));
      return {
        ...state,
        isAuth: true,
        user: payload.user,
        loading: false
      };
    case  (authTypes.UPDATE):

        return {
          user: payload.user,
          isAuth: payload.isAuth,
          loading: false,
        };
      
    case authTypes.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuth: false,
        user: null,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
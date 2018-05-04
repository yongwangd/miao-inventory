const initialState = {
  user: null,
  loggedIn: false,
  checkingAuth: true
};

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const SET_CHECKING_AUTH = "SET_CHECKING_AUTH";

const userLogin = user => ({
  type: USER_LOGIN,
  payload: user
});

const userLogout = () => ({
  type: USER_LOGOUT
});

const setCheckingAuth = payload => ({
  type: SET_CHECKING_AUTH,
  payload
});

export const actions = {
  userLogin,
  userLogout,
  setCheckingAuth
};

const actionHandler = {
  [USER_LOGIN]: (state, action) => ({
    ...state,
    user: action.payload,
    loggedIn: true,
    checkingAuth: false
  }),
  [USER_LOGOUT]: state => ({
    ...state,
    user: null,
    loggedIn: false,
    checkingAuth: false
  }),
  [SET_CHECKING_AUTH]: (state, action) => ({
    ...state,
    checkStatusPromise: action.pay
  })
};

const authReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default authReducer;

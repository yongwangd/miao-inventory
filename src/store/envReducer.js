const initialState = {
  touchOnly: false
};

export const SET_TOUCH_ONLY = "SET_TOUCH_ONLY";

const setTouchOnly = payload => ({
  type: SET_TOUCH_ONLY,
  payload
});

export const actions = {
  setTouchOnly
};

const actionHandler = {
  [SET_TOUCH_ONLY]: (state, action) => ({ ...state, touchOnly: action.payload })
};

const envReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default envReducer;

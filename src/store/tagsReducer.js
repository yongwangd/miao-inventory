const initialState = {
  initialLoading: true,
  tags: []
};

export const FETCH_TAGS = "FETCH_TAGS";

export const actions = {
  fetchTags: payload => ({
    type: FETCH_TAGS,
    payload
  })
};

const actionHandler = {
  [FETCH_TAGS]: (state, action) => ({
    ...state,
    tags: action.payload,
    initialLoading: false
  })
};

const tagsReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default tagsReducer;
